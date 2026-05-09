import React from "react";
import { Sparkles, Target, Users, ShieldCheck, Award } from "lucide-react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col pt-24">
      <div className="flex-1 max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6 bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20">
            <span className="text-indigo-400 font-black uppercase tracking-widest text-base">Our Vision</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-tight">
            Building the Infrastructure for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">
              Nepal's Digital Economy
            </span>
          </h1>
          <p className="text-2xl text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
            JobSphere was founded with a single mission: to bridge the gap between talented Nepali freelancers and global/local opportunities through a premium, trusted, and efficient platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-10 bg-slate-900 shadow-2xl rounded-[3rem] border border-slate-800/50 hover:border-indigo-500/30 transition-all group">
            <div className="h-14 w-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Our Mission</h3>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              To empower professionals in Nepal by providing tools, resources, and a marketplace that values skill above all else. We aim to reduce brain drain by creating high-value remote work opportunities.
            </p>
          </div>
          <div className="p-10 bg-slate-900 shadow-2xl rounded-[3rem] border border-slate-800/50 hover:border-emerald-500/30 transition-all group">
            <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Our Community</h3>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              We are more than a job board. We are a community of developers, designers, writers, and entrepreneurs dedicated to excellence and mutual growth in the digital space.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[4rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-indigo-500/20 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Award size={200} />
          </div>
          <h2 className="text-4xl font-black mb-8 relative z-10 uppercase tracking-tighter">Ready to join the revolution?</h2>
          <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto font-medium relative z-10">
            Whether you are a freelancer looking for your next big project or an employer seeking elite talent, JobSphere is your partner in success.
          </p>
          <div className="flex flex-wrap justify-center gap-6 relative z-10">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <ShieldCheck size={20} className="text-emerald-400" />
              <span className="font-bold text-sm uppercase tracking-widest text-white">Trust Verified</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <Award size={20} className="text-amber-400" />
              <span className="font-bold text-sm uppercase tracking-widest text-white">Top Rated Talent</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
