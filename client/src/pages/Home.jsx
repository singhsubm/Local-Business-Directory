import Navbar from "../components/Navbar"; // Ensure you have this
import Footer from "../components/Footer";
import Hero from "../components/home/Hero";
import CategoryMarquee from "../components/home/CategoryMarquee"; // Extract Marquee logic separately or keep in Hero
import StatsCounter from "../components/StatsCounter";
import FeaturedListings from "../components/home/FeaturedListings";
import FeaturesGrid from "../components/home/FeaturesGrid";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* 1. Hero Section (Search & Intro) */}
      <Hero />

      {/* 2. Marquee (Infinite Scroll) */}
      <CategoryMarquee />

      {/* 3. Stats (Numbers) */}
      <StatsCounter />

      {/* 4. Featured Businesses (API Data) */}
      <FeaturedListings />

      {/* 5. Why Choose Us (Bento Grid) */}
      <FeaturesGrid />

      {/* 6. How it Works (Steps) */}
      <HowItWorks />

      {/* 7. Social Proof (Reviews) - NEW SECTION */}
      <Testimonials />

      {/* 8. FAQ (Questions) - NEW SECTION */}
      <FAQ />

      {/* 9. Final Call to Action */}
      <CTA />
      
    </div>
  );
};

export default Home;