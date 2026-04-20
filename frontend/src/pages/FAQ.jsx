import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, User, Briefcase, Sparkles } from "lucide-react";
import Footer from "../components/Footer";

const FAQ = () => {
  const [activeTab, setActiveTab] = useState("seeker");
  const [openIndex, setOpenIndex] = useState(null);

  const seekerFaqs = [
    {
      q: "How do I create a profile on JobSphere?",
      a: "Simply click on the 'Register' button, choose 'Freelancer' as your role, and complete the profile wizard. Make sure to highlight your best skills and experience."
    },
    {
      q: "Is JobSphere free for freelancers?",
      a: "Yes, it is free to search and apply for jobs. We only charge a small platform fee when you successfully complete a payment-verified project."
    },
    {
      q: "How do I get paid?",
      a: "Payments are processed through our secure internal system. Once an employer approves your submission, funds are released to your JobSphere wallet, which you can then withdraw."
    }
  ];

  const employerFaqs = [
    {
      q: "How do I post a job?",
      a: "After logging in as an Employer, go to your dashboard and click 'Post a Job'. Fill in the details, budget, and required skills to attract the best talent."
    },
    {
      q: "How can I trust the freelancers on the platform?",
      a: "We have a robust review system and verify top-tier freelancers. You can check their past ratings, portfolio, and JobSphere verification badge."
    },
    {
      q: "What payment methods do you support?",
      a: "We support major digital wallets (e.g., eSewa) and direct bank transfers for secure transactions within Nepal."
    }
  ];

  const currentFaqs = activeTab === "seeker" ? seekerFaqs : employerFaqs;

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col pt-24">
      <div className="flex-1 max-w-4xl mx-auto px-8 py-16 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 bg-cyan-500/10 px-6 py-2 rounded-full border border-cyan-500/20">
            <HelpCircle size={18} className="text-cyan-400" />
            <span className="text-cyan-400 font-black uppercase tracking-widest text-sm">Help Center</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Common <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">Questions</span>
          </h1>
          <p className="text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about navigating JobSphere.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("seeker")}
            className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 border ${activeTab === "seeker" ? "bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20" : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"}`}
          >
            <User size={18} /> For Job Seekers
          </button>
          <button 
            onClick={() => setActiveTab("employer")}
            className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3 border ${activeTab === "employer" ? "bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20" : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"}`}
          >
            <Briefcase size={18} /> For Employers
          </button>
        </div>

        <div className="space-y-4 mb-20">
          {currentFaqs.map((faq, i) => (
            <div key={i} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden transition-all hover:border-slate-700">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-bold text-slate-200 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-slate-500" />}
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-slate-300 font-medium leading-relaxed text-lg">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
            <Sparkles size={160} />
          </div>
          <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Still have questions?</h3>
          <p className="text-slate-300 mb-8 font-medium text-lg">Our support team is always here to help you via email or social media.</p>
          <a href="mailto:jaiswalpuza@gmail.com" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-xl">
             Contact Support
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
