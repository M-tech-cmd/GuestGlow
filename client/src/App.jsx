import React from "react";
import Navbar from "./Components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Footer from "./Components/Footer";
import AllRooms from "./Pages/AllRooms";
import RoomDetails from "./Pages/RoomDetails";
import MyBooking from "./Pages/MyBooking";
import HotelRegistration from "./Components/HotelRegistration";
import Layout from "./Pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";

const App = () => {
  // The Navbar will be displayed on all pages but is needed to be hidden from Owner

  // finding pathname of Owner[Admin]
  const isOwnerPath = useLocation().pathname.includes("owner"); //This will return a Boolean
  return (
    <div>
      {/* when ever we will be on Owner Path then this Navbar will be hidden */}
      {!isOwnerPath && <Navbar />}
      {false &&  <HotelRegistration/>}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/rooms" element={<AllRooms />} />
           <Route path="/rooms/:id" element={<RoomDetails/>} />
           <Route path="/my-bookings" element={<MyBooking/>} />
            {/* Creating new Route for -  Dashboard*/}
          <Route path="/owner" element={<Layout/>} >
          <Route index element={<Dashboard/>} />
          <Route path="add-room" element={<AddRoom/>} />
          <Route path="list-room" element={<ListRoom/>} />

          </Route>
        </Routes>
      </div>
        <Footer/>
    </div>
  );
};

export default App;
