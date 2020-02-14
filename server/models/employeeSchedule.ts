import { model, Document, Schema } from 'mongoose';
import { IEmployee } from './employee';
import { ISchedule } from './schedule';
import { IPayroll } from './payroll';

const EmployeeScheduleSchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'employee' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
    payrollId: { type: Schema.Types.ObjectId, ref: 'payroll' },
    date: Date,
    notes: String,
    modifiedBy: String
  },
  {
    collection: 'employeeSchedule',
    timestamps: true
  }
);

const EmployeeScheduleArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    employeeId: { type: Schema.Types.ObjectId, ref: 'employee' },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule' },
    payrollId: { type: Schema.Types.ObjectId, ref: 'payroll' },
    date: Date,
    notes: String,
    modifiedBy: String
  },
  {
    collection: 'employeeScheduleArchive',
    timestamps: true
  }
);

EmployeeScheduleSchema.index(
  {
    employeeId: 1,
    scheduleId: 1,
    payrollId: 1,
    date: 1
  },
  {
    name: 'uindex',
    unique: true
  }
);

export interface IEmployeeSchedule extends Document {
  oldId?: string;
  employeeId: IEmployee;
  scheduleId: ISchedule;
  payrollId: IPayroll;
  date: Date;
  notes: string;
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
