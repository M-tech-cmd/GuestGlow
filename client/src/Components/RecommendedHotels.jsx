import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  // Filter rooms based on searchedCities
  const filterHotels = () => {
    const filteredHotels = rooms.filter(room =>
      searchedCities.includes(room.hotel.city)
    );
    setRecommended(filteredHotels);
  };

  useEffect(() => {
    filterHotels();
  }, [rooms, searchedCities]);

  if (rooms.length === 0) return null; // no data

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-15 bg-slate-50 py-20">
      <Title
        title="Recommended Hotels"
        subTitle="Discover our selection of exceptional properties around the globe, offering unparalleled luxury and unforgettable experiences!"
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {recommended.length > 0
          ? recommended.slice(0, 4).map((room, index) => (
              <HotelCard key={room._id} room={room} index={index} />
            ))
          : rooms.slice(0, 4).map((room, index) => (
              <HotelCard key={room._id} room={room} index={index} />
            ))}
      </div>
    </div>
  );
};

export default RecommendedHotels;
