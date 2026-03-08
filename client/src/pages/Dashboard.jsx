import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import EditBusinessModal from "../components/EditBusinessModal";
import {
  FiTrash2,
  FiPlus,
  FiEye,
  FiCalendar,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiClock,
  FiSettings,
  FiSave,
  FiGrid,
  FiList,
  FiEdit,
  FiPhone,
  FiSmartphone,
  FiMail,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Views: 'listings' | 'bookings' | 'setup'
  const [view, setView] = useState("listings");

  // Data States
  const [businesses, setBusinesses] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Setup States
  const [activeBusiness, setActiveBusiness] = useState(null); // Jis business ki settings khuli hai
  const [loading, setLoading] = useState(true);

  // --- SETUP FORM STATES ---
  const [slotConfig, setSlotConfig] = useState({
    start: "09:00",
    end: "18:00",
    interval: 30,
  });
  const [generatedSlots, setGeneratedSlots] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [businessToEdit, setBusinessToEdit] = useState(null);

  const [seatConfig, setSeatConfig] = useState({
    totalTables: 5,
    seatsPerTable: 4,
  });
  const [generatedTables, setGeneratedTables] = useState([]);

  // --- 1. FETCH BUSINESSES ---
  const fetchMyBusinesses = async () => {
    try {
      const endpoint = user.role === "admin" ? "/businesses" : "/businesses/me";
      const { data } = await api.get(endpoint);
      setBusinesses(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBusinesses();
    }
  }, [user]);

  // --- STATUS TOGGLE LOGIC ---
  // --- STATUS TOGGLE LOGIC (Updated for Both) ---
  const handleStatusToggle = async (bizId) => {
    try {
      const business = businesses.find((b) => b._id === bizId);
      const isShop = business.listingType === "shop";

      // Current Status nikalo (Shop ya Individual ke hisab se)
      // Agar status undefined hai to default true (Open) maano
      const currentStatus = isShop
        ? (business.shopDetails?.status ?? true)
        : (business.individualDetails?.status ?? true);

      const newStatus = !currentStatus;

      // UI Update (Optimistic)
      setBusinesses((prev) =>
        prev.map((b) => {
          if (b._id === bizId) {
            if (isShop) {
              return {
                ...b,
                shopDetails: { ...b.shopDetails, status: newStatus },
              };
            } else {
              return {
                ...b,
                individualDetails: {
                  ...b.individualDetails,
                  status: newStatus,
                },
              };
            }
          }
          return b;
        }),
      );

      // Backend API Call
      const payload = isShop
        ? { shopDetails: { ...business.shopDetails, status: newStatus } }
        : {
            individualDetails: {
              ...business.individualDetails,
              status: newStatus,
            },
          };

      await api.put(`/businesses/${bizId}`, payload);

      toast.success(
        newStatus
          ? "You are now Open/Online 🟢"
          : "You are now Closed/Offline 🔴",
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
      fetchMyBusinesses(); // Error aayi to revert karo
    }
  };

  // --- 2. DELETE BUSINESS ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business?")) return;
    try {
      await api.delete(`/businesses/${id}`);
      setBusinesses(businesses.filter((b) => b._id !== id));
      toast.success("Business deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // --- 3. FETCH BOOKINGS ---
  const handleViewBookings = async (business) => {
    setLoading(true);
    setActiveBusiness(business);
    try {
      const { data } = await api.get(`/bookings/business/${business._id}`);
      setBookings(data.data);
      setView("bookings");
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. OPEN SETUP (New Feature) ---
  const handleOpenSetup = (business) => {
    setActiveBusiness(business);

    // Pre-fill existing data if available
    if (business.availableSlots && business.availableSlots.length > 0) {
      setGeneratedSlots(business.availableSlots);
    }
    if (business.seatLayout && business.seatLayout.length > 0) {
      setGeneratedTables(business.seatLayout);
    }

    setView("setup");
  };

  // --- 5. LOGIC GENERATORS ---

  // A. Generate Time Slots
  const generateTimeSlots = () => {
    const slots = [];
    let currentTime = new Date(`2000-01-01T${slotConfig.start}`);
    const endTime = new Date(`2000-01-01T${slotConfig.end}`);

    while (currentTime < endTime) {
      const timeString = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      slots.push(timeString);
      currentTime.setMinutes(
        currentTime.getMinutes() + parseInt(slotConfig.interval),
      );
    }
    setGeneratedSlots(slots);
    toast.info(`${slots.length} slots generated! Click Save.`);
  };

  // B. Generate Tables
  const generateTableLayout = () => {
    const tables = [];
    for (let i = 1; i <= seatConfig.totalTables; i++) {
      tables.push({
        id: `T${i}`,
        type: "table",
        capacity: seatConfig.seatsPerTable,
        isBooked: false,
      });
    }
    setGeneratedTables(tables);
    toast.info(`${tables.length} tables created! Click Save.`);
  };

  // --- 6. SAVE CONFIGURATION TO DB ---
  const handleSaveConfig = async () => {
    try {
      const payload = {};

      if (activeBusiness.bookingType === "time_slot") {
        payload.availableSlots = generatedSlots;
      } else if (activeBusiness.bookingType === "seat_booking") {
        payload.seatLayout = generatedTables;
      }

      await api.put(`/businesses/${activeBusiness._id}`, payload);
      toast.success("Configuration Saved Successfully!");

      // Refresh local data
      fetchMyBusinesses();
      setView("listings");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  // --- 7. BOOKING ACTIONS ---
  const handleBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status });
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, status: status } : b,
        ),
      );
      if (status === "confirmed") toast.success("Booking Accepted!");
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleEditClick = (biz) => {
    setBusinessToEdit(biz);
    setShowEditModal(true);
  };

  const handleEditSuccess = (updatedBiz) => {
    setBusinesses(
      businesses.map((b) => (b._id === updatedBiz._id ? updatedBiz : b)),
    );
  };

  if (loading && view === "listings")
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-16">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {view === "listings"
                ? "Dashboard"
                : view === "bookings"
                  ? `Inquiries: ${activeBusiness?.name}`
                  : `Manage Service: ${activeBusiness?.name}`}
            </h1>
            <p className="text-gray-500 mt-1">
              {view === "listings"
                ? `Manage your listings`
                : `Configure your service settings`}
            </p>
          </div>

          {view !== "listings" && (
            <button
              onClick={() => setView("listings")}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-50 transition"
            >
              <FiArrowLeft /> Back
            </button>
          )}

          {view === "listings" && user.role === "business" && (
            <Link
              to="/add-business"
              className="bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
            >
              <FiPlus /> Add New Business
            </Link>
          )}
        </div>

        {/* --- VIEW 1: MY LISTINGS TABLE --- */}
        {view === "listings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {businesses.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 mb-4">No businesses listed yet.</p>
                <Link
                  to="/add-business"
                  className="text-blue-600 font-bold hover:underline"
                >
                  List your first business
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Business</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Booking Mode</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {businesses.map((biz) => (
                      <tr key={biz._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            {biz.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {biz.category}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {biz.listingType}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {biz.bookingType === "none" ? (
                            <span className="text-gray-400 text-sm">
                              Direct Contact
                            </span>
                          ) : (
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                              {biz.bookingType.replace("_", " ")}
                            </span>
                          )}
                        </td>
                        {/* 🟢 STATUS TOGGLE BUTTON */}
                        {/* 🟢 STATUS TOGGLE BUTTON (For Both Shop & Individual) */}
                        <td className="px-6 py-4">
                          {(() => {
                            // Check Status based on type
                            const isShop = biz.listingType === "shop";
                            const isActive = isShop
                              ? (biz.shopDetails?.status ?? true)
                              : (biz.individualDetails?.status ?? true);

                            return (
                              <button
                                onClick={() => handleStatusToggle(biz._id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                  isActive
                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${isActive ? "bg-green-600 animate-pulse" : "bg-red-500"}`}
                                ></span>
                                {isActive
                                  ? isShop
                                    ? "Open"
                                    : "Online"
                                  : isShop
                                    ? "Closed"
                                    : "Offline"}
                              </button>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          {/* 🟢 EDIT BUTTON ADDED */}
                          <button
                            onClick={() => handleEditClick(biz)}
                            className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
                            title="Edit Details & Gallery"
                          >
                            <FiEdit />
                          </button>

                          {/* ⚙️ SETUP BUTTON (Only if booking is enabled) */}
                          {biz.bookingType !== "none" && (
                            <button
                              onClick={() => handleOpenSetup(biz)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                              title="Configure Slots/Seats"
                            >
                              <FiSettings />
                            </button>
                          )}

                          <button
                            onClick={() => handleViewBookings(biz)}
                            className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-purple-100 transition"
                          >
                            <FiCalendar /> Inquiries
                          </button>

                          <Link
                            to={`/business/${biz._id}`}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            title="View Page"
                          >
                            <FiEye />
                          </Link>
                          <button
                            onClick={() => handleDelete(biz._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW 2: BOOKINGS LIST --- */}
        {view === "bookings" && (
          <div className="grid gap-4">
            {bookings.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center text-gray-500 border border-gray-100">
                <FiClock className="mx-auto text-4xl mb-3 text-gray-300" />
                <p>No inquiries received yet.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={booking._id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
                >
                  {/* Status Strip */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-2 ${
                      booking.status === "confirmed"
                        ? "bg-green-500"
                        : booking.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-400"
                    }`}
                  ></div>

                  <div className="pl-4">
                    {/* Header: Name & Status */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.contactName || booking.user?.name}
                        </h3>
                        <span className="text-xs text-gray-400">
                          Received on:{" "}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 md:mt-0 ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* 🟢 CONTACT DETAILS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                      {/* Phone & Email */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <FiPhone className="text-blue-600" />
                          <a
                            href={`tel:${booking.contactPhone}`}
                            className="hover:underline hover:text-blue-600"
                          >
                            {booking.contactPhone}
                          </a>
                        </div>
                        {booking.alternatePhone && (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <FiSmartphone className="text-gray-400" />{" "}
                            {booking.alternatePhone}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FiMail className="text-gray-400" />{" "}
                          {booking.contactEmail}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <FiCalendar className="text-purple-600" />
                          {new Date(booking.date).toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                          <FiClock className="text-purple-600" /> {booking.time}
                        </div>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Client Message / Issue
                      </p>
                      <p className="text-gray-700 bg-white p-3 border rounded-lg text-sm">
                        {booking.problem}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    {booking.status === "pending" && (
                      <div className="flex gap-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={() =>
                            handleBookingStatus(booking._id, "confirmed")
                          }
                          className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition flex justify-center items-center gap-2"
                        >
                          <FiCheck /> Accept Booking
                        </button>
                        <button
                          onClick={() =>
                            handleBookingStatus(booking._id, "rejected")
                          }
                          className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition flex justify-center items-center gap-2"
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* --- VIEW 3: SETUP / CONFIGURATION --- */}
        {view === "setup" && activeBusiness && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT: CONTROLS */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                {activeBusiness.bookingType === "time_slot" ? (
                  <FiClock />
                ) : (
                  <FiGrid />
                )}
                Configure{" "}
                {activeBusiness.bookingType === "time_slot"
                  ? "Time Slots"
                  : "Seating"}
              </h2>

              {/* TIME SLOT FORM */}
              {activeBusiness.bookingType === "time_slot" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={slotConfig.start}
                      onChange={(e) =>
                        setSlotConfig({ ...slotConfig, start: e.target.value })
                      }
                      className="w-full border p-3 rounded-xl bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={slotConfig.end}
                      onChange={(e) =>
                        setSlotConfig({ ...slotConfig, end: e.target.value })
                      }
                      className="w-full border p-3 rounded-xl bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Slot Duration (Minutes)
                    </label>
                    <select
                      value={slotConfig.interval}
                      onChange={(e) =>
                        setSlotConfig({
                          ...slotConfig,
                          interval: Number(e.target.value),
                        })
                      }
                      className="w-full border p-3 rounded-xl bg-gray-50"
                    >
                      <option value="15">15 Mins</option>
                      <option value="30">30 Mins</option>
                      <option value="60">1 Hour</option>
                    </select>
                  </div>
                  <button
                    onClick={generateTimeSlots}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    Generate Slots
                  </button>
                </div>
              )}

              {/* SEAT LAYOUT FORM */}
              {activeBusiness.bookingType === "seat_booking" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Total Tables
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={seatConfig.totalTables}
                      onChange={(e) =>
                        setSeatConfig({
                          ...seatConfig,
                          totalTables: e.target.value,
                        })
                      }
                      className="w-full border p-3 rounded-xl bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Seats Per Table
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={seatConfig.seatsPerTable}
                      onChange={(e) =>
                        setSeatConfig({
                          ...seatConfig,
                          seatsPerTable: e.target.value,
                        })
                      }
                      className="w-full border p-3 rounded-xl bg-gray-50"
                    />
                  </div>
                  <button
                    onClick={generateTableLayout}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    Generate Layout
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: PREVIEW & SAVE */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Preview</h2>
                <button
                  onClick={handleSaveConfig}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100"
                >
                  <FiSave /> Save Changes
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl min-h-[300px] border border-gray-200">
                {/* SLOT PREVIEW */}
                {activeBusiness.bookingType === "time_slot" && (
                  <div className="grid grid-cols-3 gap-3">
                    {generatedSlots.length === 0 ? (
                      <p className="col-span-3 text-center text-gray-400">
                        No slots generated yet.
                      </p>
                    ) : (
                      generatedSlots.map((slot, i) => (
                        <div
                          key={i}
                          className="bg-white border border-gray-200 text-center py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm"
                        >
                          {slot}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TABLE PREVIEW */}
                {activeBusiness.bookingType === "seat_booking" && (
                  <div className="grid grid-cols-3 gap-4">
                    {generatedTables.length === 0 ? (
                      <p className="col-span-3 text-center text-gray-400">
                        No tables created yet.
                      </p>
                    ) : (
                      generatedTables.map((table) => (
                        <div
                          key={table.id}
                          className="bg-white border-2 border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                            {table.id}
                          </div>
                          <span className="text-xs text-gray-400">
                            {table.capacity} Seats
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 🟢 RENDER EDIT MODAL */}
      <AnimatePresence>
        {showEditModal && businessToEdit && (
          <EditBusinessModal
            business={businessToEdit}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleEditSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
