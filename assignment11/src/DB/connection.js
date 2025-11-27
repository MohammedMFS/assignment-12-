import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL,{
        serverSelectionTimeoutMS:3000
    });
    console.log(" Database connected successfully");
  } catch (error) {
    console.log(" Database connection failed:", error.message);
  }
};





















































