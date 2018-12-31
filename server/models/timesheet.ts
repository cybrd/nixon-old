import { model, Document, Schema } from 'mongoose';

export const TimesheetSchema = new Schema(
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

export const TimesheetArchiveSchema = new Schema(
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

interface ITimesheet extends Document {
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
