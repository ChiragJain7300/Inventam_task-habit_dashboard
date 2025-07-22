import mongoose, { Schema } from "mongoose";
export interface ICompletionRecord {
  date: string;
  completedAt: Date;
}
export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  completions: ICompletionRecord[];
  createdAt: Date;
}
const CompletionRecordSchema: Schema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);
const habitSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Habit name is mandatory"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  completions: [CompletionRecordSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Habit =
  mongoose.models.Habit || mongoose.model<IHabit>("Habit", habitSchema);

export default Habit;
