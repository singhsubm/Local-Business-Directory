import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// allowedRoles: ['admin'], ['business'], or empty for any logged-in user
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  // 1. Agar login nahi hai -> Login page bhejo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar role match nahi kar raha (Jaise User trying to access Admin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Sab sahi hai -> Page dikhao
  return children;
};

export default ProtectedRoute;
