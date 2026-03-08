import { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { 
  FiCheck, FiX, FiShield, FiAlertTriangle, FiEye, 
  FiMessageSquare, FiTrash2, FiMapPin, FiPhone, FiMail, FiExternalLink 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('businesses'); // businesses | support
  
  // Data States
  const [businesses, setBusinesses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // 1. Check Admin Role & Fetch Data
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'businesses') {
        const { data } = await api.get('/businesses'); 
        setBusinesses(data.data);
      } else if (activeTab === 'support') {
        const { data } = await api.get('/admin/support');
        setTickets(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // 2. Action Handlers
  const handleStatus = async (id, status) => {
    const actionText = status === 'revoked' ? 'Revoke Approval' : status;
    if(!window.confirm(`Are you sure you want to ${actionText} for this business?`)) return;
    
    try {
      await api.put(`/admin/verify/${id}`, { status });
      toast.success(`Business status updated: ${status}`);
      fetchData(); // Refresh List
      setSelectedBusiness(null); // Close modal
    } catch (error) { 
      toast.error("Action Failed"); 
    }
  };

  const handleBlacklist = async (id) => {
    const reason = prompt("Enter reason for blacklisting this location (This will block future registrations here):");
    if(!reason) return;
    
    try {
      await api.post('/admin/blacklist', { businessId: id, reason });
      toast.success("Location Blacklisted & Business Rejected");
      fetchData();
      setSelectedBusiness(null);
    } catch (error) { 
      toast.error("Failed to blacklist"); 
    }
  };

  const handleResolveTicket = async (id) => {
    try {
      await api.put(`/admin/support/${id}`);
      toast.success("Ticket Resolved");
      // UI Optimistic Update
      setTickets(tickets.map(t => t._id === id ? {...t, status: 'resolved'} : t));
    } catch (error) { 
      toast.error("Failed"); 
    }
  };

  if (loading && !selectedBusiness) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                <FiShield size={24}/>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Console</h1>
        </div>

        {/* TABS */}
        <div className="flex gap-6 mb-8 border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('businesses')} 
                className={`pb-3 px-2 font-bold text-sm transition-all ${activeTab === 'businesses' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Business Management
            </button>
            <button 
                onClick={() => setActiveTab('support')} 
                className={`pb-3 px-2 font-bold text-sm transition-all ${activeTab === 'support' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Support Tickets
            </button>
        </div>

        {/* --- TAB 1: BUSINESSES --- */}
        {activeTab === 'businesses' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Business</th>
                                <th className="px-6 py-4">Owner Info</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {businesses.map((biz) => (
                                <tr key={biz._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{biz.name}</div>
                                        <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">{biz.category}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div>{biz.owner?.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-400">{biz.owner?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {biz.isApproved ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                                                <FiCheck size={10}/> Active
                                            </span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                                                <FiAlertTriangle size={10}/> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedBusiness(biz)} 
                                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-700 transition shadow-md"
                                        >
                                            View & Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {businesses.length === 0 && <div className="p-8 text-center text-gray-400">No businesses found.</div>}
            </div>
        )}

        {/* --- TAB 2: SUPPORT TICKETS --- */}
        {activeTab === 'support' && (
            <div className="grid gap-4">
                {tickets.length === 0 && <div className="bg-white p-8 rounded-2xl text-center text-gray-400">No support tickets.</div>}
                
                {tickets.map(ticket => (
                    <div key={ticket._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {ticket.status}
                                </span>
                                <span className="text-xs text-gray-400">• {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase font-bold">{ticket.role}</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{ticket.subject}</h3>
                            <p className="text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">{ticket.message}</p>
                            
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">{ticket.user?.name[0]}</div>
                                {ticket.user?.name} <span className="text-gray-400">({ticket.user?.email})</span>
                            </div>
                        </div>
                        
                        {ticket.status === 'open' && (
                            <button 
                                onClick={() => handleResolveTicket(ticket._id)} 
                                className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-100"
                            >
                                <FiCheck /> Mark Resolved
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}

      </div>

      {/* --- MODAL: BUSINESS DETAILS & ACTIONS --- */}
      <AnimatePresence>
        {selectedBusiness && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedBusiness(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                
                {/* Content */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                    className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl z-10"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-gray-100 p-6 flex justify-between items-center z-20">
                        <h2 className="text-xl font-bold text-gray-800">Manage Listing</h2>
                        <button onClick={() => setSelectedBusiness(null)} className="p-2 hover:bg-gray-100 rounded-full transition"><FiX size={20}/></button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="font-bold text-3xl text-gray-900">{selectedBusiness.name}</h3>
                            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">{selectedBusiness.category}</span>
                                <span>•</span>
                                <span>{selectedBusiness.city}</span>
                            </div>
                        </div>
                        
                        {/* 🟢 Contact & Location Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {/* Phone */}
                            <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm"><FiPhone/></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                                    <p className="font-bold text-gray-700">{selectedBusiness.phone}</p>
                                </div>
                            </div>

                            {/* Owner Email */}
                            <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                                <div className="bg-white p-2 rounded-lg text-purple-600 shadow-sm"><FiMail/></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Owner Email</p>
                                    <p className="font-bold text-gray-700 break-all">{selectedBusiness.owner?.email || "N/A"}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100">
                                <div className="bg-white p-2 rounded-lg text-red-600 shadow-sm"><FiMapPin/></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Address</p>
                                    <p className="font-bold text-gray-700">{selectedBusiness.address}</p>
                                </div>
                            </div>

                            {/* 📍 SURVEY TOOLS: COORDINATES & MAP LINK */}
                            {selectedBusiness.location?.coordinates && (
                                <div className="md:col-span-2 bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div>
                                        <p className="text-[10px] text-blue-800 font-bold uppercase mb-1 flex items-center gap-1">
                                            <FiExternalLink/> Exact Location (GPS)
                                        </p>
                                        <div className="font-mono text-xs text-blue-900 bg-white/50 px-2 py-1 rounded">
                                            {selectedBusiness.location.coordinates[1]}, {selectedBusiness.location.coordinates[0]}
                                        </div>
                                    </div>
                                    <a 
                                        href={`https://www.google.com/maps?q=${selectedBusiness.location.coordinates[1]},${selectedBusiness.location.coordinates[0]}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                                    >
                                        <FiMapPin /> Open in Google Maps
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Image Proof */}
                        {selectedBusiness.image && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Shop Image / Proof</p>
                                <div className="rounded-xl overflow-hidden border border-gray-200 h-56 bg-gray-100 group relative">
                                     <img 
                                        src={selectedBusiness.image} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                                        alt="Shop Proof"
                                     />
                                     <a href={selectedBusiness.image} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-md opacity-0 group-hover:opacity-100 transition">View Full</a>
                                </div>
                            </div>
                        )}

                        {/* ⚡ ACTIONS */}
                        <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            
                            {/* APPROVE / REVOKE */}
                            {selectedBusiness.isApproved ? (
                                <button 
                                    onClick={() => handleStatus(selectedBusiness._id, 'revoked')} 
                                    className="bg-yellow-100 text-yellow-700 py-3 rounded-xl font-bold hover:bg-yellow-200 transition flex items-center justify-center gap-2"
                                >
                                    <FiAlertTriangle /> Revoke Approval
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleStatus(selectedBusiness._id, 'approved')} 
                                    className="bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                                >
                                    <FiCheck /> Approve Business
                                </button>
                            )}

                            {/* REJECT (Only if not approved) */}
                            {!selectedBusiness.isApproved && (
                                <button 
                                    onClick={() => handleStatus(selectedBusiness._id, 'rejected')} 
                                    className="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                                >
                                    <FiX /> Reject Request
                                </button>
                            )}
                            
                            {/* BLACKLIST */}
                            <button 
                                onClick={() => handleBlacklist(selectedBusiness._id)} 
                                className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${selectedBusiness.isApproved ? 'col-span-1 bg-red-600 text-white hover:bg-red-700' : 'sm:col-span-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'}`}
                            >
                                <FiShield /> Blacklist Location & Block
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;