import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const DotPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
);

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${searchTerm}`);
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      <DotPattern />
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-6">
        <span className="bg-white/80 backdrop-blur border border-gray-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live in 50+ Cities
        </span>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
        Discover local <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
          Experts & Services
        </span>
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        Connect with trusted professionals in your neighborhood. <br className="hidden sm:block" /> Verified reviews, instant booking, and transparent pricing.
      </motion.p>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="max-w-xl mx-auto relative z-20">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-white rounded-full p-2 shadow-xl border border-gray-100">
            <div className="pl-4 text-gray-400"><FiSearch size={20} /></div>
            <input type="text" placeholder="Search for 'Plumber' or 'Cafe'..." className="w-full pl-3 pr-4 py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition shadow-lg">Search</button>
          </div>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
        <span className="mr-2">Trending:</span>
        {["Electrician", "Salon", "Gym", "Mechanic"].map((tag) => (
          <button key={tag} onClick={() => navigate(`/services?search=${tag}`)} className="bg-white border border-gray-200 px-3 py-1 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition text-xs font-medium">
            {tag}
          </button>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;