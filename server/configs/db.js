import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined in .env file");
    }

    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected");
    });

    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

export default connectDB;
