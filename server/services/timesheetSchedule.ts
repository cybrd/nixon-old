import { list as timesheetList } from './timesheet';
import { listPopulated } from './employeeSchedule';
import { ITimesheet } from '../models/timesheet';

interface ITimestampRange {
  start?: {
    _id?: string;
    value: number;
  };
  end?: {
    _id?: string;
    value: number;
  };
}

interface ITimesheetSchedule {
  _id: string;
  fingerPrintId: string;
  employeeName: string;
  department: string;
  scheduleName: string;
  scheduleType: string;
  payrollName: string;
  workDay: Date;
  workDayTotal: number;
  workDayWorked: number;
  workDayMissing: number;
  lateAllowance: boolean;
  lateAllowanceMissing: number;
  isLate: boolean;
  isAbsent: boolean;
}

export async function list(args = {}, secondary = {}) {
  let workDay;
  let timesheet;
  let queryStart: Date;
  let queryEnd: Date;
  let realStart: Date;
  let realEnd: Date;
  const r: ITimesheetSchedule[] = [];
  const used: string[] = [];

  const employeeSchedule = await listPopulated(args, secondary);
  for (let i = 0; i < employeeSchedule.length; i++) {
    workDay = new Date(employeeSchedule[i].date);
    queryStart = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.startHour, 10) - 18,
      parseInt(employeeSchedule[i].scheduleId.startMinute, 10)
    );
    queryEnd = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.endHour, 10) + 18,
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
    const pairs = getTimesheetPairs(timesheet, used);
    pairs.forEach(p => {
      const tmpSum = sumTimeIntersect(p, {
        start: {
          value: realStart.getTime()
        },
        end: {
          value: realEnd.getTime()
        }
      });

      if (tmpSum) {
        used.push(p.start._id);
        used.push(p.end._id);
        workDayWorked += tmpSum;
      }
    });

    let lateAllowance = null;
    let isLate = null;
    let lateAllowanceMissing = 0;
    const lateAmount = getLateAmount(timesheet, used, realStart.getTime());
    if (lateAmount) {
      if (lateAmount < 15 * 60 * 1000) {
        lateAllowance = true;
        workDayWorked += lateAmount;
        lateAllowanceMissing += lateAmount;
      }
      isLate = true;
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
      department: employeeSchedule[i].employeeId.department,
      scheduleName: employeeSchedule[i].scheduleId.name,
      scheduleType: employeeSchedule[i].scheduleId.type,
      payrollName: employeeSchedule[i].payrollId.name,
      workDay: workDay,
      workDayTotal: workDayTotal,
      workDayWorked: workDayWorked,
      workDayMissing: workDayMissing,
      lateAllowance: lateAllowance,
      lateAllowanceMissing: lateAllowanceMissing,
      isLate: isLate,
      isAbsent: isAbsent
    });
  }

  return r;
}

function getTimesheetPairs(timesheet: ITimesheet[], used: string[]) {
  const pairs: ITimestampRange[] = [];
  let tmpPair: ITimestampRange = {};

  for (let i = 0; i < timesheet.length; i++) {
    if (used.indexOf(timesheet[i]._id) === -1) {
      if (!tmpPair.start) {
        if (timesheet[i].type === 'IN') {
          tmpPair.start = {
            _id: timesheet[i]._id,
            value: timesheet[i].timestamp.getTime()
          };
        }
      }

      if (tmpPair.start && !tmpPair.end) {
        if (timesheet[i].type === 'OUT') {
          tmpPair.end = {
            _id: timesheet[i]._id,
            value: timesheet[i].timestamp.getTime()
          };
          pairs.push(tmpPair);
          tmpPair = {};
        }
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
    rangeTimesheet.start.value < rangeSchedule.start.value
      ? rangeTimesheet
      : rangeSchedule;

  const rangeMax = rangeMin === rangeTimesheet ? rangeSchedule : rangeTimesheet;

  if (rangeMin.end.value < rangeMax.start.value) {
    return 0;
  } else {
    return (
      (rangeMin.end.value < rangeMax.end.value
        ? rangeMin.end.value
        : rangeMax.end.value) - rangeMax.start.value
    );
  }
}

function getLateAmount(
  timesheet: ITimesheet[],
  used: string[],
  realStart: number
) {
  for (let i = 0; i < timesheet.length; i++) {
    if (used.indexOf(timesheet[i]._id) !== -1) {
      if (timesheet[i].type === 'IN') {
        if (realStart > timesheet[i].timestamp.getTime()) {
          return 0;
        } else {
          return timesheet[i].timestamp.getTime() - realStart;
        }
      }
    }
  }

  return 0;
}

export async function summary(args = {}, secondary = {}) {
  const tmp = await list(args, secondary);
  const result: any = {};

  tmp.forEach(x => {
    const id = 'fingerPrintId' + x.fingerPrintId;

    if (!result[id]) {
      result[id] = {
        _id: id,
        fingerPrintId: x.fingerPrintId,
        employeeName: x.employeeName,
        department: x.department,
        payrollName: x.payrollName,
        payrollWorkDayTotal: 0,
        payrollWorkDayWorked: 0,
        payrollWorkOvertime: 0,
        payrollWorkSunday: 0,
        payrollWorkHoliday: 0,
        payrollWorkDayMissing: 0,
        payrollLateAllowance: 0,
        payrollIsLate: 0,
        payrollIsAbsent: 0
      };
    }

    if (x.scheduleType === 'overtime') {
      result[id].payrollWorkOvertime += x.workDayWorked;
    } else if (x.scheduleType === 'sunday') {
      result[id].payrollWorkSunday += x.workDayWorked;

      result[id].payrollLateAllowance += x.lateAllowance ? 1 : 0;
      result[id].payrollIsLate += x.isLate ? 1 : 0;
      result[id].payrollIsAbsent += x.isAbsent ? 1 : 0;
    } else if (x.scheduleType === 'holiday') {
      result[id].payrollWorkHoliday += x.workDayWorked;

      result[id].payrollLateAllowance += x.lateAllowance ? 1 : 0;
      result[id].payrollIsLate += x.isLate ? 1 : 0;
      result[id].payrollIsAbsent += x.isAbsent ? 1 : 0;
    } else {
      result[id].payrollWorkDayTotal += x.workDayTotal;
      result[id].payrollWorkDayWorked += x.workDayWorked;
      result[id].payrollWorkDayMissing += x.workDayMissing;

      result[id].payrollLateAllowance += x.lateAllowance ? 1 : 0;
      result[id].payrollIsLate += x.isLate ? 1 : 0;
      result[id].payrollIsAbsent += x.isAbsent ? 1 : 0;
    }
  });

  return (Object as any).values(result);
}
