import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import api from "../../utils/api";
import BusinessCard from "../BusinessCard";

const FeaturedListings = () => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [featuredIndividuals, setFeaturedIndividuals] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/businesses");
        const shopsOnly = data.data.filter((b) => b.listingType === "shop");
        setFeaturedBusinesses(shopsOnly.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchFeaturedIndividuals = async () => {
      try {
        const { data } = await api.get("/businesses");
        const individualsOnly = data.data.filter((b) => b.listingType === "individual");
        setFeaturedIndividuals(individualsOnly.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeaturedIndividuals();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Trending Near You
            </h2>
            <p className="text-slate-500 mt-2">
              Highly rated businesses and professionals based on user reviews.
            </p>
          </div>
          <Link
            to="/services"
            className="group flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Services{" "}
            <FiArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBusinesses.map((biz) => (
            <BusinessCard key={biz._id} business={biz} />
          ))}
        </div>
        <div>
          <Link
            to="/individuals"
            className="group flex items-center justify-end gap-2 font-semibold text-indigo-600 hover:text-indigo-700 transition mt-8"
          >
            View All Individuals{" "}
            <FiArrowRight className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {featuredIndividuals.map((ind) => (
            <BusinessCard key={ind._id} business={ind} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
