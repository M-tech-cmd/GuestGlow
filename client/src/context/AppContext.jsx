import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "ksh";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [ownerRooms, setOwnerRooms] = useState([]); // ✅ new state
  const [loading, setLoading] = useState(false);

  // Fetch all rooms for public site
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/rooms");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch rooms for logged-in owner
  const fetchOwnerRooms = async () => {
    try {
      if (!user) return;
      const token = await getToken();
      if (!token) return;

      setLoading(true);
      const { data } = await axios.get("/api/owner/rooms", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setOwnerRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching owner rooms:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkHotelOwnership = async () => {
    try {
      if (!user) return;

      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/hotels/my-hotels", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success && data.hotels?.length > 0) {
        setIsOwner(true);
      }
    } catch (error) {
      console.log("Error checking hotel ownership:", error);
    }
  };

  const fetchUser = async () => {
    try {
      if (!user) return;

      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        const isHotelOwner =
          data.role?.toLowerCase() === "hotelowner" ||
          data.hotels?.length > 0 ||
          data.isOwner === true ||
          data.hasHotel === true;

        setIsOwner(isHotelOwner);
        setSearchedCities(data.recentSearchedCities || []);

        if (!isHotelOwner) {
          checkHotelOwnership();
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    setSearchedCities,
    searchedCities,
    rooms,
    ownerRooms, // ✅ provide in context
    setRooms,
    loading,
    fetchRooms,
    fetchOwnerRooms, // ✅ provide in context
    fetchUser,
    checkHotelOwnership
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
