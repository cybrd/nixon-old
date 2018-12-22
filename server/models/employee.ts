import * as mongoose from 'mongoose';

export const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: String,
    firstName: String,
    lastName: String
  },
  {
    collection: 'employee',
    timestamps: true
  }
);

EmployeeSchema.index(
  {
    employeeId: 1
  },
  {
    name: 'uindex',
    unique: true
  }
);

export const EmployeeCollection = mongoose.model('employee', EmployeeSchema);
