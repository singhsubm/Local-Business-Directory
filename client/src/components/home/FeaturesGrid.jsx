import { motion } from "framer-motion";
import { FiShield, FiCheckCircle, FiMapPin, FiStar } from "react-icons/fi";

const BentoItem = ({ children, className }) => (
  <motion.div whileHover={{ y: -5 }} className={`rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white ${className}`}>
    {children}
  </motion.div>
);

const FeaturesGrid = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto bg-gray-50/50">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Everything you need</h2>
        <p className="text-slate-500 text-lg">Features designed to build trust and save time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
                {/* Box 1: Verification (Vertical - Dark Theme) */}
                <BentoItem className="md:col-span-1 md:row-span-2 bg-zinc-800 text-white border-slate-800 relative overflow-hidden group flex flex-col justify-between p-0">
                  {/* Background Gradient */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-overlay filter blur-[80px] opacity-90 group-hover:opacity-40 transition duration-700"></div>
      
                  {/* Content */}
                  <div className="p-8 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md mb-6 border border-white/10">
                      <FiShield className="text-2xl text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">100% Verified</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Fake listings ruin the experience. We manually verify every
                      business ID and license.
                    </p>
                  </div>
      
                  {/* Visual Element: Floating "Verified Card" */}
                  <div className="relative w-full h-48 mt-4 overflow-hidden">
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-20px] group-hover:bottom-0 transition-all duration-500 ease-out">
                      <div className="w-56 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-t-2xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                          <div className="space-y-1">
                            <div className="w-24 h-2 bg-white/20 rounded-full"></div>
                            <div className="w-16 h-2 bg-white/10 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                            <FiCheckCircle size={10} /> Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </BentoItem>
      
                {/* Box 2: Maps (Wide - Interactive Feel) */}
                <BentoItem className="md:col-span-2 relative overflow-hidden group bg-white border-gray-200 p-0 flex flex-col md:flex-row">
                  <div className="p-8 flex-1 relative z-10 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold w-fit mb-4">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      Live Location
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Interactive Maps
                    </h3>
                    <p className="text-slate-500 text-sm max-w-sm">
                      Don't just read the address. See exactly where they are located
                      relative to you.
                    </p>
                  </div>
      
                  {/* Map Visual */}
                  <div className="h-48 md:h-auto md:w-1/2 bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://static-maps.yandex.ru/1.x/?lang=en_US&ll=82.9739,25.3176&z=12&size=600,400&l=map')] bg-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-700"></div>
                    {/* Floating Pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <FiMapPin className="text-4xl text-red-600 drop-shadow-xl mb-2 relative z-10 group-hover:-translate-y-2 transition duration-500" />
                        <div className="w-8 h-2 bg-black/20 blur-sm rounded-[100%] absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                      </div>
                    </div>
                  </div>
                </BentoItem>
      
                {/* Box 3: Reviews (Community Vibe) */}
                <BentoItem className="bg-white border-gray-200 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Real Reviews
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">
                      Trusted by the community.
                    </p>
      
                    {/* Avatar Stack */}
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-1 ${
                            i === 1
                              ? "bg-blue-500"
                              : i === 2
                                ? "bg-purple-500"
                                : i === 3
                                  ? "bg-pink-500"
                                  : "bg-gray-800"
                          }`}
                        >
                          {i === 4 ? (
                            "+2k"
                          ) : (
                            <FiStar size={12} className="fill-white" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Background Decoration */}
                  <div className="absolute -bottom-4 -right-4 text-9xl text-gray-50 opacity-50 rotate-12 group-hover:rotate-0 transition duration-500">
                    "
                  </div>
                </BentoItem>
      
                {/* Box 4: Booking (Notification Style) */}
                <BentoItem className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-none relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">Instant Booking</h3>
                    <p className="text-blue-100 text-sm mb-6">
                      Skip the phone calls.
                    </p>
      
                    {/* Fake Notification UI */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-3 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                      <div className="bg-green-400 p-1.5 rounded-full">
                        <FiCheckCircle className="text-white text-xs" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">Booking Confirmed</div>
                        <div className="text-[10px] text-blue-100">
                          Today, 4:00 PM
                        </div>
                      </div>
                    </div>
                  </div>
                </BentoItem>
              </div>
    </section>
  );
};

export default FeaturesGrid;