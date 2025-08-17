import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    assets,
    facilityIcons,
    roomCommonData,
} from "../assets/assets";
import { useState } from "react";
import StarRating from "../Components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
    // From the url parameter we will get the room id and then we will store it a state variable.
    const { id } = useParams();
    const { rooms, getToken, axios, navigate } = useAppContext();
    const [room, setRoom] = useState(null); //State Variable initialised with null .
    const [mainImage, setmainImage] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [guests, setGuests] = useState(1);

    const [isAvailable, setIsAvailable] = useState(false);

    // Check if Room is available
   const checkAvailability = async () => {
    try {
        if (checkInDate >= checkOutDate) {
            toast.error("Please select check-in and check-out dates");
            return;
        }

        if (checkInDate >= checkOutDate) {
            toast.error("Check-Out date must be after Check-In date");
            return;
        }

        const { data } = await axios.post(`/api/bookings/check-availability`, {
            roomId: id,
            checkInDate,
            checkOutDate,
          })

        

        if (data.success) {
            if (data.isAvailable) {
                setIsAvailable(true);
                toast.success("Room is available for booking");
            } else {
                setIsAvailable(false);
                toast.error("Room is not available for booking");
            }
        } else {
            setIsAvailable(false);
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

// onSubmit Handler for Booking
const onSubmitHandler = async (e) => {
    try {
        e.preventDefault();

        if (!isAvailable) {
            return checkAvailability();
        }

        const { data } = await axios.post(
            `/api/bookings/book`,
            {
                roomId: id,         // ✅ must match backend
                checkInDate,
                checkOutDate,
                guests: +guests,    // convert to number
                paymentMethod: "Pay At Hotel"
            },
            {
                headers: { Authorization: `Bearer ${await getToken()}` },
            }
        );

        if (data.success) {
            toast.success(data.message);
            navigate("/my-bookings");
            scrollTo(0, 0);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }
};


// First we will find Rooms in this Function
useEffect(() => {
    const room = rooms.find((room) => room._id === id);

    // Now we will  use a setter function to set this room in the state(room) created above.
    room && setRoom(room);
    room && setmainImage(room.images[0]);
}, [rooms]);
// [] is called here as dependency array.

return (
    room && ( // Here "room &&" means wheh room data  will be available then only return div
        <div className="py-28 md:py-35 px-4 md:px-16 1g:px-24 x1:px-32">
            {/* Room Details */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <h1 className="text-3x] md:text-4xl font-playfair">
                    {room.hotel.name}{" "}
                    <span className="font-inter text-sm">({room.roomType})</span>{" "}
                </h1>
                <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
                    20% OFF{" "}
                </p>
            </div>

            {/* Room Rating */}
            <div className="flex items-center gap-1 mt-2">
                <StarRating />
                <p className="ml-2">300+ reviews</p>
            </div>

            {/* Room Address */}
            <div className="flex items-center gap-1 text-gray-500 mt-2">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
            </div>

            {/* Room Images */}
            <div className="flex flex-col lg:flex-row mt-6 gap-6">
                <div className=" lg:w-1/2 w-full">
                    <img
                        src={mainImage}
                        alt="Room Image"
                        className="w-full rounded-xl shadow-lg object-cover "
                    />
                </div>

                {/* displaying other images */}
                <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
                    {room?.images.length > 1 &&
                        room.images.map((image, index) => (
                            <img
                                onClick={() => setmainImage(image)}
                                key={index}
                                src={image}
                                alt="Room Image"
                                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && "outline-3 outline-orange-500"
                                    } `}
                            />
                        ))}
                </div>
            </div>

            {/* ROOM HIGHLIGHTS */}
            <div className=" flex flex-col md:flex-row  md:justify-between mt-10">
                <div className="flex flex-col ">
                    <h1 className="text-3xl md:text-4xl font-playfair">
                        Experience Luxury Like Never Before
                    </h1>
                    {/* Here We'll display Ameneties */}
                    <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                        {room.amenities.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                            >
                                {/* This👆🏻 Div is converted into a flexbox. */}
                                <img
                                    src={facilityIcons[item]}
                                    alt={item}
                                    className="w-5 h-5"
                                />
                                <p className="text-xs">{item}</p>
                            </div>
                        ))}
                        {/* Here, This aminities is a array so we are map method */}
                    </div>
                </div>
                {/* Room Price */}
                <p className="text-2xl font-medium">Ksh.{room.pricePerNight}/night</p>
            </div>

            {/* CheckIn CheckOut From */}
            <form onSubmit={onSubmitHandler} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">
                {/* Input Fields [on the left side] */}
                <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
                    {/* First Column */}
                    <div className="flex flex-col">
                        <label htmlFor="checkInDate" className="font-medium">
                            Check-In
                        </label>
                        <input
                            onChange={(e) => setCheckInDate(e.target.value)} value={checkInDate}
                            min={new Date().toISOString().split("T")[0]} // Ensuring check-in date is not in the past
                            type="date"
                            id="checkInDate"
                            placeholder="Check-In"
                            className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                            required
                        />
                    </div>

                    {/* adding vertical lines between these diff. div */}
                    <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

                    {/* Second Column */}
                    <div className="flex flex-col">
                        <label htmlFor="checkOutDate" className="font-medium">
                            Check-Out
                        </label>
                        <input
                            onChange={(e) => setCheckOutDate(e.target.value)} value={checkOutDate}
                            min={checkInDate} disabled={!checkInDate} // Ensuring check-out date is after check-in date
                            type="date"
                            id="checkOutDate"
                            placeholder="Check-Out"
                            className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                            required
                        />
                    </div>

                    {/* adding vertical lines between these diff. div */}
                    <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

                    {/* Third Column */}
                    <div className="flex flex-col">
                        <label htmlFor="guests" className="font-medium">
                            Guests
                        </label>
                        <input
                            onChange={(e) => setGuests(e.target.value)} value={guests}
                            type="number"
                            id="guests"
                            placeholder="1"
                            className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                            required
                        />
                    </div>
                </div>

                {/* buttons [on the rifght side ] */}
                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md: mt-6 md: px-25 py-3 md:py-4 text-base cursor-pointer"
                >
                    {isAvailable ? "Book Now" : "Check Availability"}
                </button>
            </form>

            {/* Common Specifications  - Here we'll get the common data from the assets file*/}
            <div className="mt-25 space-y-4">
                {roomCommonData.map((spec, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <img
                            src={spec.icon}
                            alt={"${spec.title}-icon"}
                            className="w-6.5"
                        />
                        {/* {spec.icon} to display each images individually */}
                        <div>
                            <p className="text-base">{spec.title}</p>
                            <p className="text-gray-500">{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Normal Description */}
            <div className="max-w-3xl border-y border-gray-300 mt-15 py-10 text-gray-500">
                <p>
                    Guests will be allocated on the ground floor according to
                    availability. You get a comfortable Two bedroom apartment has a true
                    city feeling. The price quoted is for two guest, at the guest slot
                    please mark the number of guests to get the exact price for groups.
                    The Guests will be allocated ground floor according to availability.
                    You get the comfortable two bedroom apartment that has a true city
                    feeling.
                    {/* before and after this description we have two horizontal lines because we used [border-y border-gray-300] in the className */}
                </p>
            </div>

            {/* Hosted By Section */}
            {/* Here will display the owner details. */}
            <div className="flex flex-col items-start gap-4">
                <div className="flex gap-4 mt-10">
                    <img src={room.hotel.owner.image} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />

                    {/* Owner NAme */}
                    <div>
                        <p className="text-lg md:text-xl">Hosted By- {room.hotel.name}</p>
                        {/* Star Rating */}
                        <div className="flex items-center mt-1">
                            <StarRating />
                            <p className="ml-2">300+ reviews</p>
                        </div>
                    </div>
                </div>
                <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>Contact Now</button>


            </div>

        </div>
    )
);
};

export default RoomDetails;
