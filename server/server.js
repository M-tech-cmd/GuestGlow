import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

// Connect to MongoDB
connectDB();

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON
app.use(clerkMiddleware()); // Clerk authentication middleware

// Clerk Webhooks API
app.use("/api/clerk", clerkWebhooks);

// Test endpoint
app.get("/", (req, res) => res.send("API is working."));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
