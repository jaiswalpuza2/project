import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  ChevronRight
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800/50 pt-16 pb-12 px-8 no-print mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles size={22} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white uppercase">JobSphere</h2>
          </div>
          <p className="text-lg leading-relaxed font-medium text-slate-300">
            Empowering the next generation of professionals in Nepal. JobSphere is a premium freelancing platform connecting top talent with visionary employers to build the future of work.
          </p>
          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 text-base font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition group"
          >
            Read more <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-black uppercase tracking-[0.2em] text-base pb-3 border-b border-slate-800 w-fit">For Job Seeker</h3>
          <ul className="space-y-4">
            {[
              { label: "Search Jobs", to: "/jobs" },
              { label: "Blog", to: "/blog" },
              { label: "FAQ", to: "/faq" }
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-lg font-bold hover:text-white hover:translate-x-1 transition-all inline-block text-slate-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-black uppercase tracking-[0.2em] text-base pb-3 border-b border-slate-800 w-fit">For Employer</h3>
          <ul className="space-y-4">
            {[
              { label: "Post a Job", to: "/post-job" },
              { label: "Payments", to: "/payments" },
              { label: "Recruitment Services", to: "/services" },
              { label: "HR Tools", to: "/tools" },
              { label: "FAQ", to: "/employer-faq" }
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-lg font-bold hover:text-white hover:translate-x-1 transition-all inline-block text-slate-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-white font-black uppercase tracking-[0.2em] text-base pb-3 border-b border-slate-800 w-fit">Contact Us</h3>
           <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg text-indigo-400 shadow-inner">
                <MapPin size={22} />
              </div>
              <span className="text-base font-black">Itahari, Nepal</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg text-emerald-400 shadow-inner">
                <Phone size={22} />
              </div>
              <span className="text-base font-black">9829370363</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg text-rose-400 shadow-inner">
                <Mail size={22} />
              </div>
              <span className="text-base font-black">jaiswalpuza@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/50 pt-8 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-8 order-2 md:order-1 font-black text-sm uppercase tracking-widest text-slate-400">
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
            <span className="text-slate-800">|</span>
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>

          <div className="order-1 md:order-2">
             <p className="text-base font-black uppercase tracking-widest text-slate-500">
               © 2026 JobSphere. All Rights Reserved
             </p>
          </div>

          <div className="flex items-center gap-4 order-3">
            {[
              { icon: <Facebook size={18} />, to: "#" },
              { icon: <Twitter size={18} />, to: "#" },
              { icon: <Linkedin size={18} />, to: "#" }
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.to} 
                className="p-2.5 bg-slate-800/50 rounded-xl hover:bg-indigo-500 hover:text-white transition-all hover:-translate-y-1 shadow-lg"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
