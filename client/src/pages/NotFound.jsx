import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decoration (Blobs) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-10 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      ></motion.div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-lg">
        
        {/* Animated 404 Text */}
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm"
        >
          404
        </motion.h1>

        {/* Floating Icon Animation */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="my-6 flex justify-center"
        >
            <div className="bg-white p-4 rounded-full shadow-xl border border-gray-100">
                <FiAlertTriangle className="text-5xl text-yellow-500" />
            </div>
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 text-lg">
          Oops! It seems you've lost your way.<br/> 
            The page you're looking for doesn't exist. 
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <FiArrowLeft /> Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition"
          >
            <FiHome /> Back to Home
          </motion.button>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-8 text-gray-400 text-sm">
        Error Code: 404_LOST_IN_SPACE 🛸
      </div>
    </div>
  );
};

export default NotFound;