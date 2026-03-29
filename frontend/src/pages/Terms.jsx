import React from "react";
import Footer from "../components/Footer";
import { Shield, FileText, Scale } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col pt-24">
      <div className="flex-1 max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 bg-slate-500/10 px-6 py-2 rounded-full border border-slate-500/20">
            <Scale size={18} className="text-slate-400" />
            <span className="text-slate-300 font-black uppercase tracking-widest text-sm">Legal Framework</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
            Terms of <span className="text-indigo-500">Service</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium">Last Updated: March 24, 2026</p>
        </div>

        <div className="bg-slate-900/50 rounded-[3rem] p-10 md:p-16 border border-slate-800 shadow-2xl space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <FileText size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">1. Acceptance of Terms</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              By accessing or using the JobSphere platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <Shield size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">2. User Accounts</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              You are responsible for maintaining the confidentiality of your account credentials. Any activity conducted through your account is your responsibility. JobSphere reserves the right to suspend accounts that violate our community guidelines.
            </p>
          </section>

          <section>
             <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400">
                <Scale size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">3. Payments & Fees</h2>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium text-lg">
              JobSphere facilitates payments between employers and freelancers. We charge a service fee for every successful transaction. Users are prohibited from circumventing the platform's payment system to avoid fees.
            </p>
          </section>

          <div className="pt-12 border-t border-slate-800">
             <p className="text-center text-slate-400 text-base font-medium">
                For the full detailed legal document, please contact our legal department at <br />
                <span className="text-indigo-400 font-bold">legal@jobsphere.com.np</span>
             </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
