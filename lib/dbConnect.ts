import mongoose from "mongoose";

type ConnObjType = {
  isConnected?: number;
};

let connObj: ConnObjType = {};

export const connectDb = async () => {
  mongoose.set("strictQuery", true);

  const mongo_url = process.env.MONGO_URL;
  if (!mongo_url) throw new Error("The connection string is not available");
  if (connObj.isConnected) {
    console.log("Mongo already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(mongo_url, {
      dbName: process.env.DB_NAME || "habit_tracker",
    });
    connObj.isConnected = conn.connections[0].readyState;
    console.log("Database connected");
  } catch (error) {
    console.log("Mongo DB connection error \n", error);
  }
};
