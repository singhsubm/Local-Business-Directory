import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiTool,
  FiBriefcase,
  FiClock,
  FiTruck,
  FiChevronRight,
} from "react-icons/fi";
import { SiTicktick } from "react-icons/si";
import { motion } from "framer-motion";

const BusinessCard = ({ business, distance }) => {
  const { listingType, individualDetails } = business;

  const getImageUrl = (img) => {
    if (img && (img.startsWith("http") || img.startsWith("data:"))) return img;
    return listingType === "shop"
      ? "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  // Helper to format distance safely
  const formatDistance = (dist) => {
    if (dist === undefined || dist === null || dist === Infinity) return null;
    return `${dist.toFixed(1)} km`;
  };

  const distText = formatDistance(distance);

  // ==========================================
  // 🟢 COMPACT INDIVIDUAL CARD
  // ==========================================
  if (listingType === "individual") {
    return (
      <Link to={`/business/${business._id}`} className="block h-full">
        <motion.div
          layout
          whileHover={{ y: -3 }}
          className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col"
        >
          {/* Main Profile Area */}
          <div className="p-4 flex gap-4 items-center">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={getImageUrl(business.image)}
                alt={business.name}
                className="w-14 h-14 rounded-full object-cover border border-gray-100 bg-gray-50"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
              {business.isApproved && (
                <FiCheckCircle className="absolute -bottom-1 -right-1 text-blue-500 bg-white rounded-full text-sm" />
              )}
            </div>

            {/* Name & Role */}
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 truncate">
                  {business.name}
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                  <span>{business.rating || "New"}</span>
                  <FiStar className="text-yellow-500 fill-current" size={10} />
                </div>
              </div>
              <p className="text-xs flex items-center gap-2 font-semibold text-indigo-600 truncate ">
                {business.category}
              </p>

              {/* Compact Stats Row */}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  <FiClock size={10} /> {individualDetails?.experience || 0}y Exp
                </span>
                <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 font-bold text-gray-700">
                  Visit: ₹{individualDetails?.visitingCharge || "NA"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Strip: Tools & Distance */}
          <div className="mt-auto px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-500 font-medium">
            <div className="flex gap-3">
              {individualDetails?.hasTools ? (
                <span className="flex items-center gap-1 text-green-700">
                  <FiTool /> Has Tools
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500">
                  <FiBriefcase /> No Tools
                </span>
              )}
              {individualDetails?.hasVehicle && (
                <span className="flex items-center gap-1 text-blue-700">
                  <FiTruck /> Has Vehicle
                </span>
              )}
            </div>

            {/* Distance Logic Updated */}
            {distText && (
              <span className="flex items-center gap-1">
                <FiMapPin /> {distText}
              </span>
            )}
          </div>
        </motion.div>
      </Link>
    );
  }

  // ==========================================
  // 🟢 COMPACT SHOP CARD
  // ==========================================
  return (
    <Link to={`/business/${business._id}`} className="block h-full">
      <motion.div
        layout
        whileHover={{ y: -3 }}
        className="h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
      >
        {/* Compact Image */}
        <div className="relative h-40 bg-gray-100 overflow-hidden">
          <img
            src={getImageUrl(business.image)}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400";
            }}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {distText && (
              <span className="bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <FiMapPin size={10} /> {distText}
              </span>
            )}
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-900 truncate pr-2 text-sm">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100">
              {business.rating || "New"} <FiStar className="fill-current" size={8} />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <p className="text-indigo-600 text-xs font-semibold truncate">
                {business.category}
            </p>
            {business.isApproved && (
                <span className="flex text-[10px] px-1.5 py-0.5 rounded bg-blue-50 items-center gap-1 text-blue-600 font-bold border border-blue-100">
                <SiTicktick size={8} /> Verified
                </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 pt-2">
            <span className="text-xs text-gray-400 flex items-center gap-1 truncate max-w-[70%]">
              <FiMapPin size={10} /> {business.city}
            </span>
            <span className="text-xs font-bold text-indigo-600 flex items-center group-hover:translate-x-1 transition">
              View <FiChevronRight size={12} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BusinessCard;