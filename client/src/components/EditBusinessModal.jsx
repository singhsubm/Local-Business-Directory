import { useState } from "react";
import {
  FiX,
  FiUser,
  FiBriefcase,
  FiSave,
  FiImage,
  FiVideo,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";

const EditBusinessModal = ({ business, onClose, onUpdate }) => {
  // --- 1. STATES ---
  const [formData, setFormData] = useState({
    name: business.name,
    phone: business.phone,
    description: business.description,
  });

  const [loading, setLoading] = useState(false);

  // Gallery State (From your old code)
  const [galleryImages, setGalleryImages] = useState(
    business.galleryImages || [],
  );
  const [galleryVideos, setGalleryVideos] = useState(
    business.galleryVideos || [],
  );
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);

  // Individual Details State (New Detailed Fields)
  const [indDetails, setIndDetails] = useState(
    business.individualDetails || {
      experience: "0",
      serviceRadius: 5,
      availability: "Full Day",
      isEmergencyAvailable: false,
      visitingCharge: 0,
      hasTools: false,
      hasVehicle: false,
      paymentModes: [],
      languages: [],
      skills: [],
    },
  );

  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);
  // Shop Details State (New Detailed Fields)
  const [shopDetails, setShopDetails] = useState(
    business.shopDetails || {
      openingTime: "",
      closingTime: "",
      offDays: [],
      avgServiceTime: "30 min",
      priceRange: "₹",
      onlinePayment: true,
      topServices: [],
      walkInAllowed: true,
      maxCustomers: 1,
      cancellationPolicy: "Flexible",
    },
  );

  // --- 2. HANDLERS ---

  // Handle Comma Separated Arrays
  const handleArrayInput = (setter, currentObj, field, value) => {
    setter({ ...currentObj, [field]: value.split(",").map((s) => s.trim()) });
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + galleryImages.length + newImages.length > 10) {
      return toast.error("Max 10 images allowed");
    }
    setNewImages([...newImages, ...files]);
  };

  // Handle Video Selection
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + galleryVideos.length + newVideos.length > 3) {
      return toast.error("Max 3 videos allowed");
    }
    setNewVideos([...newVideos, ...files]);
  };

  // Remove newly added image
  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Remove newly added video
  const removeNewVideo = (index) => {
    setNewVideos(newVideos.filter((_, i) => i !== index));
  };

  const removeOldImage = (index) => {
    setDeletedImages([...deletedImages, galleryImages[index]]);
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const removeOldVideo = (index) => {
    setDeletedVideos([...deletedVideos, galleryVideos[index]]);
    setGalleryVideos(galleryVideos.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Append Basic Fields
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("description", formData.description);

      // Append Nested JSON Objects
      data.append("individualDetails", JSON.stringify(indDetails));
      data.append("shopDetails", JSON.stringify(shopDetails));

      data.append("deletedImages", JSON.stringify(deletedImages));
      data.append("deletedVideos", JSON.stringify(deletedVideos));

      // Append New Files (Multer fields must match backend config)
      newImages.forEach((f) => data.append("galleryImages", f));
      newVideos.forEach((f) => data.append("galleryVideos", f));

      // Note: Existing galleryImages URLs are typically handled by
      // keeping them in the DB. If you want to delete specific old images,
      // you'd need a separate delete logic or send the filtered list back.
      // For now, we assume this adds NEW images to the list.

      const { data: res } = await api.put(`/businesses/${business._id}`, data);

      toast.success("Updated Successfully!");
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-10">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center sticky top-0 z-10">
          <h2 className="font-bold text-lg flex items-center gap-2">
            Edit {business.listingType === "shop" ? "Shop" : "Profile"}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* --- COMMON FIELDS --- */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50"
              ></textarea>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- GALLERY SECTION (Restored from your code) --- */}
          <div className="space-y-4">
            {/* Images */}
            <div>
              <label className="flex items-center gap-2 font-bold text-sm mb-2">
                <FiImage /> Gallery Images (Max 10)
              </label>
              <div className="flex gap-2 flex-wrap mb-2">
                {/* Existing */}
                {galleryImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="w-16 h-16 rounded object-cover border"
                    />

                    <button
                      type="button"
                      onClick={() => removeOldImage(i)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}

                {/* New Preview */}
                {newImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />

                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>

            {/* Videos */}
            <div>
              <label className="flex items-center gap-2 font-bold text-sm mb-2">
                <FiVideo /> Gallery Videos (Max 3)
              </label>
              <div className="flex gap-2 flex-wrap mb-2">
                {galleryVideos.map((vid, i) => (
                  <div key={i} className="relative">
                    <video src={vid} className="w-24 h-16 rounded border" />

                    <button
                      type="button"
                      onClick={() => removeOldVideo(i)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}

                {newVideos.map((vid, i) => (
                  <div key={i} className="relative">
                    <video
                      src={URL.createObjectURL(vid)}
                      className="w-24 h-16 rounded-lg object-cover border"
                    />

                    <button
                      type="button"
                      onClick={() => removeNewVideo(i)}
                      className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoChange}
                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- INDIVIDUAL DETAILS (Detailed Fields) --- */}
          {business.listingType === "individual" && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                <FiUser /> Professional Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-blue-800">
                    Experience (Year)
                  </label>
                  <input
                    type="number"
                    value={indDetails.experience}
                    onChange={(e) =>
                      setIndDetails({
                        ...indDetails,
                        experience: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  ></input>
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-800">
                    Radius (km)
                  </label>
                  <select
                    value={indDetails.serviceRadius}
                    onChange={(e) =>
                      setIndDetails({
                        ...indDetails,
                        serviceRadius: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="20">20 km</option>
                    <option value="50">50 km</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-blue-800">
                    Visit Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={indDetails.visitingCharge}
                    onChange={(e) =>
                      setIndDetails({
                        ...indDetails,
                        visitingCharge: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-800">
                    Availability
                  </label>
                  <select
                    value={indDetails.availability}
                    onChange={(e) =>
                      setIndDetails({
                        ...indDetails,
                        availability: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  >
                    <option value="Full Day">Full Day</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-blue-800">
                  Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AC Repair, Wiring"
                  value={indDetails.skills?.join(", ")}
                  onChange={(e) =>
                    handleArrayInput(
                      setIndDetails,
                      indDetails,
                      "skills",
                      e.target.value,
                    )
                  }
                  className="w-full p-2 rounded border bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-blue-800">
                    Languages
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hindi, English"
                    value={indDetails.languages?.join(", ")}
                    onChange={(e) =>
                      handleArrayInput(
                        setIndDetails,
                        indDetails,
                        "languages",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-800">
                    Payment Modes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cash, UPI"
                    value={indDetails.paymentModes?.join(", ")}
                    onChange={(e) =>
                      handleArrayInput(
                        setIndDetails,
                        indDetails,
                        "paymentModes",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-bold text-blue-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indDetails.isEmergencyAvailable}
                    onChange={(e) =>
                      setIndDetails({
                        ...indDetails,
                        isEmergencyAvailable: e.target.checked,
                      })
                    }
                  />{" "}
                  Emergency
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-blue-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indDetails.hasTools}
                    onChange={(e) =>
                      setIndDetails({
                        ...indDetails,
                        hasTools: e.target.checked,
                      })
                    }
                  />{" "}
                  Has Tools
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-blue-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={indDetails.hasVehicle}
                    onChange={(e) =>
                      setIndDetails({
                        ...indDetails,
                        hasVehicle: e.target.checked,
                      })
                    }
                  />{" "}
                  Has Vehicle
                </label>
              </div>
            </div>
          )}

          {/* --- SHOP DETAILS (Detailed Fields) --- */}
          {business.listingType === "shop" && (
            <div className="space-y-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h3 className="font-bold text-orange-900 flex items-center gap-2 mb-2">
                <FiBriefcase /> Shop Operations
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-orange-800">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={shopDetails.openingTime}
                    onChange={(e) =>
                      setShopDetails({
                        ...shopDetails,
                        openingTime: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-orange-800">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={shopDetails.closingTime}
                    onChange={(e) =>
                      setShopDetails({
                        ...shopDetails,
                        closingTime: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  />
                </div>
              </div>

              {business.bookingType !== "none" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-orange-800">
                      Price Range
                    </label>
                    <select
                      value={shopDetails.priceRange}
                      onChange={(e) =>
                        setShopDetails({
                          ...shopDetails,
                          priceRange: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded border bg-white text-sm"
                    >
                      <option value="₹">₹ (Budget)</option>
                      <option value="₹₹">₹₹ (Mid)</option>
                      <option value="₹₹₹">₹₹₹ (Premium)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-orange-800">
                      Avg Service Time
                    </label>
                    <select
                      value={shopDetails.avgServiceTime}
                      onChange={(e) =>
                        setShopDetails({
                          ...shopDetails,
                          avgServiceTime: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded border bg-white text-sm"
                    >
                      <option value="30 min">30 min</option>
                      <option value="45 min">45 min</option>
                      <option value="60 min">60 min</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-orange-800">
                  Top 3 Services (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Haircut, Massage, Facial"
                  value={shopDetails.topServices?.join(", ")}
                  onChange={(e) =>
                    handleArrayInput(
                      setShopDetails,
                      shopDetails,
                      "topServices",
                      e.target.value,
                    )
                  }
                  className="w-full p-2 rounded border bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-orange-800">
                    Off Days
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monday"
                    value={shopDetails.offDays?.join(", ")}
                    onChange={(e) =>
                      handleArrayInput(
                        setShopDetails,
                        shopDetails,
                        "offDays",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 rounded border bg-white text-sm"
                  />
                </div>
                {business.bookingType !== "none" && (
                  <div>
                    <label className="text-xs font-bold text-orange-800">
                      Cancel Policy
                    </label>
                    <select
                      value={shopDetails.cancellationPolicy}
                      onChange={(e) =>
                        setShopDetails({
                          ...shopDetails,
                          cancellationPolicy: e.target.value,
                        })
                      }
                      className="w-full p-2 rounded border bg-white text-sm"
                    >
                      <option value="Flexible">Flexible</option>
                      <option value="Strict">Strict</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-bold text-orange-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shopDetails.onlinePayment}
                    onChange={(e) =>
                      setShopDetails({
                        ...shopDetails,
                        onlinePayment: e.target.checked,
                      })
                    }
                  />{" "}
                  Accept Online Pay
                </label>
                <label className="flex items-center gap-2 text-sm font-bold text-orange-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shopDetails.walkInAllowed}
                    onChange={(e) =>
                      setShopDetails({
                        ...shopDetails,
                        walkInAllowed: e.target.checked,
                      })
                    }
                  />{" "}
                  Walk-ins Allowed
                </label>
              </div>
            </div>
          )}

          <div className="pt-4 sticky bottom-0 bg-white">
            <button
              disabled={loading}
              className="bg-black text-white w-full py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBusinessModal;
