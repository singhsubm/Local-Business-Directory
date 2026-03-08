import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import BusinessCard from "../components/BusinessCard";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
  FiGrid,
  FiNavigation,
  FiTarget,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const CATEGORIES = [
  "All",
  "Plumber",
  "Electrician",
  "Cafe",
  "Salon",
  "Mechanic",
  "Doctor",
  "Tutor",
  "Gym",
  "Carpenter",
  "Painter",
];

// 🟢 1. ROBUST DISTANCE FUNCTION (Strings ko Number me badlega)
// 🟢 FIXED CALCULATION FUNCTION
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const lat1Num = parseFloat(lat1);
  const lon1Num = parseFloat(lon1);
  const lat2Num = parseFloat(lat2);
  const lon2Num = parseFloat(lon2);

  if (isNaN(lat1Num) || isNaN(lon1Num) || isNaN(lat2Num) || isNaN(lon2Num)) return null;

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRad(lat2Num - lat1Num);
  const dLon = toRad(lon2Num - lon1Num);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1Num)) *
      Math.cos(toRad(lat2Num)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // 👈 PURE NUMBER RETURN KARO (toFixed mat lagao yahan)
};

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const currentType = searchParams.get("type") || "shop";

  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Location
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [radius, setRadius] = useState(20);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await api.get("/businesses");
        setBusinesses(data.data);

        // Local Storage Check
        const savedLoc = localStorage.getItem("userLocation");
        if (savedLoc) {
          try {
            const parsedLoc = JSON.parse(savedLoc);
            if (parsedLoc && parsedLoc.lat && parsedLoc.lng) {
              setUserLocation(parsedLoc);
              setLocationStatus("success");
              setSortBy("nearest");
            }
          } catch (e) {
            localStorage.removeItem("userLocation"); // Corrupt data hatao
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching businesses", error);
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleDetectLocation = () => {
    setLocationStatus("loading");
    
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setLocationStatus("error");
      return;
    }

    // 🟢 OPTIONS ADDED FOR BETTER ACCURACY
    const options = {
        enableHighAccuracy: true, // GPS use karega
        timeout: 10000,           // 10 seconds tak wait karega
        maximumAge: 0             // Cache use nahi karega, fresh location layega
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        console.log("📍 Accurate User Location:", newLoc); // Console me check karo sahi hai ya nahi

        setUserLocation(newLoc);
        setLocationStatus("success");
        setSortBy("nearest");
        localStorage.setItem("userLocation", JSON.stringify(newLoc));
        toast.success("Exact Location updated!");
      },
      (error) => {
        console.error("Location Error:", error);
        let msg = "Location error.";
        if(error.code === 1) msg = "Location permission denied.";
        if(error.code === 2) msg = "Position unavailable (Check GPS).";
        if(error.code === 3) msg = "Location request timed out.";
        
        toast.error(msg);
        setLocationStatus("error");
      },
      options // 👈 Ye pass karna zaroori hai
    );
  };

  const clearLocation = () => {
    setUserLocation(null);
    setLocationStatus("idle");
    localStorage.removeItem("userLocation");
    setSortBy("newest");
  };

  // --- ⚡ MAIN FILTER LOGIC ---
  useEffect(() => {
    let result = [...businesses];

    // 1. Filter by Listing Type
    if (result.length > 0) {
      result = result.filter((b) => b.listingType === currentType);
    }

    // 🟢 2. Distance Logic (DEBUGGED)
    if (userLocation?.lat !== undefined && userLocation?.lng !== undefined) {
      console.log("📍 User:", userLocation); // Debugging

      result = result.map((b) => {
        // MongoDB: [Lng, Lat]
        const bLng = b.location?.coordinates?.[0];
        const bLat = b.location?.coordinates?.[1];

        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          bLat,
          bLng,
        );

        // Debugging each business distance
        // console.log(`📏 ${b.name}: ${dist} km`);

        return { ...b, distance: dist !== null ? dist : Infinity };
      });

      // Filter by Radius
      // Agar distance calculate nahi hua (Infinity), to use mat dikhao (ya dikhao, tumhari marzi)
      result = result.filter((b) => b.distance <= radius);
    }

    // 3. Category
    if (activeCategory !== "All") {
      result = result.filter((b) => b.category === activeCategory);
    }

    // 4. Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(lowerTerm) ||
          b.category.toLowerCase().includes(lowerTerm) ||
          b.city.toLowerCase().includes(lowerTerm),
      );
    }

    // 5. Verified
    if (verifiedOnly) {
      result = result.filter((b) => b.isApproved === true);
    }

    // 6. Rating
    if (minRating > 0) {
      result = result.filter((b) => (b.rating || 0) >= minRating);
    }

    // 7. Sort
    if (sortBy === "nearest" && userLocation) {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredBusinesses(result);
  }, [
    businesses,
    activeCategory,
    searchTerm,
    sortBy,
    minRating,
    verifiedOnly,
    userLocation,
    radius,
    currentType,
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchParams({ search: e.target.value, type: currentType });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSearchParams({ type: currentType });
    setActiveCategory("All");
    setSortBy("newest");
    setMinRating(0);
    setVerifiedOnly(false);
    // Optional: Location bhi clear karni hai to uncomment karo
    // clearLocation();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {currentType === "individual" ? "Professionals" : "Shops"}
                <span className="text-xs font-normal text-slate-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                  {filteredBusinesses.length} results
                </span>
              </h1>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
              >
                <FiFilter size={20} />
              </button>
            </div>
            <div className="relative w-full md:w-96 group">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition" />
              <input
                type="text"
                placeholder={`Search ${currentType}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black focus:ring-1 focus:ring-black rounded-xl outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="lg:sticky lg:top-36 space-y-6 pr-2">
              {/* 🟢 LOCATION FILTER */}
              <div
                className={`p-5 rounded-2xl border transition-all ${locationStatus === "success" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${locationStatus === "success" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    <FiNavigation
                      className={
                        locationStatus === "loading" ? "animate-spin" : ""
                      }
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {locationStatus === "success"
                          ? "Location Active"
                          : "Find Near Me"}
                      </h3>
                      {locationStatus === "success" && (
                        <button
                          onClick={clearLocation}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {locationStatus !== "success" ? (
                      <button
                        onClick={handleDetectLocation}
                        disabled={locationStatus === "loading"}
                        className="mt-2 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-700 transition w-full"
                      >
                        {locationStatus === "loading"
                          ? "Detecting..."
                          : "Allow Location"}
                      </button>
                    ) : (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs font-bold text-green-700 mb-1">
                          <span>Within:</span>
                          <span>{radius} km</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={radius}
                          onChange={(e) => setRadius(Number(e.target.value))}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                  <FiGrid /> Category
                </h3>
                <div className="relative">
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-black cursor-pointer font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <FiChevronDown />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider text-gray-500">
                  Rating
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setMinRating(4)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition font-medium ${minRating === 4 ? "bg-black text-white" : "hover:bg-gray-50 text-gray-600"}`}
                  >
                    <span className="text-yellow-400">★★★★</span> 4.0+
                  </button>
                </div>
              </div>
              <button
                onClick={clearAllFilters}
                className="w-full text-center text-red-500 text-sm font-bold hover:bg-red-50 py-3 rounded-xl transition"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* RESULTS GRID */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
              </div>
            ) : filteredBusinesses.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                <FiTarget className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No {currentType} found
                </h3>
                <p className="text-gray-500 mb-6">
                  {locationStatus === "success"
                    ? `Try increasing radius (${radius}km) or changing filters.`
                    : "Try changing filters."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredBusinesses.map((business) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={business._id}
                    >
                      <BusinessCard
                        business={business}
                        distance={business.distance}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Services;
