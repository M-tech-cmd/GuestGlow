import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

// API to create a new Room for a Hotel
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: "No images uploaded" });
    }

    // Find the hotel by owner
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel Found" });
    }

    // Upload multiple images to Cloudinary
    const images = await Promise.all(
      req.files.map(file => cloudinary.uploader.upload(file.path).then(res => res.secure_url))
    );

    // Save the room to DB
    const newRoom = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: JSON.parse(amenities),
      images,
      isAvailable: true
    });

    res.json({ success: true, message: "Room Created Successfully", room: newRoom });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get All Rooms
export const getRooms = async (req, res) => {
  try {
    const filter = req.query.available === "true" ? { isAvailable: true } : {};
    const rooms = await Room.find(filter)
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get All Rooms for a Specific Owner's Hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotelData) {
      return res.json({ success: false, message: "No hotel found for this owner" });
    }

    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to toggle availability of a Room
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) return res.json({ success: false, message: "Room ID is required" });

    const roomData = await Room.findById(roomId);
    if (!roomData) return res.json({ success: false, message: "Room not found" });

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();

    res.json({
      success: true,
      message: "Room Availability Updated",
      isAvailable: roomData.isAvailable,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
