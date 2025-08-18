import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import AllRooms from "./Pages/AllRooms";
import RoomDetails from "./Pages/RoomDetails";
import MyBooking from "./Pages/MyBooking";
import HotelReg from "./Components/HotelReg";
import Layout from "./Pages/hotelOwner/Layout";
import Dashboard from "./Pages/hotelOwner/Dashboard";
import AddRoom from "./Pages/hotelOwner/AddRoom";
import ListRoom from "./Pages/hotelOwner/ListRoom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import Loader from "./Components/Loader";

const App = () => {
  // The Navbar will be displayed on all pages but is needed to be hidden from Owner

  // finding pathname of Owner[Admin]
  const isOwnerPath = useLocation().pathname.includes("owner"); //This will return a 
  const { showHotelReg } = useAppContext(); // Fixed: Added parentheses
  
  return (
    <div>
      <Toaster />
      {/* when ever we will be on Owner Path then this Navbar will be hidden */}
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBooking />} />

          <Route path="/loader/:nextUrl" element={<Loader />} />

          {/* Creating new Route for -  Dashboard*/}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;