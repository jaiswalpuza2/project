import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Briefcase, Zap, Shield, ChevronRight, Globe, Star, UserPlus, Search, MessageSquare, BadgeCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] overflow-hidden selection:bg-indigo-500 selection:text-white">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center text-sm shadow-2xl">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles size={20} className="md:w-6 md:h-6" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">JobSphere</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12 font-black text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm">Features</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm">How it Works</a>
          <Link to="/jobs" className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm">Explore Jobs</Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/login" className="text-white hover:text-cyan-400 font-black transition-colors uppercase tracking-widest text-base">Log In</Link>
          <Link to="/register" className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-black hover:brightness-110 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 text-base uppercase tracking-widest">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-[#1E293B] border-b border-white/5 p-8 flex flex-col gap-8 md:hidden shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex flex-col gap-6 font-black text-slate-300">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-lg">Features</a>
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-lg">How it Works</a>
                <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400 transition-colors uppercase tracking-widest text-lg">Explore Jobs</Link>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-lg">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-black text-center uppercase tracking-widest text-lg shadow-xl shadow-indigo-500/20">
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="relative pt-40 md:pt-52 pb-24 md:pb-32 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 bg-indigo-500/10 text-cyan-400 rounded-full font-black text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] mb-8 md:mb-12 border border-indigo-500/20 backdrop-blur-md shadow-2xl"
          >
            <Sparkles size={16} className="animate-pulse md:w-5 md:h-5" /> The Future of Work is AI-Powered
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-white leading-[1.1] md:leading-[0.85] mb-8 md:mb-12 tracking-tighter"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Hire talent</span> <br className="hidden md:block" />
            <span className="text-cyan-400">smarter,</span><br className="md:hidden" /> 
            <span className="text-cyan-400"> work faster.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl lg:text-4xl text-slate-300 max-w-5xl mb-12 md:mb-20 leading-relaxed font-medium px-4"
          >
            JobSphere connects top freelancers with elite employers using AI-driven matching, 
            automated proposal generation, and real-time collaboration.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 md:gap-10 w-full sm:w-auto px-6 sm:px-0"
          >
            <Link to="/register" className="group px-8 md:px-14 py-5 md:py-8 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl hover:brightness-110 transition-all flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(79,70,229,0.3)] active:scale-95">
              Post a Job <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/jobs" className="px-8 md:px-14 py-5 md:py-8 bg-white/5 border border-white/10 text-white rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl hover:bg-[#1E293B] transition-all backdrop-blur-xl active:scale-95 text-center">
              Browse Work
            </Link>
          </motion.div>
        </div>
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] -z-10 animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-20 mix-blend-overlay pointer-events-none" />
      </section>
      <section id="features" className="py-40 px-8 bg-[#0F172A] relative border-t border-slate-700/30">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16 md:mb-24 px-4">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-8 leading-tight">Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Excellence</span></h2>
            <p className="text-slate-300 text-lg md:text-2xl max-w-4xl mx-auto font-medium leading-relaxed">Everything you need to thrive in the modern freelancer economy.</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4 md:px-0">
            {[
              { icon: <Zap size={28} className="text-cyan-400" />, title: "AI Resumes", desc: "Generate professional resumes in seconds tailored to your skills and career history." },
              { icon: <Star size={28} className="text-cyan-400" />, title: "Smart Matching", desc: "Our AI engine analyzes job descriptions to find your perfect professional match." },
              { icon: <Shield size={28} className="text-cyan-400" />, title: "Real-time Chat", desc: "Collaborate instantly with integrated messaging and instant notifications." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 md:p-12 bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] md:rounded-[3rem] border border-slate-600 hover:border-indigo-400/50 transition-all cursor-default group backdrop-blur-sm"
              >
                <div className="h-16 w-16 md:h-24 md:w-24 bg-[#0F172A] rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-12 group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-violet-600 group-hover:text-white transition-all duration-500 shadow-xl border border-white/5">
                  {f.icon}
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 tracking-tight group-hover:text-cyan-400 transition-colors">{f.title}</h3>
                <p className="text-slate-300 text-lg md:text-2xl leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 md:py-40 px-6 md:px-8 bg-slate-900 relative border-t border-slate-700/30 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <header className="text-center mb-16 md:mb-24 px-4">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-8">How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Works</span></h2>
            <p className="text-slate-300 text-lg md:text-2xl max-w-4xl mx-auto font-medium leading-relaxed">Four simple steps to transform the way you work and hire.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -translate-y-1/2 -z-10"></div>
            
            {[
              { icon: <UserPlus size={32} className="text-violet-400" />, title: "1. Create Profile", desc: "Sign up and use AI to instantly build a standout portfolio." },
              { icon: <Search size={32} className="text-indigo-400" />, title: "2. Get Matched", desc: "Our algorithm finds the perfect job or candidate for you." },
              { icon: <MessageSquare size={32} className="text-cyan-400" />, title: "3. Collaborate", desc: "Chat, share files, and manage your projects in real-time." },
              { icon: <BadgeCheck size={32} className="text-emerald-400" />, title: "4. Succeed", desc: "Deliver outstanding work and grow your professional reputation." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="relative bg-[#0F172A] p-8 rounded-[2.5rem] border border-slate-700 hover:border-violet-500/50 transition-all group shadow-xl"
              >
                <div className="h-20 w-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg border border-white/5 group-hover:bg-[#1E293B]">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight text-center">{step.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium text-center">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] -z-10" />
      </section>

      <Footer />
    </div>
  );
};
export default Home;
