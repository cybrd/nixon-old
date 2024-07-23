import { Router } from 'express';

import { UserCtrl } from './controllers/user';
import { TimesheetCtrl } from './controllers/timesheet';
import { EmployeeCtrl } from './controllers/employee';
import { ScheduleCtrl } from './controllers/schedule';
import { PayrollCtrl } from './controllers/payroll';
import { EmployeeScheduleCtrl } from './controllers/employeeSchedule';
import { TimesheetScheduleCtrl } from './controllers/timesheetSchedule';

export const router = Router();

router.use('/api/user', UserCtrl);
router.use('/api/timesheet', TimesheetCtrl);
router.use('/api/employee', EmployeeCtrl);
router.use('/api/schedule', ScheduleCtrl);
router.use('/api/payroll', PayrollCtrl);
router.use('/api/employeeSchedule', EmployeeScheduleCtrl);
router.use('/api/timesheetSchedule', TimesheetScheduleCtrl);
