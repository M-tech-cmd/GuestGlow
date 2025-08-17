// routes/ownerRoutes.js
import express from "express";
import { requireAuth } from "@clerk/express";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// GET /api/owner/hotel
router.get("/hotel", requireAuth(), async (req, res) => {
  try {
    // Clerk's authenticated user
    const clerkUserId = req.auth.userId;

    // Look for a hotel where the "owner" field matches Clerk's ID
    const hotel = await Hotel.findOne({ owner: clerkUserId });

    if (!hotel) {
      return res.json({
        success: true,
        hotel: null,
        message: "No hotel registered for this owner."
      });
    }

    return res.json({
      success: true,
      hotel
    });
  } catch (error) {
    console.error("Error fetching owner hotel:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
