import mongoose, { Schema } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  createdAt: Date;
}
const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, "Email is mandatory"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is mandatory"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model<User>("User", userSchema);

export default User;
