import { FiSearch, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <FiSearch size={28} />,
    title: "Search Service",
    desc: "Find the best local service near you.",
  },
  {
    icon: <FiMapPin size={28} />,
    title: "Choose Provider",
    desc: "Compare reviews & locations easily.",
  },
  {
    icon: <FiCheckCircle size={28} />,
    title: "Book Instantly",
    desc: "Confirm booking in seconds.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileInView={{ y: [30, 0], opacity: [0, 1] }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
