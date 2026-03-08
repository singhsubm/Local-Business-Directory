import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiImage,
  FiType,
  FiPhone,
  FiLayout,
  FiCheckCircle,
  FiBriefcase,
  FiTool,
  FiClock,
  FiGrid,
  FiTruck,
  FiUser,
} from "react-icons/fi";

const AddBusiness = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [imageFile, setImageFile] = useState(null);

  // 🟢 1. AUTO-DETECT LISTING TYPE FROM URL
  // Navbar se ab sahi data aayega (?type=individual)
  const initialType =
    searchParams.get("type") === "individual" ? "individual" : "shop";
  const [listingType, setListingType] = useState(initialType);

  const [bookingType, setBookingType] = useState("none");
  const [individualDetails, setIndividualDetails] = useState({
    experience: 0,
    hasTools: false,
    hasVehicle: false,
    visitingCharge: 0,
  });

  // 🟢 2. CATEGORY GROUPS (Smart Logic)
  const SHOP_CATEGORIES = [
    "Cafe",
    "Restaurant",
    "Salon",
    "Gym",
    "Grocery",
    "Medical Store",
    "Mechanic Shop",
    "Studio",
    "Other",
  ];

  const INDIVIDUAL_CATEGORIES = [
    "Doctor",
    "Plumber",
    "Electrician",
    "Driver",
    "Tutor",
    "Carpenter",
    "Painter",
    "Maid",
    "Technician",
    "Massage Therapist",
    "Other",
  ];

  // Specific groups for conditional questions
  const TOOL_USERS = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "Technician",
    "Mechanic",
    "Painter",
  ];
  const VEHICLE_USERS = ["Driver", "Delivery Boy"];

  const [customCategory, setCustomCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    website: "",
    latitude: "",
    longitude: "",
  });

  // Reset category when listing type changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, category: "" }));
    setCustomCategory("");
    // Also update URL purely for visual consistency (optional)
    navigate(`?type=${listingType}`, { replace: true });
  }, [listingType, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleGetLocation = () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      setLocationStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("success");
        toast.success("Location captured!");
      },
      (error) => {
        console.error(error);
        toast.error("Location access denied");
        setLocationStatus("error");
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);

      // Category Logic
      const finalCategory =
        formData.category === "Other" ? customCategory : formData.category;
      if (!finalCategory.trim()) {
        toast.error("Please select or specify a category");
        setLoading(false);
        return;
      }
      data.append("category", finalCategory);

      data.append("description", formData.description);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("pincode", formData.pincode);
      data.append("phone", formData.phone);
      if (formData.website) data.append("website", formData.website);

      data.append("listingType", listingType);

      if (listingType === "shop") {
        data.append("bookingType", bookingType);
      } else {
        data.append("individualDetails", JSON.stringify(individualDetails));
        data.append("bookingType", "time_slot");
      }

      const locationData = JSON.stringify({
        type: "Point",
        coordinates: [
          parseFloat(formData.longitude),
          parseFloat(formData.latitude),
        ],
      });
      data.append("location", locationData);

      if (imageFile) data.append("image", imageFile);

      await api.post("/businesses", data);
      toast.success("Listing created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-black py-8 px-8 text-white">
          <h2 className="text-3xl font-bold">List Your Service</h2>
          <p className="text-gray-400 mt-2">
            Join thousands of businesses and professionals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* TOP TOGGLE */}
          <div className="bg-gray-50 p-2 rounded-xl flex gap-2 border border-gray-200">
            <button
              type="button"
              onClick={() => setListingType("shop")}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${listingType === "shop" ? "bg-white shadow-md text-black" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FiLayout /> I have a Shop
            </button>
            <button
              type="button"
              onClick={() => setListingType("individual")}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${listingType === "individual" ? "bg-white shadow-md text-black" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FiBriefcase /> I am an Individual
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiType />{" "}
                {listingType === "shop" ? "Business Name" : "Full Name"}
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                placeholder={
                  listingType === "shop"
                    ? "e.g. Sharma Electronics"
                    : "e.g. Rahul Kumar"
                }
                onChange={handleChange}
              />
            </div>

            {/* CATEGORY DROPDOWN */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiGrid /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {(listingType === "shop"
                  ? SHOP_CATEGORIES
                  : INDIVIDUAL_CATEGORIES
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {formData.category === "Other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <input
                    type="text"
                    placeholder="Type your category here..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:outline-none text-blue-900 font-medium"
                    required
                  />
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiPhone /> Contact Number
              </label>
              <input
                type="text"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                placeholder="+91 98765 43210"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiMapPin /> City
              </label>
              <input
                type="text"
                name="city"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                placeholder="e.g. New Delhi"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 🟢 DYNAMIC QUESTIONS FOR INDIVIDUALS */}
          <AnimatePresence>
            {listingType === "individual" && formData.category && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50 p-6 rounded-2xl border border-blue-100"
              >
                <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-4">
                  <FiUser /> Professional Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-800">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none"
                      placeholder="e.g. 5"
                      onChange={(e) =>
                        setIndividualDetails({
                          ...individualDetails,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-blue-800">
                      Visiting/Service Charge (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:outline-none"
                      placeholder="e.g. 500"
                      onChange={(e) =>
                        setIndividualDetails({
                          ...individualDetails,
                          visitingCharge: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 🔧 LOGIC: Show Tools Question if category is in TOOL_USERS array */}
                  {TOOL_USERS.includes(formData.category) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-2 md:col-span-1 flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-200 cursor-pointer"
                      onClick={() =>
                        setIndividualDetails((prev) => ({
                          ...prev,
                          hasTools: !prev.hasTools,
                        }))
                      }
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${individualDetails.hasTools ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                      >
                        {individualDetails.hasTools && (
                          <FiCheckCircle className="text-white text-xs" />
                        )}
                      </div>
                      <label className="text-sm font-medium text-blue-900 flex items-center gap-2 cursor-pointer">
                        <FiTool /> I have my own tools
                      </label>
                    </motion.div>
                  )}

                  {/* 🚚 LOGIC: Show Vehicle Question if category is in VEHICLE_USERS array */}
                  {VEHICLE_USERS.includes(formData.category) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-2 md:col-span-1 flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-200 cursor-pointer"
                      onClick={() =>
                        setIndividualDetails((prev) => ({
                          ...prev,
                          hasVehicle: !prev.hasVehicle,
                        }))
                      }
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center ${individualDetails.hasVehicle ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                      >
                        {individualDetails.hasVehicle && (
                          <FiCheckCircle className="text-white text-xs" />
                        )}
                      </div>
                      <label className="text-sm font-medium text-blue-900 flex items-center gap-2 cursor-pointer">
                        <FiTruck /> I have my own vehicle
                      </label>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BOOKING LOGIC FOR SHOPS */}
          {listingType === "shop" && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiClock /> Booking Preferences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    type: "none",
                    title: "None",
                    desc: "Only to list your shop",
                  },
                  {
                    type: "time_slot",
                    title: "Time Slot",
                    desc: "saloon, parlour...",
                  },
                  {
                    type: "seat_booking",
                    title: "Seat Booking",
                    desc: "restaurant, cafe...",
                  },
                ].map((item) => (
                  <label
                    key={item.type}
                    className={`cursor-pointer border p-4 rounded-xl transition flex flex-col items-center gap-1 text-center
        ${
          bookingType === item.type
            ? "bg-black text-white border-black"
            : "bg-white hover:bg-gray-100"
        }`}
                  >
                    <input
                      type="radio"
                      name="booking"
                      value={item.type}
                      className="hidden"
                      onChange={() => setBookingType(item.type)}
                      checked={bookingType === item.type}
                    />

                    <span className="font-bold">{item.title}</span>

                    {/* 👇 small description text */}
                    <span
                      className={`text-xs ${
                        bookingType === item.type
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {item.desc}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Full Address
            </label>
            <input
              type="text"
              name="address"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
              placeholder="Complete Address..."
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiMapPin /> Pincode
              </label>
              <input
                type="text"
                name="pincode"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                placeholder="e.g. 110001"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiImage />{" "}
                {listingType === "shop" ? "Shop Image" : "Profile Photo"}
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              rows="3"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
              placeholder="Tell us about your services..."
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Location Logic */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-blue-900">
                {listingType === "shop"
                  ? "Shop Location"
                  : "Your Base Location"}
              </h4>
              <p className="text-sm text-blue-700">
                {listingType === "shop"
                  ? "Exact location for maps."
                  : "Used to find nearby customers (Hidden publicly)."}
              </p>
              {locationStatus === "success" && (
                <span className="text-xs text-green-600 font-bold flex items-center mt-1">
                  <FiCheckCircle className="mr-1" /> Coordinates Captured
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={
                locationStatus === "loading" || locationStatus === "success"
              }
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 ${locationStatus === "success" ? "bg-green-500 text-white cursor-default" : "bg-white text-blue-600 hover:bg-blue-100"}`}
            >
              <FiMapPin />{" "}
              {locationStatus === "loading"
                ? "Detecting..."
                : locationStatus === "success"
                  ? "Located"
                  : "Detect Location"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.latitude}
            className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          >
            {loading
              ? "Processing..."
              : `Publish ${listingType === "shop" ? "Business" : "Profile"}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBusiness;
