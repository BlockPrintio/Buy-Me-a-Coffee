import React, { useEffect, useState } from 'react';
import { SearchIcon, ChevronDownIcon, MenuIcon, XIcon } from 'lucide-react';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cardano-blue rounded-full flex items-center justify-center text-white font-bold font-display text-lg">
            ₳
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Buy me an ₳DA
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <a href="#faq" className="hover:text-cardano-blue transition-colors">
            FAQ
          </a>
          <a
            href="#wall-of-love"
            className="hover:text-cardano-blue transition-colors">
            
            Wall of ₳
          </a>
          <div className="group relative flex items-center gap-1 cursor-pointer hover:text-cardano-blue transition-colors">
            Resources <ChevronDownIcon className="w-4 h-4" />
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators"
              className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cardano-blue/20 w-48 transition-all focus:w-64" />
            
          </div>
          <button className="font-medium text-sm hover:text-cardano-blue transition-colors px-2">
            Log in
          </button>
          <button className="bg-cardano-blue text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-blue-800 transition-colors shadow-sm hover:shadow-md">
            Sign up
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          
          {mobileMenuOpen ?
          <XIcon className="w-6 h-6" /> :

          <MenuIcon className="w-6 h-6" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen &&
      <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col gap-4">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
            type="text"
            placeholder="Search creators"
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none" />
          
          </div>
          <a href="#faq" className="font-medium py-2 border-b border-gray-50">
            FAQ
          </a>
          <a
          href="#wall-of-love"
          className="font-medium py-2 border-b border-gray-50">
          
            Wall of ₳
          </a>
          <a
          href="#resources"
          className="font-medium py-2 border-b border-gray-50">
          
            Resources
          </a>
          <div className="flex flex-col gap-2 mt-2">
            <button className="font-medium py-2 text-center border border-gray-200 rounded-full">
              Log in
            </button>
            <button className="bg-cardano-blue text-white py-2 rounded-full font-medium text-center">
              Sign up
            </button>
          </div>
        </div>
      }
    </header>);

}