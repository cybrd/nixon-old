import { list as timesheetList } from './timesheet';
import { listPopulated } from './employeeSchedule';

export async function list(args = {}) {
  let workDay;
  let start;
  let end;
  let timesheetIn;
  let timesheetOut;
  const employeeSchedule = await listPopulated();

  for (let i = 0; i < employeeSchedule.length; i++) {
    workDay = new Date(employeeSchedule[i].date);
    start = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.startHour, 10) - 2,
      parseInt(employeeSchedule[i].scheduleId.startMinute, 10)
    );
    end = new Date(
      workDay.getFullYear(),
      workDay.getMonth(),
      workDay.getDate(),
      parseInt(employeeSchedule[i].scheduleId.endHour, 10) + 2,
      parseInt(employeeSchedule[i].scheduleId.endMinute, 10)
    );

    timesheetIn = await timesheetList({
      timestamp: { $gte: start, $lte: end },
      type: 'IN'
    });

    timesheetOut = await timesheetList({
      timestamp: { $gte: start, $lte: end },
      type: 'OUT'
    });
  }

  return {};
}
