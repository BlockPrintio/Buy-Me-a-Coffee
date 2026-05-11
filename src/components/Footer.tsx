import React from 'react';
export function Footer() {
  return (
    <footer className="bg-cardano-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-cardano-dark font-bold font-display text-lg">
                ₳
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Buy me an ₳DA
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              The easiest way for Cardano creators to accept support, build
              memberships, and sell digital goods.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Creator Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Brand Assets
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
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
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Buy me an ADA. Built for the Cardano
            ecosystem.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Discord
            </a>
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>);

}