import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home'; // NEW Landing Page
import Services from './pages/Services'; // OLD Home Page (Listings)
import Login from './pages/Login';
import Register from './pages/Register';
import AddBusiness from './pages/AddBusiness';
import BusinessDetails from './pages/BusinessDetails';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Admin Page

// Components
import Navbar from './components/Navbar'; // GLOBAL NAVBAR
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import Help from './pages/Help';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar is here, so it shows on ALL pages */}
        <Navbar />
        
        <ToastContainer position="bottom-right" theme="dark" />
        
        <Routes>
          <Route path="/" element={<Home />} /> {/* Landing Page */}
          <Route path="/services" element={<Services />} /> {/* Listing Page */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business/:id" element={<BusinessDetails />} />
          <Route path="/my-booking" element={<UserDashboard />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-business" 
            element={
              <ProtectedRoute>
                <AddBusiness />
              </ProtectedRoute>
            } 
          />
          
          {/* Dashboards */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['business', 'admin', 'professional']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- PROTECTED: ADMIN ONLY (SUPER SECURE) --- */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/support" element={<Help />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      <Footer/>
      </Router>
    </AuthProvider>
  );
}

export default App;