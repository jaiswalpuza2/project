import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Sparkles,
  RefreshCw,
  FileText,
  Target,
  MessageCircle,
  Zap,
  CheckCircle,
  Cpu
} from "lucide-react";
import { formatNPR } from "../utils/currency";
const FreelancerDashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const aiTools = [
    {
      id: 1,
      name: "AI Resume Generator",
      description: "Create professional resumes tailored to specific job descriptions in minutes.",
      feature: "Fast & Customizable",
      icon: <FileText size={22} />,
      color: "blue",
      path: "/resume-generator"
    },
    {
      id: 3,
      name: "AI Job Recommendation",
      description: "Get personalized job matches based on your skills, experience, and preferences.",
      feature: "Smart Matching",
      icon: <Target size={22} />,
      color: "emerald",
      path: "/jobs"
    },
    {
      id: 4,
      name: "AI Chatbot Assistant",
      description: "24/7 assistance for job search, application help, and career advice.",
      feature: "Always Available",
      icon: <MessageCircle size={22} />,
      color: "orange",
      path: "/ai-chatbot"
    }
  ];
  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/jobs/recommendations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [token]);
  return (
    <div className="space-y-6 md:space-y-10">
      {activeTab === 'dashboard' && (
          <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                {[
                  { label: "Active Applications", value: "12", color: "blue" },
                  { label: "Recommended Jobs", value: "24", color: "green" },
                  { label: "Profile Views", value: "158", color: "purple" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-5 md:p-8 rounded-2xl border border-slate-600/50 hover:border-indigo-500/30 transition-all duration-300">
                    <p className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-2xl md:text-4xl font-black mt-2 md:mt-3 text-[#E2E8F0] tracking-tight">{stat.value}</h3>
                  </div>
                ))}
              </div>
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="p-2.5 md:p-3 bg-indigo-500/10 rounded-xl md:rounded-2xl border border-indigo-500/20 text-indigo-400">
                  <Cpu size={24} className="md:w-7 md:h-7" />
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-200 uppercase tracking-tight">AI Tools Suite</h3>
                  <p className="text-xs md:text-base text-slate-400 font-bold mt-0.5 md:mt-1">Enhance your career with intelligent AI</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiTools.map((tool) => {
                  const colorMap = {
                    blue: {
                      bg: "bg-blue-600 hover:bg-blue-500",
                      shadow: "shadow-blue-500/20",
                      iconBg: "bg-blue-500/10",
                      iconBorder: "border-blue-500/20",
                      iconColor: "text-blue-400",
                    },
                    emerald: {
                      bg: "bg-emerald-600 hover:bg-emerald-500",
                      shadow: "shadow-emerald-500/20",
                      iconBg: "bg-emerald-500/10",
                      iconBorder: "border-emerald-500/20",
                      iconColor: "text-emerald-400",
                    },
                    orange: {
                      bg: "bg-orange-600 hover:bg-orange-500",
                      shadow: "shadow-orange-500/20",
                      iconBg: "bg-orange-500/10",
                      iconBorder: "border-orange-500/20",
                      iconColor: "text-orange-400",
                    }
                  };
                  const colors = colorMap[tool.color];
                  return (
                    <div key={tool.id} className="bg-[#1E293B] border border-slate-600/50 rounded-2xl md:rounded-[2rem] p-5 md:p-6 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col sm:flex-row items-center gap-5 md:gap-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${colors.iconBg} border ${colors.iconBorder} flex items-center justify-center shrink-0 ${colors.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1 text-center sm:text-left min-w-0">
                        <h4 className="text-lg md:text-xl font-black text-slate-200 mb-1">{tool.name}</h4>
                        <p className="text-slate-400 text-xs md:text-sm font-medium mb-3 line-clamp-2">{tool.description}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <Zap size={12} className={colors.iconColor} />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{tool.feature}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(tool.path)}
                        className={`w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 ${colors.bg} text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-lg ${colors.shadow} active:scale-95 whitespace-nowrap`}
                      >
                        Use Tool
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-800/20 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 mx-1 md:mx-0">
                <h3 className="text-lg md:text-2xl font-black text-slate-200">AI Job Matches</h3>
                <button onClick={() => setActiveTab('matches')} className="text-cyan-400 font-extrabold hover:text-cyan-300 transition-colors uppercase tracking-widest text-xs md:text-sm underline-offset-8 decoration-2 decoration-indigo-500/50">View All</button>
              </div>
              <div className="grid gap-4">
                {loading ? (
                  <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-indigo-500" /></div>
                ) : recommendations.length > 0 ? (
                  recommendations.slice(0, 3).map((job, idx) => (
                    <Link to={`/jobs/${job._id}`} key={idx} className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-5 md:p-6 rounded-2xl border border-slate-600/50 hover:border-indigo-400/50 transition-all duration-300 group hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.15)] mx-1 md:mx-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h4 className="text-lg md:text-xl font-black text-[#E2E8F0] group-hover:text-white transition tracking-tight truncate">{job.title}</h4>
                          <div className="flex flex-wrap gap-3 md:gap-6 mt-3 text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><User size={16} className="text-indigo-400 shrink-0" /> <span className="truncate max-w-[80px] md:max-w-none">{job.employer?.name}</span></span>
                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-cyan-400 shrink-0" /> {job.category}</span>
                            <span className="flex items-center gap-1.5 text-emerald-400 font-black">{formatNPR(job.budget)}</span>
                          </div>
                        </div>
                        <div className="p-2 md:p-3 bg-[#0F172A] rounded-xl border border-white/5 text-slate-500 group-hover:text-indigo-400 transition-colors shadow-inner shrink-0">
                          <Sparkles size={18} className="md:w-5 md:h-5" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-10 bg-[#1E293B] shadow-lg shadow-black/20 rounded-2xl border border-slate-600 text-center text-slate-400">
                    Update your skills to get AI matches!
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-slate-200 flex items-center gap-4">
              <Sparkles className="text-indigo-400" size={32} /> AI Matches (Beta)
            </h3>
            <p className="text-slate-400">Jobs matched to your profile using our AI recommendation engine.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loading ? (
                  <div className="col-span-3 flex justify-center p-20"><RefreshCw className="animate-spin text-indigo-400" /></div>
                ) : recommendations.length > 0 ? (
                  recommendations.map((job, idx) => (
                    <Link to={`/jobs/${job._id}`} key={idx} className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-600/50 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] hover:border-indigo-400/50 transition-all duration-500 flex flex-col gap-4 md:gap-6 group hover:-translate-y-2">
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 md:h-16 md:w-16 bg-[#0F172A] border border-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-500">
                          <Briefcase size={22} className="md:w-7 md:h-7" />
                        </div>
                        <span className="bg-indigo-500/10 text-cyan-400 text-[10px] md:text-xs font-black px-4 md:px-5 py-1.5 md:py-2 rounded-full uppercase tracking-widest border border-indigo-500/20 shadow-sm">AI Match</span>
                      </div>
                      <div>
                        <h4 className="font-black text-xl md:text-3xl text-[#E2E8F0] group-hover:text-white transition tracking-tight leading-tight line-clamp-2 min-h-[3rem] md:min-h-0">{job.title}</h4>
                        <p className="text-indigo-400 font-black text-lg md:text-xl mt-2 md:mt-3">{formatNPR(job.budget)}</p>
                      </div>
                      <p className="text-sm md:text-base text-slate-400 font-black leading-relaxed line-clamp-3">{job.description}</p>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-20 bg-[#1E293B] shadow-lg shadow-black/20 rounded-3xl border border-dashed border-slate-600">
                    <p className="text-slate-400">Update your profile to get more AI matches.</p>
                  </div>
                )}
            </div>
          </div>
        )}
    </div>
  );
};
export default FreelancerDashboard;
