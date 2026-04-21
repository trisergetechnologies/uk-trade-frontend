"use client";

import Link from "next/link";
import {
  X,
  Mail,
  Send,
  Sparkles,
  Shield,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0a] text-gray-300 border-t border-white/10">
      
      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* BRAND */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-md opacity-70" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>

              <span className="text-xl font-bold text-white">
                MLM<span className="text-blue-500">Pro</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 mb-6">
              The all-in-one platform for network marketers. Build, scale, and automate your MLM business.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[FaFacebookF, X, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-blue-600 text-gray-400 hover:text-white flex items-center justify-center transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              Platform
            </h3>

            <ul className="space-y-3">
              {[
                "Commission Tracker",
                "Team Management",
                "Rank Achievements",
                "Bonus Programs",
                "Analytics Dashboard",
              ].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 text-sm transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FileText size={18} className="text-indigo-500" />
              Resources
            </h3>

            <ul className="space-y-3">
              {[
                "Blog & Articles",
                "Success Stories",
                "Training Videos",
                "Webinars",
                "Help Center",
              ].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 text-sm transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              Company
            </h3>

            <ul className="space-y-3">
              {[
                "About Us",
                "Pricing",
                "Partners",
                "Affiliate Program",
                "Contact Us",
              ].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-gray-400 hover:text-blue-500 text-sm transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Mail size={18} className="text-green-500" />
              Stay Updated
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              Get MLM tips and updates directly to your inbox.
            </p>

            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition">
                <Send size={16} />
                Subscribe
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-sm text-gray-500">
            © {currentYear} MLMPro. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((item, i) => (
              <Link key={i} href="#" className="text-gray-500 hover:text-blue-500 transition">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Shield size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500">Secure SSL Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;