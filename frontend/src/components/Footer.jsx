import React from 'react';
import { Mail, Phone, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-900 pt-16 pb-8 px-8 md:px-16 text-dark-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Column 1: Brand & About */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xl font-outfit font-bold tracking-tight">Drone Logistics <span className="text-primary-500 font-medium text-sm">Pvt Ltd</span></span>
          </div>
          <p className="text-sm leading-relaxed">
            We provide smart drone delivery solutions. Empowering businesses with autonomous, AI-driven logistics for a faster and safer future.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6">
          <h4 className="text-white text-xs font-black uppercase tracking-widest">Quick Navigation</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
            <li><Link to="/marketplace" className="hover:text-primary-500 transition-colors">Marketplace</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary-500 transition-colors">Mission Control</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-6">
          <h4 className="text-white text-xs font-black uppercase tracking-widest">Connect With Us</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary-500" />
              <a href="mailto:support@dronelogistics.com" className="hover:text-white transition-colors">support@dronelogistics.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary-500" />
              <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 9876543210</a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter/Join */}
        <div className="space-y-6">
          <h4 className="text-white text-xs font-black uppercase tracking-widest">Initialize Account</h4>
          <p className="text-xs">Ready to optimize your fleet routes?</p>
          <Link to="/register" className="inline-flex items-center gap-2 group text-primary-500 font-bold text-sm">
            Launch Setup Wizard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-dark-900/50 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
        <p>&copy; 2026 Drone Logistics. All protocols operational.</p>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors">Terms of Flight</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Shield</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
