import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 rounded-t-[3rem] mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter">LocalFinder.</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connecting you with the best local experts. Verified, Trusted, and Fast.
          </p>
          <div className="flex gap-4">
            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h3 className="font-bold mb-6">Company</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/" className="hover:text-white transition">Careers</Link></li>
            <li><Link to="/" className="hover:text-white transition">Press</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h3 className="font-bold mb-6">Support</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link to="/support" className="hover:text-white transition">Help Center</Link></li>
            <li><Link to="/" className="hover:text-white transition">Safety Information</Link></li>
            <li><Link to="/" className="hover:text-white transition">Cancellation Options</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold mb-6">Stay Updated</h3>
          <div className="flex bg-white/10 p-1 rounded-xl">
             <input type="email" placeholder="Your email" className="bg-transparent w-full px-4 outline-none text-sm text-white placeholder-gray-500"/>
             <button className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition">Go</button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 sm:flex mt-16 pt-8 text-center text-gray-500 text-xs justify-around">
      <p>Made with <span className='animate-pulse'>💖</span> by Shubham Singh.</p>
        <p>© 2026 LocalFinder Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;