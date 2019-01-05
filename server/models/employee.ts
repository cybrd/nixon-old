import { model, Document, Schema } from 'mongoose';

export const EmployeeSchema = new Schema(
  {
    fingerPrintId: String,
    firstName: String,
    lastName: String,
    department: String,
    modifiedBy: String
  },
  {
    collection: 'employee',
    timestamps: true
  }
);

export const EmployeeArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    fingerPrintId: String,
    firstName: String,
    lastName: String,
    department: String,
    modifiedBy: String
  },
  {
    collection: 'employeeArchive',
    timestamps: true
  }
);

EmployeeSchema.index(
  {
    fingerPrintId: 1
  },
  {
    name: 'uindex',
    unique: true
  }
);

export interface IEmployee extends Document {
  oldId?: string;
  fingerPrintId: string;
  firstName: string;
  lastName: string;
  department: string;
  modifiedBy: string;
}

export const EmployeeCollection = model<IEmployee>('employee', EmployeeSchema);
export const EmployeeArchiveCollection = model<IEmployee>(
  'employeeArchive',
  EmployeeArchiveSchema
);
