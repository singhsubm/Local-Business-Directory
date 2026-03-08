import { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { FiCalendar, FiClock, FiMapPin, FiPhone, FiInfo, FiGrid, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const getStatusColor = (status) => {
    switch(status) {
        case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
        case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
        case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 mt-16">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-500 mb-8">Track your appointments and reservations.</p>
        
        {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📅</div>
                <h3 className="text-xl font-bold text-gray-900">No bookings yet</h3>
                <p className="text-gray-500 mt-2 mb-6">Explore services nearby and make your first booking!</p>
                <Link to="/services" className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition">Explore Services</Link>
            </div>
        ) : (
            <div className="space-y-6">
                {bookings.map(booking => (
                    <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
                        
                        {/* Image */}
                        <div className="w-full md:w-32 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                           <img 
                             src={booking.business?.image || "https://images.unsplash.com/photo-1511317559916-56d5ddb62563?q=80&w=693&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
                             className="w-full h-full object-cover" 
                             alt={booking.business?.name}
                           />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h3 className="font-bold text-xl text-gray-900">{booking.business?.name}</h3>
                                 <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                    <FiMapPin size={14}/> {booking.business?.address}, {booking.business?.city}
                                 </p>
                              </div>
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                              </span>
                           </div>

                           <div className="mt-4 grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                 <div className="bg-white p-2 rounded-md shadow-sm text-blue-600"><FiCalendar/></div>
                                 <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                                    <p className="text-sm font-bold text-gray-800">{new Date(booking.date).toLocaleDateString()}</p>
                                 </div>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                                 <div className="bg-white p-2 rounded-md shadow-sm text-purple-600"><FiClock/></div>
                                 <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Time / Slot</p>
                                    <p className="text-sm font-bold text-gray-800">{booking.time}</p>
                                 </div>
                              </div>
                           </div>

                           {/* Problem / Message */}
                           <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex gap-2 items-start">
                              <FiInfo className="mt-0.5 flex-shrink-0"/>
                              <span>{booking.problem}</span>
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-center gap-2 border-l border-gray-100 pl-0 md:pl-6 pt-4 md:pt-0">
                            <a href={`tel:${booking.business?.phone}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                               <FiPhone/> Call Shop
                            </a>
                            <Link to={`/business/${booking.business?._id}`} className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition">
                               View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;