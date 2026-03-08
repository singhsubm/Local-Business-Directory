import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-4">
      <motion.div whileInView={{ y: [20, 0], opacity: [0, 1] }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Grow your business with us</h2>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">Join thousands of business owners who trust LocalFinder to connect with local customers instantly.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <button onClick={() => navigate("/add-business")} className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-md hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">List Your Business</button>
          <button onClick={() => navigate("/services")} className="px-8 py-4 rounded-full font-bold text-md text-white border border-slate-600 hover:bg-slate-700/50 transition">Explore Services</button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;