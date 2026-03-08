import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Loading true rakhenge shuru mein, taaki jab tak check na ho jaye, Login page na dikhe
  const [loading, setLoading] = useState(true); 

  // ✅ App start hote hi check karo
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const { data } = await api.get('/auth/me'); // Backend se user data mango
      setUser(data.data);
    } catch (error) {
      setUser(null); // Agar cookie expire ho gayi ya nahi hai
    } finally {
      setLoading(false); // Loading khatam
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      setUser(data.user);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
      localStorage.removeItem('userLocation');
      toast.info('Logged out successfully');
      window.location.href = '/login'; // Force redirect
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {/* Jab tak loading hai, kuch mat dikhao (ya spinner dikhao) taaki flickering na ho */}
      {!loading && children}
    </AuthContext.Provider>
  );
};