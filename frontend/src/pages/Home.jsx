import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Briefcase, Zap, Shield, ChevronRight, Globe, Star } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">JobSphere</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
          <Link to="/jobs" className="hover:text-blue-600 transition">Explore Jobs</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2 text-gray-700 hover:text-blue-600 font-bold transition">Log In</Link>
          <Link to="/register" className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-blue-600 transition shadow-lg shadow-gray-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-xs uppercase tracking-widest mb-8 border border-blue-100"
          >
            <Sparkles size={14} /> The Future of Work is AI-Powered
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.1] mb-8"
          >
            Hire talent <span className="text-blue-600">smarter</span>,<br /> work faster.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mb-12 leading-relaxed"
          >
            JobSphere connects top freelancers with elite employers using AI-driven matching, 
            automated proposal generation, and real-time collaboration tools.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row gap-6"
          >
            <Link to="/register" className="group px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex items-center gap-3 shadow-2xl shadow-blue-100">
              Post a Job <ChevronRight className="group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/jobs" className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition">
              Browse Freelance Work
            </Link>
          </motion.div>
        </div>

        {/* Floating elements for visual flair */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-8 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Zap className="text-blue-600" />, title: "AI Resumes", desc: "Generate professional resumes in seconds tailored to your skills and career history." },
              { icon: <Star className="text-purple-600" />, title: "Smart Matching", desc: "Our AI engine analyzes job descriptions to find your perfect professional match." },
              { icon: <Shield className="text-green-600" />, title: "Real-time Chat", desc: "Collaborate instantly with integrated messaging and instant notifications." }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-white rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-blue-50 transition cursor-default group">
                <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-gray-900">JobSphere</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 JobSphere Inc. Built with AI for the next generation of freelancers.</p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-blue-600 transition"><Globe size={20} /></a>
            <a href="#" className="hover:text-blue-600 transition"><Star size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
