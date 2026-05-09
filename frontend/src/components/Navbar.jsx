import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 py-4 shadow-xl" 
        : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
            JobSphere
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 font-black text-slate-600 dark:text-slate-300">
          <Link to="/#features" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm">Features</Link>
          <Link to="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm">How it Works</Link>
          <Link to="/blog" className={`hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm ${location.pathname === '/blog' ? 'text-indigo-600 dark:text-cyan-400' : ''}`}>Insights</Link>
          <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm">Explore Jobs</Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-8">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard" className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-black hover:brightness-110 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm uppercase tracking-widest">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-cyan-400 font-black transition-colors uppercase tracking-widest text-sm">Log In</Link>
              <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-black hover:brightness-110 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 text-sm uppercase tracking-widest">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-900 dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 p-8 flex flex-col gap-8 md:hidden shadow-2xl backdrop-blur-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-6 font-black text-slate-600 dark:text-slate-300">
              <Link to="/#features" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-lg">Features</Link>
              <Link to="/#how-it-works" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-lg">How it Works</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-lg">Insights</Link>
              <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-lg">Explore Jobs</Link>
            </div>
            <div className="h-px bg-slate-200 dark:bg-white/5 w-full"></div>
            <div className="flex flex-col gap-4">
              <ThemeToggle />
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-black uppercase tracking-widest text-base">
                Log In
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-black text-center uppercase tracking-widest text-base">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
