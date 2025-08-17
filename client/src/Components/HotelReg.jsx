import React, { useState, useEffect } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

const HotelReg = () => {
  const { setShowHotelReg, axios, getToken, setIsOwner, setHotel } = useAppContext();
  const { user, isLoaded } = useUser();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!isLoaded || !user) return;

      // 1️⃣ First check Clerk publicMetadata role
      if (user.publicMetadata?.role === "hotelOwner") {
        setIsOwner(true);
        setShowHotelReg(false);
        setLoading(false);
        return;
      }

      // 2️⃣ If not owner in metadata, check in DB
      try {
        const token = await getToken();
        const { data } = await axios.get(`/api/owner/hotel`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success && data.hotel) {
          setHotel(data.hotel);
          setIsOwner(true);
          setShowHotelReg(false);
        }
      } catch (error) {
        console.error("Ownership check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [isLoaded, user]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!isLoaded || !user) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `/api/hotels/`,
        { name, contact, address, city, ownerId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);

        // ✅ Update Clerk metadata so we don't show reg form again
        await user.update({
          publicMetadata: { role: "hotelOwner" }
        });

        setIsOwner(true);
        setHotel({ name, address, contact, city, owner: user.id });
        setShowHotelReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) return null;

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'
      >
        <img
          src={assets.regImage}
          alt="reg-image"
          className='w-1/2 rounded-xl hidden md:block'
        />
        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
            onClick={() => setShowHotelReg(false)}
          />
          <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

          <div className='w-full mt-4'>
            <label className="font-medium text-gray-500">Hotel Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          <div className='w-full mt-4'>
            <label className="font-medium text-gray-500">Phone</label>
            <input
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          <div className='w-full mt-4'>
            <label className="font-medium text-gray-500">Address</label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          <div className='w-full mt-4 max-w-60 mr-auto'>
            <label className='font-medium text-gray-500'>City</label>
            <select
              onChange={(e) => setCity(e.target.value)}
              value={city}
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
              required
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6'>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
