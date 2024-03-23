import mongoose from "mongoose";
import "dotenv/config";
export const dbConnection = async () => {
  const port = process.env.DB_CONNECTION as string;

  try {
    mongoose.connection.on("connected", () => console.log("connected"));
    await mongoose.connect(port);
  } catch (error: any) {
    console.log("Database connection error ", error.message);
  }
};

export const dbTermination = async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};
