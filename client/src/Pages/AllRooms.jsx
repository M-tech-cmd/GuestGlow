import React, { useState } from "react";
import { assets, facilityIcons } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarRating from "../Components/StarRating";
import { useAppContext } from "../context/AppContext";

// CheckBox Component
const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

// RadioButton Component
const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate } = useAppContext();
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRange = ["2000 to 5000", "1000 to 2000", "500 to 1000", "0 to 500"];
  const sortOptions = ["price Low to High", "price High to Low", "Newest First"];

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (checked) updated[type].push(value);
      else updated[type] = updated[type].filter((item) => item !== value);
      return updated;
    });
  };

  const handleSortChange = (sortOption) => setSelectedSort(sortOption);

  const getFilteredAndSortedRooms = () => {
    if (!rooms || rooms.length === 0) return [];

    let filtered = rooms.filter((room) => {
      const roomTypeMatch =
        selectedFilters.roomType.length === 0 ||
        selectedFilters.roomType.includes(room.roomType);

      const priceMatch =
        selectedFilters.priceRange.length === 0 ||
        selectedFilters.priceRange.some((range) => {
          const [min, max] = range.split(" to ").map(Number);
          return room.pricePerNight >= min && room.pricePerNight <= max;
        });

      return roomTypeMatch && priceMatch;
    });

    if (selectedSort === "price Low to High") {
      filtered.sort((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));
    } else if (selectedSort === "price High to Low") {
      filtered.sort((a, b) => Number(b.pricePerNight) - Number(a.pricePerNight));
    } else if (selectedSort === "Newest First") {
      filtered.sort(
        (a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
      );
    }

    return filtered;
  };

  const filteredRooms = getFilteredAndSortedRooms();

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Right Side - Rooms */}
      <div className="flex-1">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms For You</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-[74ch]">
            Take advantage of our limited-time offers and special packages to enhance your stay.
          </p>
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
          </div>
        )}

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images?.[0] || assets.uploadArea}
              alt="hotel-img"
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />

            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel?.city || "City not available"}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel?.name || "Hotel name not available"}
              </p>

              <div className="flex items-center">
                <StarRating />
                <p className="ml-2">300+ reviews</p>
              </div>

              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel?.address || "Address not available"}</span>
              </div>

              {/* Amenities with icons */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities?.map((item, index) => {
                  const normalizedKey = item.trim().toLowerCase();
                  const iconKey = Object.keys(facilityIcons).find(
                    (key) => key.trim().toLowerCase() === normalizedKey
                  );

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img
                        src={iconKey ? facilityIcons[iconKey] : assets.uploadArea}
                        alt={item}
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{item}</p>
                    </div>
                  );
                })}
              </div>

              <p className="text-xl font-medium text-gray-700">
                Ksh. {Number(room.pricePerNight).toLocaleString()} /night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Left Side - Filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        <div
          className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden">
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span
              className="hidden lg:block cursor-pointer"
              onClick={() => {
                setSelectedFilters({ roomType: [], priceRange: [] });
                setSelectedSort("");
              }}
            >
              CLEAR
            </span>
          </div>
        </div>

        <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Room Type</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedFilters.roomType.includes(room)}
                onChange={(checked, value) => handleFilterChange(checked, value, "roomType")}
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRange.map((range, index) => (
              <CheckBox
                key={index}
                label={`Ksh ${range}`}
                selected={selectedFilters.priceRange.includes(`Ksh ${range}`)}
                onChange={(checked, value) => handleFilterChange(checked, value, "priceRange")}
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort by</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={handleSortChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
