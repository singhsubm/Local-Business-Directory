import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "Is it free to list my business?", a: "Yes! Creating a basic listing is completely free. We charge a small commission only on confirmed bookings." },
    { q: "How do you verify professionals?", a: "We require government ID and professional licenses. Our team manually reviews every submission within 24 hours." },
    { q: "Can I cancel a booking?", a: "Yes, you can cancel up to 2 hours before the scheduled time directly from your dashboard." }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition text-left">
                <span className="font-semibold text-gray-800">{item.q}</span>
                {openIndex === i ? <FiMinus /> : <FiPlus />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-5 text-gray-600 border-t border-gray-200">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;