import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// Creating API Controller Function
export const registerHotel = async (req, res) => {
  try {
    // Extract hotel details from the request body
    const { name, address, contact, city } = req.body;

    // Get the logged-in user's ID from Clerk auth
    const owner = req.auth.userId; // <-- fix here

    // Check if the user already has a hotel
    const hotel = await Hotel.findOne({ owner });
    if (hotel) {
      return res.json({ success: false, message: "Hotel Already Registered" });
    }

    // Create the hotel
    await Hotel.create({ name, address, contact, city, owner });

    // Update the user's role to "HotelOwner"
    await User.findByIdAndUpdate(owner, { role: "HotelOwner" });

    res.json({ success: true, message: "Hotel Registered Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
