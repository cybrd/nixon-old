import * as mongoose from 'mongoose';

export const TimesheetSchema = new mongoose.Schema(
  {
    employeeId: String,
    timestamp: Date,
    type: String,
    manualAdded: Boolean
  },
  {
    collection: 'timesheet',
    timestamps: true
  }
);

export const TimesheetCollection = mongoose.model('timesheet', TimesheetSchema);
