import React from "react";
import Footer from "../components/Footer";
import { ShieldCheck, Eye, Lock, Database } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col pt-24">
      <div className="flex-1 max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 bg-emerald-500/10 px-6 py-2 rounded-full border border-emerald-500/20">
            <Lock size={18} className="text-emerald-400" />
            <span className="text-emerald-400 font-black uppercase tracking-widest text-sm">Privacy Matters</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
            Privacy <span className="text-emerald-500">Policy</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium">Last Updated: March 24, 2026</p>
        </div>

        <div className="bg-slate-900/50 rounded-[3rem] p-10 md:p-16 border border-slate-800 shadow-2xl space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <Database size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">1. Data Collection</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              We collect information that you provide to us directly when you create an account, such as your name, email address, and professional history. We also collect project-related data to facilitate the platform's core functions.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <Eye size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">2. Information Usage</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              Your data is used to improve user experience, process transactions, and maintain platform security. We never sell your personal information to third parties. Verified employers only see the professional information you choose to display on your profile.
            </p>
          </section>

          <section>
             <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">3. Security</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              We implement advanced security measures, including encryption and secure server infrastructure, to protect your data from unauthorized access or disclosure.
            </p>
          </section>

          <div className="pt-12 border-t border-slate-800">
             <p className="text-center text-slate-400 text-base font-medium">
                For questions regarding your privacy, please email our data protection officer at <br />
                <span className="text-emerald-400 font-bold">privacy@jobsphere.com.np</span>
             </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
