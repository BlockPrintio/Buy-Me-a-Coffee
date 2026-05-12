import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer min-w-0"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
              ₳
            </div>
            <span className="font-bold text-base sm:text-lg text-gray-900 truncate">
              Support Ada
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {["Features", "How it works", "For creators", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="px-4 py-2 text-gray-700 font-semibold hover:text-blue-600 transition-colors">
              Log in
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Sign up
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="lg:hidden text-gray-800 hover:text-blue-600 transition-colors p-1"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200 py-4 space-y-4"
          >
            {["Features", "How it works", "For creators", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button className="w-full px-4 py-2 text-gray-700 font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Log in
              </button>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all">
                Sign up
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
