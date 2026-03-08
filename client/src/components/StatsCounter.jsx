import { motion } from "framer-motion";

const stats = [
  { label: "Businesses", value: "10K+" },
  { label: "Cities", value: "50+" },
  { label: "Bookings", value: "1M+" },
  { label: "Rating", value: "4.8⭐" },
];

const StatsCounter = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ y: [20, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-gray-50 shadow hover:shadow-lg transition"
          >
            <h3 className="text-3xl font-extrabold text-indigo-600">
              {item.value}
            </h3>
            <p className="text-slate-500 mt-2">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
