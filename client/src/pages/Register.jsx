import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiUser, FiBriefcase, FiTool } from "react-icons/fi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 🟢 New State for Role Selection (Default: user)
  // Options: 'user', 'business' (Shop Owner), 'professional' (Individual)
  const [role, setRole] = useState("user"); 
  
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Role bhejo backend ko
      const { data } = await api.post("/auth/register", { name, email, password, role });
      setUser(data.user);
      toast.success("Welcome to LocalFinder! 🎉");
      
      // Redirect based on role
      if (role === 'user') navigate("/");
      else navigate("/add-business"); // Business/Pro ko seedha listing page par bhejo

    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join your local community</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 🟢 ROLE SELECTION CARDS */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">I want to join as:</label>
            <div className="grid grid-cols-3 gap-2">
                {/* 1. Customer */}
                <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${role === 'user' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                >
                    <FiUser size={20}/>
                    <span className="text-[10px] font-bold uppercase">Customer</span>
                </button>

                {/* 2. Shop Owner */}
                <button
                    type="button"
                    onClick={() => setRole('business')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${role === 'business' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                >
                    <FiBriefcase size={20}/>
                    <span className="text-[10px] font-bold uppercase">Shop Owner</span>
                </button>

                {/* 3. Individual Pro */}
                <button
                    type="button"
                    onClick={() => setRole('professional')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition ${role === 'professional' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400 text-gray-600'}`}
                >
                    <FiTool size={20}/>
                    <span className="text-[10px] font-bold uppercase">Professional</span>
                </button>
            </div>
            
            {/* Helper Text */}
            <p className="text-xs text-gray-500 text-center italic mt-1">
                {role === 'user' && "Book services and explore shops."}
                {role === 'business' && "List 1 Shop + up to 3 Workers."}
                {role === 'professional' && "List yourself as a Service Provider (Max 1)."}
            </p>
          </div>

          <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition transform active:scale-95">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="font-bold text-black hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;