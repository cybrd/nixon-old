import { list as timesheetList } from './timesheet';
import { listPopulated } from './employeeSchedule';
import { ITimesheet } from '../models/timesheet';

interface ITimestampRange {
  start?: number;
  end?: number;
}

interface ITimesheetSchedule {
  _id: string;
  fingerPrintId: string;
  employeeName: string;
  scheduleName: string;
  scheduleType: string;
  payrollName: string;
  workDay: Date;
  workDayTotal: number;
  workDayWorked: number;
  workDayMissing: number;
  lateAllowance: boolean;
  isLate: boolean;
  isAbsent: boolean;
}

export async function list(args = {}) {
  let workDay;
  let timesheet;
  let queryStart: Date;
  let queryEnd: Date;
  let realStart: Date;
  let realEnd: Date;
  const r: ITimesheetSchedule[] = [];

  const employeeSchedule = await listPopulated(args);
  for (let i = 0; i < employeeSchedule.length; i++) {
    workDay = new Date(employeeSchedule[i].date);
    queryStart = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.startHour, 10) - 10,
      parseInt(employeeSchedule[i].scheduleId.startMinute, 10)
    );
    queryEnd = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.endHour, 10) + 10,
      parseInt(employeeSchedule[i].scheduleId.endMinute, 10)
    );
    realStart = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.startHour, 10),
      parseInt(employeeSchedule[i].scheduleId.startMinute, 10)
    );
    realEnd = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.endHour, 10),
      parseInt(employeeSchedule[i].scheduleId.endMinute, 10)
    );

    timesheet = await timesheetList(
      {
        fingerPrintId: employeeSchedule[i].employeeId.fingerPrintId,
        timestamp: { $gt: queryStart, $lt: queryEnd }
      },
      1
    );

    let workDayWorked = 0;
    const pairs = getTimesheetPairs(timesheet);
    pairs.forEach(p => {
      workDayWorked += sumTimeIntersect(p, {
        start: realStart.getTime(),
        end: realEnd.getTime()
      });
    });

    let lateAllowance = null;
    let isLate = null;
    if (getLateAmount(timesheet, realStart.getTime())) {
      const lateAmount = getLateAmount(timesheet, realStart.getTime());
      if (lateAmount < 15 * 60 * 1000) {
        lateAllowance = true;
        workDayWorked += lateAmount;
      } else {
        isLate = true;
      }
    }

    const workDayTotal = realEnd.getTime() - realStart.getTime();

    let workDayMissing = 0;
    let isAbsent = false;
    if (workDayWorked) {
      workDayMissing = workDayTotal - workDayWorked;
    } else {
      isAbsent = true;
    }

    r.push({
      _id: employeeSchedule[i]._id + employeeSchedule[i].employeeId._id,
      fingerPrintId: employeeSchedule[i].employeeId.fingerPrintId,
      employeeName: employeeSchedule[i].employeeId.name,
      scheduleName: employeeSchedule[i].scheduleId.name,
      scheduleType: employeeSchedule[i].scheduleId.type,
      payrollName: employeeSchedule[i].payrollId.name,
      workDay: workDay,
      workDayTotal: workDayTotal,
      workDayWorked: workDayWorked,
      workDayMissing: workDayMissing,
      lateAllowance: lateAllowance,
      isLate: isLate,
      isAbsent: isAbsent
    });
  }

  return r;
}

function getTimesheetPairs(timesheet: ITimesheet[]) {
  const pairs: ITimestampRange[] = [];
  let tmpPair: ITimestampRange = {};

  for (let i = 0; i < timesheet.length; i++) {
    if (!tmpPair.start) {
      if (timesheet[i].type === 'IN') {
        tmpPair.start = timesheet[i].timestamp.getTime();
      }
    }

    if (tmpPair.start && !tmpPair.end) {
      if (timesheet[i].type === 'OUT') {
        tmpPair.end = timesheet[i].timestamp.getTime();
        pairs.push(tmpPair);
        tmpPair = {};
      }
    }
  }

  return pairs;
}

function sumTimeIntersect(
  rangeTimesheet: ITimestampRange,
  rangeSchedule: ITimestampRange
) {
  const rangeMin =
    rangeTimesheet.start < rangeSchedule.start ? rangeTimesheet : rangeSchedule;

  const rangeMax = rangeMin === rangeTimesheet ? rangeSchedule : rangeTimesheet;

  if (rangeMin.end < rangeMax.start) {
    return 0;
  } else {
    return (
      (rangeMin.end < rangeMax.end ? rangeMin.end : rangeMax.end) -
      rangeMax.start
    );
  }
}

function getLateAmount(timesheet: ITimesheet[], realStart: number) {
  for (let i = 0; i < timesheet.length; i++) {
    if (timesheet[i].type === 'IN') {
      if (realStart > timesheet[i].timestamp.getTime()) {
        return 0;
      } else {
        return timesheet[i].timestamp.getTime() - realStart;
      }
    }
  }

  return 0;
}

export async function summary(args = {}) {
  const tmp = await list(args);
  const result: any = {};

  tmp.forEach(x => {
    const id = 'fingerPrintId' + x.fingerPrintId;

    if (!result[id]) {
      result[id] = {
        _id: id,
        fingerPrintId: x.fingerPrintId,
        employeeName: x.employeeName,
        payrollName: x.payrollName,
        payrollWorkDayTotal: 0,
        payrollWorkDayWorked: 0,
        payrollWorkOvertime: 0,
        payrollWorkDayMissing: 0,
        payrollLateAllowance: 0,
        payrollIsAbsent: 0
      };
    }

    if (x.scheduleType === 'overtime') {
      result[id].payrollWorkOvertime += x.workDayWorked;
    } else {
      result[id].payrollWorkDayTotal += x.workDayTotal;
      result[id].payrollWorkDayWorked += x.workDayWorked;
      result[id].payrollWorkDayMissing += x.workDayMissing;
      result[id].payrollLateAllowance += x.lateAllowance ? 1 : 0;
      result[id].payrollIsAbsent += x.isAbsent ? 1 : 0;
    }
  });

  return (Object as any).values(result);
}
