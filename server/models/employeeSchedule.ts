import { model, Document, Schema } from 'mongoose';
import { IEmployee } from './employee';
import { ISchedule } from './schedule';
import { IPayroll } from './payroll';

export const EmployeeScheduleSchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'employee' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
    payrollId: { type: Schema.Types.ObjectId, ref: 'payroll' },
    date: Date,
    modifiedBy: String
  },
  {
    collection: 'employeeSchedule',
    timestamps: true
  }
);

export const EmployeeScheduleArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    employeeId: { type: Schema.Types.ObjectId, ref: 'employee' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
    payrollId: { type: Schema.Types.ObjectId, ref: 'payroll' },
    date: Date,
    modifiedBy: String
  },
  {
    collection: 'employeeScheduleArchive',
    timestamps: true
  }
);

export interface IEmployeeSchedule extends Document {
  oldId?: string;
  employeeId: IEmployee;
  scheduleId: ISchedule;
  payrollId: IPayroll;
  date: Date;
  modifiedBy: string;
}

export const EmployeeScheduleCollection = model<IEmployeeSchedule>(
  'employeeSchedule',
  EmployeeScheduleSchema
);

export const EmployeeScheduleArchiveCollection = model<IEmployeeSchedule>(
  'employeeScheduleArchive',
  EmployeeScheduleArchiveSchema
);
