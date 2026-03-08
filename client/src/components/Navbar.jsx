import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // useSearchParams add kiya
import { AuthContext } from "../context/AuthContext";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiLayout,
  FiGrid,
  FiBriefcase, // New icon for 'List Business'
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // 1. STATE FOR TOGGLE (Default: 'shop')
  // URL check karega: agar ?type=individual hai to wahi set karega
  const [listingType, setListingType] = useState(
    searchParams.get("type") || "home",
  );

  // URL Change Listener (Browser Back Button support)
  useEffect(() => {
    const currentType = searchParams.get("type");
    if (currentType) {
      setListingType(currentType);
    }
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  // 2. TOGGLE HANDLER
  const handleToggle = (type) => {
    setListingType(type);
    setIsOpen(false); // Mobile menu band karo
    if (type === "home") {
      navigate("/");
    } else {
      navigate(`/services?type=${type}`);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* LEFT - LOGO */}
          <div className="flex-1 flex items-center">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tighter flex items-center"
            >
              <span className="bg-black text-white px-2.5 rounded-full">L</span>
              ocal Finder
            </Link>
          </div>

          {/* CENTER - TOGGLE */}
          <div className="flex-1 hidden md:flex justify-center">
            <div className="bg-gray-100 p-1 rounded-full border border-gray-200 flex">
              <button
                onClick={() => handleToggle("home")}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  listingType === "home"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleToggle("shop")}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  listingType === "shop"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Shops
              </button>

              <button
                onClick={() => handleToggle("individual")}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  listingType === "individual"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Individuals
              </button>
            </div>
          </div>

          {/* RIGHT - LINKS & USER (UNCHANGED) */}
          <div className="flex-1 hidden md:flex justify-end items-center space-x-6">
            {/* Dynamic "List Business" Text */}
            {(listingType === "shop" || listingType === "individual") && (
              <Link
                to={`/add-business?type=${listingType}`}
                className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-1"
              >
                <FiBriefcase />
                {listingType === "shop"
                  ? "List as Shop"
                  : "List as Professional"}
              </Link>
            )}

            {/* User/Business Logic */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 font-bold text-gray-800 focus:outline-none">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {user.name[0]}
                  </div>
                  {user.name}
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiUser /> My Profile
                    </Link>

                    
                      {user.role !== "user" && <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FiGrid /> Dashboard
                      </Link>}
                      <Link
                        to="/my-booking"
                        className="block px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FiGrid /> My Bookings
                      </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="text-red-600 font-bold hover:text-red-700 transition flex items-center gap-1 w-full text-left px-4 py-2"
                      >
                        <FiLayout /> Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-medium hover:text-black">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white px-5 py-2 rounded-full font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 text-2xl focus:outline-none"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {/* 🟢 MOBILE TOGGLE SWITCH */}
              <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 mb-6">
                <button
                  onClick={() => handleToggle("home")}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                    listingType === "home"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => handleToggle("shop")}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                    listingType === "shop"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Shops
                </button>

                <button
                  onClick={() => handleToggle("individual")}
                  className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                    listingType === "individual"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  Individuals
                </button>
              </div>

              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600"
              >
                Home
              </Link>

              <Link
                to="/add-business"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-gray-600"
              >
                List as{" "}
                {listingType === "shop"
                  ? "Shop"
                  : listingType === "individual"
                    ? "Professional"
                    : "Business"}
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block font-bold text-red-600"
                >
                  Admin Panel
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block font-medium text-black"
                  >
                    My Profile
                  </Link>
                  <Link
                    to={
                      user.role === "business" ? "/dashboard" : "/my-bookings"
                    }
                    onClick={() => setIsOpen(false)}
                    className="block font-medium text-black"
                  >
                    {user.role === "business" ? "Dashboard" : "My Bookings"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center border border-gray-200 py-2 rounded-xl font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center bg-black text-white py-2 rounded-xl font-bold"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
