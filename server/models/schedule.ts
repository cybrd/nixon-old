import { model, Document, Schema } from 'mongoose';

const ScheduleSchema = new Schema(
  {
    name: String,
    startHour: String,
    startMinute: String,
    endHour: String,
    endMinute: String,
    type: String,
    modifiedBy: String
  },
  {
    collection: 'schedule',
    timestamps: true
  }
);

const ScheduleArchiveSchema = new Schema(
  {
    oldId: Schema.Types.ObjectId,
    name: String,
    startHour: String,
    startMinute: String,
    endHour: String,
    endMinute: String,
    type: String,
    modifiedBy: String
  },
  {
    collection: 'scheduleArchive',
    timestamps: true
  }
);

ScheduleSchema.index(
  {
    name: 1
  },
  {
    name: 'uindex',
    unique: true
  }
);

export interface ISchedule extends Document {
  oldId?: string;
  name: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  type: string;
  modifiedBy: string;
}

export const ScheduleCollection = model<ISchedule>('schedule', ScheduleSchema);

export const ScheduleArchiveCollection = model<ISchedule>(
  'scheduleArchive',
  ScheduleArchiveSchema
);
