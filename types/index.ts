export interface User {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
}
export interface CompletionRecord {
  date: string; // YYYY-MM-DD format
  completedAt: Date;
}
export interface Habit {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  completions: CompletionRecord[];
  createdAt: Date;
}

export interface HabitWithStatus extends Habit {
  completedToday: boolean;
}