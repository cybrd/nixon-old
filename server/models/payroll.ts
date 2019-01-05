import { model, Document, Schema } from 'mongoose';

export const PayrollSchema = new Schema(
  {
    name: String,
    modifiedBy: String
  },
  {
    collection: 'payroll',
    timestamps: true
  }
);

export const PayrollArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    name: String,
    modifiedBy: String
  },
  {
    collection: 'payrollArchive',
    timestamps: true
  }
);

PayrollSchema.index(
  {
    name: 1
  },
  {
    name: 'uindex',
    unique: true
  }
);

export interface IPayroll extends Document {
  oldId?: string;
  name: string;
  modifiedBy: string;
}

export const PayrollCollection = model<IPayroll>('payroll', PayrollSchema);
export const PayrollArchiveCollection = model<IPayroll>(
  'payrollArchive',
  PayrollArchiveSchema
);
