import { motion } from "framer-motion";

const CategoryMarquee = () => {
  const categories = ["Plumber", "Electrician", "Cafe", "Salon", "Mechanic", "Doctor", "Tutor", "Gym", "Carpenter", "Painter"];
  return (
    <div className="w-full overflow-hidden bg-slate-900 py-3 border-y border-slate-800">
      <motion.div className="flex gap-12 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, ease: "linear", duration: 30 }}>
        {[...categories, ...categories, ...categories, ...categories].map((cat, i) => (
          <span key={i} className="text-slate-400 text-sm font-medium uppercase tracking-widest hover:text-white transition cursor-pointer">
            {cat}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryMarquee;