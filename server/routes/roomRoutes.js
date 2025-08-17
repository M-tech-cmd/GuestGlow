import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import express from "express";

const roomRouter = express.Router();

// Route to create a new room (max 4 images)
roomRouter.post(
  '/', 
  upload.array("images", 4), 
  protect, 
  createRoom
);

// Route to get all available rooms
roomRouter.get('/', getRooms);

// Route to get all rooms for the logged-in hotel owner
roomRouter.get('/owner', protect, getOwnerRooms);

// Route to toggle room availability
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;
