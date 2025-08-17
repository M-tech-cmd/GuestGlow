import Booking from '../models/Booking.js'
import Room from '../models/Room.js'
import Hotel from '../models/Hotel.js'
import transporter from '../configs/nodemailer.js';

// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
        return false; // Return false on error to be safe
    }
}

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        res.json({ success: true, isAvailable })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, roomId, guests } = req.body;
        const user = req.user._id;

        if (!roomId) {
            return res.status(400).json({ success: false, message: "Room ID is required" });
        }

        // Before Booking Check Availability
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room: roomId });

        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Room is not available" });
        }

        // Get Room Data
        const roomData = await Room.findById(roomId).populate("hotel");
        if (!roomData) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        if (!roomData.hotel) {
            return res.status(400).json({ success: false, message: "Hotel data missing for this room" });
        }

        // Calculate total price
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
        const totalPrice = roomData.pricePerNight * nights;

        const booking = await Booking.create({
            user,
            room: roomId,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        // Email configuration with debugging
        const mailOptions = {
  from: '"GuestGlow Hotel Bookings" <kimaniemma20@gmail.com>', // ✅ must match verified sender
  to: req.user.email,
  subject: "Hotel Booking Confirmation",
  replyTo: "kimaniemma20@gmail.com", // ✅ safe to match
  html: `
    <h2>Your Booking Details</h2>
    <p>Dear ${req.user.username},</p>
    <p>Thank you for your booking! Here are your details:</p>
    <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
        <li><strong>Location:</strong> ${roomData.hotel.address}</li>
        <li><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
        <li><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toDateString()}</li>
        <li><strong>Number of Nights:</strong> ${nights}</li>
        <li><strong>Guests:</strong> ${booking.guests}</li>
        <li><strong>Total Amount:</strong> ${process.env.CURRENCY || 'Ksh'} ${booking.totalPrice}</li>
    </ul>
    <p>We look forward to welcoming you!</p>
    <p>If you have any questions or need to make changes, feel free to contact us.</p>
  `
};


        try {
            console.log('Attempting to send email to:', req.user.email);
            console.log('SMTP Configuration:', {
                user: process.env.SMTP_USER,
                hasPassword: !!process.env.SMTP_PASS,
                senderEmail: process.env.SENDER_EMAIL
            });

            const emailResult = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', emailResult.messageId);
            
            res.json({ 
                success: true, 
                message: "Booking created successfully and confirmation email sent",
                booking: booking
            });

        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            
            // Still return success for booking creation, but mention email issue
            res.json({ 
                success: true, 
                message: "Booking created successfully, but confirmation email failed to send",
                booking: booking,
                emailError: emailError.message
            });
        }

    } catch (error) {
        console.log("Booking creation error:", error);
        // Fix the typo: was res.json(500).json(...) should be res.status(500).json(...)
        res.status(500).json({ success: false, message: "Failed to create booking" });
    }
};

// API to get all bookings for user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to fetch bookings" })
    }
}

// API to get hotel bookings (for hotel owners)
// GET /api/bookings/hotel
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId })
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel found" })
        }
        
        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 })

        // Total Bookings
        const totalBookings = bookings.length;
        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)

        res.json({ 
            success: true, 
            dashboardData: { 
                totalBookings, 
                totalRevenue, 
                bookings 
            } 
        })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to fetch bookings" })
    }
}