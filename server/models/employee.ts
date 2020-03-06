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
    handler: String,
    employeeNumber: String,
    hireDate: Date,
    position: String,
    startingSalary: String,
    latestSalary: String,
    dateResigned: Date,
    totalBalance: String,
    gender: String,
    birthDate: Date,
    address: String,
    contactNumber: String,
    TIN: String,
    SSS: String,
    philHealth: String,
    pagIbig: String,
    contactName: String,
    contactRelationship: String,
    contactAddress: String,
    contactContactNumber: String,
    photo: String,
    photoType: String,
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
    handler: String,
    employeeNumber: String,
    hireDate: Date,
    position: String,
    startingSalary: String,
    latestSalary: String,
    dateResigned: Date,
    totalBalance: String,
    gender: String,
    birthDate: Date,
    address: String,
    contactNumber: String,
    TIN: String,
    SSS: String,
    philHealth: String,
    pagIbig: String,
    contactName: String,
    contactRelationship: String,
    contactAddress: String,
    contactContactNumber: String,
    photo: String,
    photoType: String,
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
  department?: string;
  handler?: string;
  employeeNumber?: string;
  hireDate?: Date;
  position?: string;
  startingSalar?: string;
  latestSalary?: string;
  dateResigned?: Date;
  totalBalance?: string;
  gender?: string;
  birthDate?: Date;
  address?: string;
  contactNumber?: string;
  TIN?: string;
  SSS?: string;
  philHealth?: string;
  pagIbig?: string;
  contactName?: string;
  contactRelationship?: string;
  contactAddress?: string;
  contactContactNumber?: string;
  photo?: string;
  photoType?: string;
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
