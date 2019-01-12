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
  scheduleName: string;
  workDay: Date;
  workDayTotal: number;
  workDayWorked: number;
}

export async function list(args = {}) {
  let workDay;
  let timesheet;
  let start: Date;
  let end: Date;
  let realStart: Date;
  let realEnd: Date;
  const r: ITimesheetSchedule[] = [];

  const employeeSchedule = await listPopulated(args);
  for (let i = 0; i < employeeSchedule.length; i++) {
    workDay = new Date(employeeSchedule[i].date);
    start = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.startHour, 10) - 10,
      parseInt(employeeSchedule[i].scheduleId.startMinute, 10)
    );
    end = new Date(
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

    timesheet = await timesheetList({
      fingerPrintId: employeeSchedule[i].employeeId.fingerPrintId,
      timestamp: { $gt: start, $lt: end }
    });

    let workDayWorked = 0;
    const pairs = getTimesheetPairs(timesheet);
    pairs.forEach(p => {
      workDayWorked += sumTimeIntersect(p, {
        start: realStart.getTime(),
        end: realEnd.getTime()
      });
    });

    r.push({
      _id: employeeSchedule[i]._id + employeeSchedule[i].employeeId,
      fingerPrintId: employeeSchedule[i].employeeId.fingerPrintId,
      scheduleName: employeeSchedule[i].scheduleId.name,
      workDay: workDay,
      workDayTotal: realEnd.getTime() - realStart.getTime(),
      workDayWorked: workDayWorked
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
