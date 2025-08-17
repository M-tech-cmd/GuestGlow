import React from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const FeaturedDestinations = () => {
  const { rooms, navigate} = useAppContext();


  return rooms.length > 0 && (
    //                                                         lg:px-15 is used for spacing .
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-15 bg-slate-50 py-20'> 

    <Title title='Featured Destination' subTitle=' Discover our selection of exeptional properties around the globe, offering unparalled
    luxury and unforgettable experiences!'/>
   
    {/* Here in this div we've Mounted all the Hotel Cards */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {/* Using Dummy Hotel Data From Assets */}
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

{/* Adding here ScrollTo(0,0) So it can scroll the webpage to the Top. */}
      <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}}
      className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        
        View All Destinations

      </button>
    </div>
  );
};

export default FeaturedDestinations;

// We will mount this Featured Destination Component in Our HomePage.
