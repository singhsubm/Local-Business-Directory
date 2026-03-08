import { useState, useContext, useEffect } from "react"; // useContext add kiya
import { motion } from "framer-motion";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiCheck,
  FiUser,
  FiPhone,
  FiMail,
  FiSmartphone,
} from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext"; // User data lene ke liye

const BookingModal = ({ business, onClose }) => {
  const { user } = useContext(AuthContext); // Logged in user details

  const [date, setDate] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic Selection States
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [manualTime, setManualTime] = useState("");

  // 🟢 CONTACT STATE (New)
  const [contactDetails, setContactDetails] = useState({
    name: user?.name || "",
    phone: "+91 ",
    email: user?.email || "",
    altPhone: "",
  });

  const handleChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logic: Agar Slot system hai to Slot lo, warna Manual Time lo
    const finalTime =
      business.bookingType === "time_slot" ? selectedSlot : manualTime;

    if (!date) return toast.error("Please select a date");
    if (!finalTime) return toast.error("Please select a time"); // 🟢 Time Check
    if (business.bookingType === "seat_booking" && !selectedTable)
      return toast.error("Please select a table");

    if (contactDetails.phone.length < 13)
      return toast.error("Please enter valid phone number");

    setLoading(true);

    try {
      const message =
        business.bookingType === "seat_booking"
          ? `Table: ${selectedTable} - ${problem}`
          : problem;

      await api.post("/bookings", {
        businessId: business._id,
        date,
        time: finalTime, // 🟢 Sending Time
        problem: message,
        contactName: contactDetails.name,
        contactPhone: contactDetails.phone,
        contactEmail: contactDetails.email,
        alternatePhone: contactDetails.altPhone,
      });

      toast.success("Request Sent! Owner will contact you.");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold">Book {business.name}</h2>
            <p className="text-xs text-gray-400 opacity-80 capitalize">
              {business.bookingType.replace("_", " ")} Booking
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
          >
            <FiX />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* 🟢 1. CONTACT DETAILS SECTION (NEW) */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
            <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <FiUser /> Your Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contactDetails.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={contactDetails.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <FiPhone className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 Phone"
                  value={contactDetails.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-8 p-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <FiSmartphone className="absolute left-3 top-2.5 text-gray-400 text-xs" />
                <input
                  type="text"
                  name="altPhone"
                  placeholder="Alt. Phone (Optional)"
                  value={contactDetails.altPhone}
                  onChange={handleChange}
                  className="w-full pl-8 p-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 2. DATE & TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 p-2 border rounded-xl"
                />
              </div>
            </div>

            {/* 🟢 TIME LOGIC: Agar slot nahi hai, to manual time dikhao */}
            {(business.bookingType === "none" ||
              business.bookingType === "seat_booking" ||
              !business.bookingType) && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Preferred Time
                </label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="time"
                    required
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full pl-10 p-2 border rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. SLOTS (If Enabled) */}
          {business.bookingType === "time_slot" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Time Slot
              </label>
              {business.availableSlots?.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {business.availableSlots.map((slot, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-1 px-2 rounded border text-sm ${selectedSlot === slot ? "bg-black text-white" : "bg-white"}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-red-500">No slots available.</p>
              )}
            </div>
          )}

          {/* Tables */}
          {business.bookingType === "seat_booking" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Table
              </label>
              {business.seatLayout && business.seatLayout.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-48 overflow-y-auto">
                  {business.seatLayout.map((table) => (
                    <button
                      type="button"
                      key={table.id}
                      onClick={() => setSelectedTable(table.id)}
                      className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition ${
                        selectedTable === table.id
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-white border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-600"
                      }`}
                    >
                      <div className="font-bold text-lg">{table.id}</div>
                      <div className="text-[10px] flex items-center gap-1">
                        <FiUser size={10} /> {table.capacity}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                  Layout not configured.
                </p>
              )}
            </div>
          )}

          {/* Manual Time */}
          {(business.bookingType === "none" || !business.bookingType) && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="time"
                  required
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                />
              </div>
            </div>
          )}

          {/* 4. DESCRIPTION */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {business.category === "Restaurant" ||
              business.category === "Cafe"
                ? "Special Requests"
                : "Describe Issue / Service"}
            </label>
            <textarea
              rows="2"
              required
              placeholder="e.g. Need high chair..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <FiCheck /> Confirm Booking
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingModal;
