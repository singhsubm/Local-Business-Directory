import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import BookingModal from "../components/BookingModal";
import Map from "../components/Map";
import { AuthContext } from "../context/AuthContext";
import {
  FiMapPin,
  FiPhone,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiShield,
  FiTool,
  FiGlobe,
  FiShare2,
  FiDollarSign,
  FiZap,
  FiUserCheck,
  FiCalendar,
  FiMessageCircle,
  FiNavigation,
  FiVideo,
  FiSend,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Clean phone helper
  const cleanPhone = business?.phone?.startsWith("+91")
    ? business.phone.slice(3)
    : business?.phone;

  // --- REVIEW STATES ---
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // --- REVIEW HANDLERS ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");

    try {
      const { data } = await api.post(`/businesses/${id}/reviews`, {
        rating,
        comment,
      });
      setReviews([data.data, ...reviews]);
      setRating(0);
      setComment("");
      toast.success("Review added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((rev) => rev._id !== reviewId));
      toast.success("Review deleted");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, reviewRes] = await Promise.all([
          api.get(`/businesses/${id}`),
          api.get(`/businesses/${id}/reviews`),
        ]);
        setBusiness(bizRes.data.data);
        setReviews(reviewRes.data.data);
      } catch (error) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBookingClick = () => {
    if (!user) {
      toast.error("Please login to book");
      navigate("/login");
      return;
    }
    setShowBookingModal(true);
  };

  const getImageUrl = (img) => {
    if (img && (img.startsWith("http") || img.startsWith("data:"))) return img;
    return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: business.name,
          text: `Check out ${business.name} on LocalFinder!`,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  if (!business)
    return <div className="text-center mt-20">Business not found</div>;

  const isIndividual = business.listingType === "individual";
  const ind = business.individualDetails || {};
  const shop = business.shopDetails || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- HERO HEADER --- */}
      <div
        className={`relative ${isIndividual ? "h-72 bg-slate-900" : "h-80 bg-gray-900"}`}
      >
        {/* Cover Image (Only for Shops) */}
        {!isIndividual && (
          <>
            <img
              src={getImageUrl(business.image)}
              className="w-full h-full object-cover opacity-60"
              alt="Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </>
        )}

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleShare}
            className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition"
          >
            <FiShare2 size={20} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
            {/* Profile Image Logic */}
            <div className={`relative ${isIndividual ? "mb-[-50px]" : ""}`}>
              <img
                src={getImageUrl(business.image)}
                className={`object-cover border-4 border-white shadow-xl bg-white ${isIndividual ? "w-40 h-40 rounded-full" : "w-24 h-24 rounded-xl hidden md:block"}`}
                alt="Profile"
              />
              {isIndividual && business.isApproved && (
                <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-1.5 shadow-sm border-2 border-white">
                  <FiCheckCircle className="text-white text-xl" />
                </div>
              )}
            </div>

            {/* Header Text */}
            <div className="flex-1 text-white mb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  {business.name}
                </h1>
                {business.isApproved && !isIndividual && (
                  <span className="bg-blue-500/20 text-blue-200 text-xs px-2 py-1 rounded border border-blue-500/50 flex items-center gap-1">
                    <FiCheckCircle /> Verified
                  </span>
                )}
              </div>
              <p className="text-gray-300 mt-2 flex items-center gap-2 text-lg">
                <span className="bg-white/10 px-3 py-0.5 rounded-full text-sm font-medium backdrop-blur-sm">
                  {business.category}
                </span>
                <span>•</span>
                <FiMapPin size={16} /> {business.city}
              </p>
            </div>

            {/* Rating Badge */}
            <div className="mb-4 hidden md:block">
              <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold shadow-lg">
                <span className="text-2xl">{business.rating || "New"}</span>{" "}
                <FiStar fill="black" />
              </div>
              <p className="text-white text-xs text-right mt-1 opacity-80">
                {reviews.length} reviews
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isIndividual ? "mt-20" : "mt-8"} grid grid-cols-1 lg:grid-cols-3 gap-8`}
      >
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* 🌟 KEY HIGHLIGHTS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isIndividual ? (
              <>
                <StatCard
                  icon={<FiClock />}
                  label="Experience"
                  value={ind.experience || "Fresher"}
                />
                <StatCard
                  icon={<FiGlobe />}
                  label="Service Radius"
                  value={`${ind.serviceRadius || 5} km`}
                />
                <StatCard
                  icon={<FiDollarSign />}
                  label="Min Charge"
                  value={`₹${ind.visitingCharge || 0}`}
                />
                <StatCard
                  icon={<FiZap />}
                  label="Emergency"
                  value={ind.isEmergencyAvailable ? "Available" : "No"}
                  color={
                    ind.isEmergencyAvailable ? "text-red-500" : "text-gray-400"
                  }
                />
              </>
            ) : (
              <>
                <StatCard
                  icon={<FiClock />}
                  label="Avg Service"
                  value={shop.avgServiceTime || "30m"}
                />
                <StatCard
                  icon={<FiDollarSign />}
                  label="Price Range"
                  value={shop.priceRange || "N/A"}
                />
                <StatCard
                  icon={<FiShield />}
                  label="Online Pay"
                  value={shop.onlinePayment ? "Accepted" : "Cash Only"}
                />
                <StatCard
                  icon={<FiUserCheck />}
                  label="Walk-ins"
                  value={shop.walkInAllowed ? "Allowed" : "Book Only"}
                />
              </>
            )}
          </div>

          {/* About Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {business.description || "No description provided."}
            </p>

            {/* SKILLS / SERVICES TAGS */}
            {isIndividual && ind.skills && ind.skills.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ind.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isIndividual &&
              shop.topServices &&
              shop.topServices.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">
                    Popular Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {shop.topServices.map((svc, i) => (
                      <span
                        key={i}
                        className="bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full text-sm font-bold border border-orange-100"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* 📋 DETAILS LIST */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {isIndividual ? "Professional Info" : "Store Information"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {isIndividual ? (
                <>
                  <DetailRow
                    label="Languages"
                    value={ind.languages?.join(", ") || "Hindi, English"}
                  />
                  <DetailRow
                    label="Tools Available"
                    value={
                      ind.hasTools
                        ? "Yes, I bring tools"
                        : "No, Client provides"
                    }
                  />
                  <DetailRow
                    label="Payment Modes"
                    value={ind.paymentModes?.join(", ") || "Cash, UPI"}
                  />
                  <DetailRow
                    label="Availability"
                    value={ind.availability || "Full Day"}
                  />
                  <DetailRow
                    label="Transport"
                    value={ind.hasVehicle ? "Own Vehicle" : "Public Transport"}
                  />
                </>
              ) : (
                <>
                  <DetailRow
                    label="Opening Hours"
                    value={`${shop.openingTime || "09:00"} - ${shop.closingTime || "21:00"}`}
                  />
                  <DetailRow
                    label="Weekly Off"
                    value={shop.offDays?.join(", ") || "None"}
                  />
                  <DetailRow
                    label="Cancellation"
                    value={shop.cancellationPolicy || "N/A"}
                  />
                  <DetailRow
                    label="Max Customers"
                    value={shop.maxCustomers || "N/A"}
                  />
                </>
              )}
            </div>
          </div>

          {/* Gallery (Same as before) */}
          {business.galleryImages?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {business.galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="rounded-xl h-32 w-full object-cover shadow-sm hover:scale-105 transition cursor-pointer"
                    alt="Gallery"
                  />
                ))}
              </div>
            </div>
          )}
          {/* 🎥 VIDEOS GALLERY (Re-Added) */}
          {business.galleryVideos?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiVideo /> Videos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {business.galleryVideos.map((vid, i) => (
                  <video
                    key={i}
                    src={vid}
                    autoPlay
                    muted
                    loop
                    className="rounded-xl h-32 w-full object-cover shadow-sm hover:scale-105 transition cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 🟢 REVIEWS SECTION START */}
          <div
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
            id="reviews"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg text-yellow-700 font-bold">
                <span className="text-xl">{business.rating || "0"}</span>{" "}
                <FiStar className="fill-current" />
              </div>
            </div>

            {/* Review Form */}
            {user && user._id !== business.owner?._id && (
              <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                <h3 className="font-bold text-sm uppercase text-gray-500 mb-3">
                  Write a Review
                </h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <FiStar
                          className={`text-2xl ${star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white"
                      rows="3"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      className="absolute bottom-3 right-3 bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition shadow-lg"
                    >
                      <FiSend />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No reviews yet. Be the first!
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-100 pb-6 relative group last:border-0 last:pb-0"
                  >
                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 shrink-0">
                        {review.user?.name?.[0] || <FiUser />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {review.user?.name || "Anonymous"}
                        </h4>
                        <div className="flex text-yellow-400 text-xs my-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={
                                i < review.rating
                                  ? "fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map Section - ONLY FOR SHOPS */}
          {!isIndividual && business.location?.coordinates && (
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <FiMapPin /> Location
              </h3>
              <div className="h-80 w-full rounded-2xl overflow-hidden relative z-0 mb-4">
                <Map
                  coordinates={business.location.coordinates}
                  businessName={business.name}
                />
              </div>
              {/* 🟢 ACTUAL GOOGLE MAPS LINK FOR SHOPS */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${business.location.coordinates[1]},${business.location.coordinates[0]}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
              >
                <FiNavigation /> Get Directions
              </a>
            </div>
          )}

          {/* 🟢 LOCATION PRIVACY FOR INDIVIDUALS */}
          {isIndividual && (
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
              <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm shrink-0">
                <FiMapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900">
                  Service Area
                </h3>
                <p className="text-blue-800 mt-1 text-sm leading-relaxed">
                  This professional provides services in and around{" "}
                  <strong>{business.city}</strong> (within{" "}
                  {ind.serviceRadius || 5} km).
                  <br />
                  <span className="text-xs opacity-80 mt-1 block">
                    Exact location details are shared securely after booking
                    confirmation for safety reasons.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Sticky Card) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* BOOKING CARD */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 ring-1 ring-black/5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-wide">
                  Status
                </span>
                {/* Logic to determine if Open/Online */}
                {(() => {
                  // 1. Check Status based on type
                  const isShop = business.listingType === "shop";
                  const isOpen = isShop
                    ? (shop.status ?? true) // Shop ke liye (default true)
                    : (ind.status ?? true); // Individual ke liye (default true)

                  return isOpen ? (
                    <div className="flex px-3 py-1 rounded-full text-xs font-bold uppercase items-center gap-1 bg-green-100 text-green-800 border border-green-200">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      {isIndividual ? "Online" : "Open Now"}
                    </div>
                  ) : (
                    <div className="flex px-3 py-1 rounded-full text-xs font-bold uppercase items-center gap-1 bg-red-100 text-red-600 border border-red-200">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {isIndividual ? "Offline" : "Closed"}
                    </div>
                  );
                })()}
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Starting from
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-extrabold text-gray-900">
                    {isIndividual
                      ? `₹${ind.visitingCharge || 99}`
                      : shop.priceRange === "₹₹₹"
                        ? "Premium"
                        : "₹100+"}
                  </p>
                  {isIndividual && (
                    <span className="text-gray-500 font-medium">/ visit</span>
                  )}
                </div>
              </div>

              {user && user._id !== business.owner?._id && (
                <button
                  onClick={handleBookingClick}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition shadow-lg transform active:scale-[0.98] flex justify-center gap-2 items-center mb-3"
                >
                  <FiCalendar /> Book Service
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:bg-gray-200 transition"
                >
                  <FiPhone /> Call
                </a>
                <a
                  href={`https://wa.me/91${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-50 text-green-600 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:bg-green-100 transition border border-green-200"
                >
                  <FiMessageCircle /> WhatsApp
                </a>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-4 border-t pt-4 border-gray-100">
                {isIndividual
                  ? "Instant confirmation • Verified Pro"
                  : "Reserve your slot/table instantly"}
              </p>
            </div>

            {/* Safety/Verified Badge */}
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex gap-3 items-start">
              <FiShield className="text-green-600 mt-1 shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-green-900 text-sm">
                  Verified & Safe
                </h4>
                <p className="text-xs text-green-700 mt-1">
                  This listing has been verified for quality standards and
                  safety protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          business={business}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition cursor-default">
    <div className={`text-xl mb-2 ${color || "text-gray-900"}`}>{icon}</div>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
      {label}
    </p>
    <p className="font-bold text-gray-900 mt-1 text-sm">{value}</p>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
    <span className="text-gray-500 font-medium text-sm">{label}</span>
    <span className="font-bold text-gray-900 text-sm text-right">{value}</span>
  </div>
);

export default BusinessDetails;
