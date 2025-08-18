import Booking from '../models/Booking.js'
import Room from '../models/Room.js'
import Hotel from '../models/Hotel.js'
import transporter from '../configs/nodemailer.js';
import Stripe from "stripe";

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
console.log('=== SMTP DEBUG INFO ===');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS exists:', !!process.env.SMTP_PASS);
console.log('SMTP_PASS first 4 chars:', process.env.SMTP_PASS?.substring(0, 4) + '...');
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);
console.log('Environment:', process.env.NODE_ENV);

// Test connection before sending
try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
} catch (verifyError) {
    console.error('❌ SMTP verification failed:', verifyError.message);
}

// Corrected mail options - use SENDER_EMAIL for from/replyTo
const mailOptions = {
    from: `"GuestGlow Hotel Bookings" <${process.env.SENDER_EMAIL}>`, // ✅ Use verified sender email
    to: req.user.email,
    subject: "Hotel Booking Confirmation",
    replyTo: process.env.SENDER_EMAIL, // ✅ Use verified sender email
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563eb;">Your Booking Details</h2>
  <p>Dear ${req.user.username},</p>
  <p>Thank you for your booking! Here are your details:</p>
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <ul style="list-style: none; padding: 0;">
      <li style="margin: 8px 0;"><strong>Booking ID:</strong> ${booking._id}</li>
      <li style="margin: 8px 0;"><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
      <li style="margin: 8px 0;"><strong>Location:</strong> ${roomData.hotel.address}</li>
      <li style="margin: 8px 0;"><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
      <li style="margin: 8px 0;"><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toDateString()}</li>
      <li style="margin: 8px 0;"><strong>Number of Nights:</strong> ${nights}</li>
      <li style="margin: 8px 0;"><strong>Guests:</strong> ${booking.guests}</li>
      <li style="margin: 8px 0;"><strong>Total Amount:</strong> ${process.env.CURRENCY || 'Ksh'} ${booking.totalPrice}</li>
    </ul>
  </div>
  <p>We look forward to welcoming you!</p>
  <p>If you have any questions or need to make changes, feel free to contact us.</p>
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message from GuestGlow Hotel Bookings.</p>
</div>
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

export const getUserBookings = async (req, res) => {
  try {
    // Clerk: call req.auth() instead of accessing req.auth directly
    const { userId } = req.auth();  

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};


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


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // 1. Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.json({ success: false, message: "Booking not found" });

    // 2. Find room + hotel
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = Number(booking.totalPrice);
    const { origin } = req.headers;

    // 3. Create checkout session
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.roomType || "Room",
            images: [
              roomData.images?.[0] || "https://via.placeholder.com/150",
            ],
          },
          unit_amount: totalPrice * 100, // cents
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {
        bookingId: booking._id.toString(), // ✅ make sure it's a string
      },
    });

    // 4. Send session URL back to frontend
    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.json({ success: false, message: "Payment Failed" });
  }
};