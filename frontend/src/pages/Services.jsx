import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, ShieldCheck, Zap, Users, BarChart3, Settings, Sparkles, ChevronRight, Mail } from "lucide-react";
import Footer from "../components/Footer";

const Services = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleContactSales = () => {
    if (isAuthenticated) {

      navigate("/messages");
    } else {
      navigate("/register");
    }
  };

  const services = [
    {
      title: "Premium Recruitment",
      desc: "End-to-end recruitment services for companies looking to hire top 1% talent in Nepal. We handle vetting and technical assessments.",
      icon: <Users size={40} className="text-indigo-400" />,
      color: "indigo"
    },
    {
      title: "HR Tooling",
      desc: "Custom HR software solutions for managing freelance workflows, payments, and contract automation.",
      icon: <BarChart3 size={40} className="text-emerald-400" />,
      color: "emerald"
    },
    {
      title: "Talent Vetting",
      desc: "Technical background checks and specialized skill verification for your high-stakes projects.",
      icon: <ShieldCheck size={40} className="text-cyan-400" />,
      color: "cyan"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col pt-24">
      <div className="flex-1 max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-8 bg-indigo-500/10 px-8 py-3 rounded-full border border-indigo-500/20">
            <Sparkles size={20} className="text-indigo-400" />
            <span className="text-indigo-400 font-black uppercase tracking-widest text-sm">Enterprise Tier</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-10 max-w-4xl mx-auto leading-[0.9]">
            Scale Your Business with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">
              Elite Managed Services
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-bold max-w-4xl mx-auto leading-relaxed">
            Beyond the marketplace, JobSphere offers specialized tools and dedicated talent curation designed to help the top 1% of employers optimize their global workforce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {services.map((service, i) => (
            <div key={i} className="p-10 bg-slate-900 shadow-2xl rounded-[3rem] border border-slate-800/50 hover:border-indigo-500/30 transition-all group flex flex-col">
              <div className={`h-16 w-16 bg-${service.color}-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">{service.title}</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-medium mb-8 flex-1">
                {service.desc}
              </p>
              <button 
                onClick={handleContactSales}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition group mt-auto"
              >
                Learn More <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[4rem] p-12 md:p-20 border border-slate-800 shadow-2xl text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Briefcase size={200} />
          </div>
          <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tight relative z-10">Custom Enterprise Solutions</h2>
          <p className="text-slate-300 text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed relative z-10">
            Need a tailored solution for your company? Our advisory team works with large-scale employers to build custom recruitment pipelines and HR infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <button 
              onClick={handleContactSales}
              className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-base uppercase tracking-widest transition shadow-2xl shadow-indigo-500/40 active:scale-95 flex items-center gap-3"
            >
              <Sparkles size={20} /> Contact Sales Team
            </button>
            <a 
              href="mailto:sales@jobsphere.com" 
              className="px-12 py-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-black text-base uppercase tracking-widest transition border border-slate-700 active:scale-95 flex items-center gap-3"
            >
              <Mail size={20} /> Email Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
