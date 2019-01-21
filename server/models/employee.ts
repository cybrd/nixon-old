import { model, Document, Schema } from 'mongoose';

const EmployeeNotStrictSchema = new Schema(
  {},
  {
    collection: 'employee',
    timestamps: true,
    strict: false
  }
);

const EmployeeSchema = new Schema(
  {
    fingerPrintId: String,
    name: String,
    department: String,
    modifiedBy: String
  },
  {
    collection: 'employee',
    timestamps: true
  }
);

const EmployeeArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    fingerPrintId: String,
    name: String,
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
  name: string;
  department: string;
  modifiedBy: string;
}

export const EmployeeCollection = model<IEmployee>('employee', EmployeeSchema);
export const EmployeeArchiveCollection = model<IEmployee>(
  'employeeArchive',
  EmployeeArchiveSchema
);
export const EmployeeNotStrictCollection = model<IEmployee>(
  'employeeNotStrict',
  EmployeeNotStrictSchema
);
