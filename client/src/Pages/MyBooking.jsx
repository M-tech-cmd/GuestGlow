import React, { useEffect, useState } from "react";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Mybooking = () => {
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchUserBookings = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setBookings(data.bookings || []);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/bookings/stripe-payment",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchUserBookings();
  }, [user]);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips in a few clicks."
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>

        {bookings.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No bookings found.</p>
        )}

        {bookings.map((b) => {
          const hotelName = b.hotel?.name || "Unknown Hotel";
          const roomType = b.room?.roomType || "N/A";
          const imageSrc = b.room?.images?.[0] || assets.placeholderHotel;

          return (
            <div
              key={b._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
            >
              {/* Hotel Details */}
              <div className="flex flex-col md:flex-row">
                <img
                  src={imageSrc}
                  alt={`${hotelName} - ${roomType}`}
                  className="min-md:w-44 rounded shadow object-cover"
                />
                <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                  <p className="font-playfair text-2xl">
                    {hotelName}
                    <span className="font-inter text-sm"> ({roomType})</span>
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{b.hotel?.address || "No address"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <img src={assets.guestsIcon} alt="guests-icon" />
                    <span>Guests: {b.guests || 0}</span>
                  </div>
                  <p>Total: Ksh.{b.totalPrice || 0}</p>
                </div>
              </div>

              {/* Date Info */}
              <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p>Check-In:</p>
                  <p className="text-gray-500 text-sm">
                    {b.checkInDate
                      ? new Date(b.checkInDate).toDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-gray-500 text-sm">
                    {b.checkOutDate
                      ? new Date(b.checkOutDate).toDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex flex-col items-start justify-center pt-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      b.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      b.isPaid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {b.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>

                {!b.isPaid && (
                  <button
                    onClick={() => handlePayment(b._id)}
                    className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mybooking;
