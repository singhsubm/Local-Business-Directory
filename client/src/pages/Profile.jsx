import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiShield,
  FiLifeBuoy,
  FiClock,
  FiCheckCircle,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState("settings"); // 'settings' | 'support'
  const [activeSecurityTab, setActiveSecurityTab] = useState(false); // 'settings' | 'support'

  // Profile States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Support States
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({ subject: "", message: "" });
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
    }
  }, [user]);

  // Fetch Tickets when tab changes
  useEffect(() => {
    if (activeTab === "support") {
      fetchTickets();
    }
  }, [activeTab]);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const { data } = await api.get("/support/me");
      setTickets(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTickets(false);
    }
  };

  // --- HANDLERS ---

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/auth/updatedetails", { name, email });
      toast.success("Profile updated successfully!");
      // window.location.reload(); // Not needed if we can update context, but reload is safer for beginners
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await api.put("/auth/updatepassword", { currentPassword, newPassword });
      toast.success("Password changed! Please login again.");
      await api.get("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Password update failed");
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/support", {
        subject: ticketForm.subject,
        message: ticketForm.message,
        role: user.role, // 'user' or 'business'
      });
      toast.success("Ticket Raised Successfully! 🎫");
      setTickets([data.data, ...tickets]); // Add to list instantly
      setTicketForm({ subject: "", message: "" }); // Reset form
    } catch (error) {
      toast.error("Failed to raise ticket");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FiUser className="text-indigo-600" /> Account & Support
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your profile and get help.
            </p>
          </div>

          {/* TABS */}
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "settings" ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "support" ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Help & Support
            </button>
          </div>
        </div>
        {/* account type = user(can only see shops and professionals and rte them), admin(can see update or delete anything), professional(can list only one individual as a professional), business(can list 3 shops and professional) */}
        {user?.role === "user" && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100  rounded-xl p-5 shadow-sm border-l-6 border-blue-400">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="bg-blue-500 text-white p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Account type :{" "}
                  <span className="inline-block bg-blue-500 text-white px-3 rounded-full">
                    User
                  </span>
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  You can manage your profile and view your support tickets from
                  this dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
        {user?.role === "admin" && (
          <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm border-l-6 border-gray-400">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="bg-gray-700 text-white p-3 rounded-full">
                <FiShield size={20} />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Account type :{" "}
                  <span className="inline-block bg-gray-700 text-white px-3 rounded-full">
                    Admin
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  You have full access to manage the platform, including users,
                  businesses, and support tickets. Please use your powers
                  wisely!
                </p>
              </div>
            </div>
          </div>
        )}
        {user?.role === "business" && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 shadow-sm border-l-6 border-green-400">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="bg-green-500 text-white p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-6 0h6"
                  />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Account type :{" "}
                  <span className="inline-block bg-green-500 text-white px-3 rounded-full">
                    Business
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  You can manage your business listings and view business-specific
                  support tickets from this dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
        {user?.role === "professional" && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-5 shadow-sm border-l-6 border-purple-400">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="bg-purple-500 text-white p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m0 8v6m8.737-.788c.898.79.898.79.898.79s-.898-.79-.898-.79zM3.663.788c-.898-.79-.898-.79-.898-.79s.898.79.898.79z"
                  />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  Account type :{" "}
                  <span className="inline-block bg-purple-500 text-white px-3 rounded-full">
                    Professional
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  You can manage your professional profile and view support tickets
                  related to your services from this dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* --- TAB 1: SETTINGS --- */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Personal Details */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <FiShield />
                </span>
                Personal Details
              </h2>
              <form onSubmit={handleUpdateDetails} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black transition"
                    />
                  </div>
                </div>
                {/* //change password link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setActiveSecurityTab(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
                  >
                    Need to change password?
                  </button>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition"
                  >
                    <FiSave /> Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Password */}
            {activeSecurityTab && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                      <FiLock />
                    </span>
                    Security
                  </div>
                  <span
                    className="text-red-500 bg-red-100 px-2 py-2 cursor-pointer hover:text-red-600 rounded-lg"
                    onClick={() => setActiveSecurityTab(false)}
                  >
                    <RxCross2 />
                  </span>
                </h2>
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black transition"
                      placeholder="••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black transition"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black transition"
                      placeholder="Re-enter new password"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full border border-red-200 text-red-600 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-50 transition"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}

        {/* --- TAB 2: SUPPORT --- */}
        {activeTab === "support" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Create Ticket */}
            <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                  <FiLifeBuoy />
                </span>
                Raise a Ticket
              </h2>
              <form onSubmit={handleCreateTicket} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Booking Issue"
                    value={ticketForm.subject}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe your issue..."
                    value={ticketForm.message}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-black transition"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-purple-700 transition shadow-lg shadow-purple-200"
                >
                  <FiPlus /> Submit Ticket
                </button>
              </form>
            </div>

            {/* Ticket History */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your Support History
              </h3>

              {loadingTickets ? (
                <p>Loading tickets...</p>
              ) : tickets.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl text-center text-gray-400 border border-gray-100">
                  No tickets raised yet.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-gray-800">
                        {ticket.subject}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${ticket.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {ticket.status === "resolved" ? (
                          <FiCheckCircle />
                        ) : (
                          <FiClock />
                        )}{" "}
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {ticket.message}
                    </p>
                    <div className="mt-3 text-xs text-gray-400">
                      Raised on:{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
