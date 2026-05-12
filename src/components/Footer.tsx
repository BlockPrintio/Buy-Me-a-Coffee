import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Mail, Zap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#0A1428] to-black text-white pt-20 pb-10 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg gradient-text">
                  Support Ada
                </span>
                <span className="text-xs text-purple-400/70">
                  Cardano Creators
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              The non-custodial platform for Cardano creators to accept ADA
              support, build memberships, and grow their community on-chain.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:border-purple-500/60 transition-colors group"
              >
                <Twitter className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:border-purple-500/60 transition-colors group"
              >
                <Github className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:border-purple-500/60 transition-colors group"
              >
                <Mail className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
              </a>
            </div>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-bold mb-6 text-white">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Creator Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cardano Resources
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-purple-500/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-gray-500">
            © {currentYear} Support Ada. Built for the Cardano ecosystem. 100%
            non-custodial, on-chain verified.
          </p>
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <a
              href="https://cardano.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Cardano.org
            </a>
            <a
              href="https://docs.cardano.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Docs
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Status
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
