import { model, Document, Schema } from 'mongoose';

const TimesheetSchema = new Schema(
  {
    fingerPrintId: String,
    timestamp: Date,
    type: String,
    manualAdded: Boolean,
    modifiedBy: String
  },
  {
    collection: 'timesheet',
    timestamps: true
  }
);

const TimesheetArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    fingerPrintId: String,
    timestamp: Date,
    type: String,
    manualAdded: Boolean,
    modifiedBy: String
  },
  {
    collection: 'timesheetArchive',
    timestamps: true
  }
);

TimesheetSchema.index(
  {
    fingerPrintId: 1,
    timestamp: 1,
    type: 1
  },
  {
    name: 'uindex',
    unique: true
  }
);

export interface ITimesheet extends Document {
  oldId?: string;
  fingerPrintId: string;
  timestamp: Date;
  type: string;
  manualAdded: boolean;
  modifiedBy: string;
}

export const TimesheetCollection = model<ITimesheet>(
  'timesheet',
  TimesheetSchema
);
export const TimesheetArchiveCollection = model<ITimesheet>(
  'timesheetArchive',
  TimesheetArchiveSchema
);
