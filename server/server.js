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
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

// Connect to MongoDB
connectDB();

// Connect to Cloudinary
connectCloudinary();

const app = express();

// ✅ Middleware to save raw body for Stripe Webhooks
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Normal middlewares (after webhook!)
app.use(cors());
app.use(express.json()); // will not affect Stripe route because it's above

// Apply Clerk middleware globally
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
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
