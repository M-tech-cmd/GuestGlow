import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Connect to MongoDB
connectDB();

// Connect to Cloudinary
connectCloudinary();

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON

// Apply Clerk middleware globally so req.auth is available everywhere
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// Clerk Webhooks API
app.use("/api/clerk", clerkWebhooks);

// Public test endpoint
app.get("/", (req, res) => res.send("API is working."));

// Routes
app.use("/api/user", userRouter); // user data like role, searchedCities
app.use("/api/hotels", hotelRouter); // new hotel registration
app.use("/api/rooms", roomRouter); // room-related endpoints
app.use("/api/bookings", bookingRouter); // booking-related endpoints

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
