import { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { FiMessageCircle, FiSend } from 'react-icons/fi';

const Help = () => {
  const { user } = useContext(AuthContext);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', { role: user.role, subject, message }); // Backend route banana padega niche dekho
      toast.success("Ticket raised! Admin will contact you.");
      setSubject(''); setMessage('');
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-24">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600"><FiMessageCircle size={24}/></div>
            <div>
              <h1 className="text-2xl font-bold">Help & Support</h1>
              <p className="text-gray-500">Contact Admin for issues regarding {user?.role === 'business' ? 'your shop' : 'bookings'}.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Subject</label>
              <input type="text" required value={subject} onChange={e=>setSubject(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" placeholder="e.g. Payment Issue / Wrong Listing"/>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Message</label>
              <textarea required rows="5" value={message} onChange={e=>setMessage(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" placeholder="Describe your issue..."></textarea>
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800"><FiSend/> Send Ticket</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Help;