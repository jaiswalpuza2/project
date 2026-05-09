import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { User, Mail, MapPin, Briefcase, ExternalLink, Award, Sparkles, ChevronLeft } from "lucide-react";
import Footer from "../components/Footer";

const FreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/auth/profile/${id}`);
      setProfile(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartProject = () => {

    navigate("/messages", { state: { initialContact: profile } });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0F172A] p-8 text-center transition-colors duration-300">
      <h2 className="text-3xl font-black text-slate-900 dark:text-slate-200 mb-4">Profile Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">The freelancer you are looking for does not exist or has been removed.</p>
      <Link to="/employer-dashboard" className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-3 rounded-2xl font-bold transition hover:brightness-110 shadow-lg shadow-indigo-500/20">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] p-4 md:p-8 lg:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <Link to="/employer-dashboard" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold mb-8 group transition">
          <ChevronLeft className="group-hover:-translate-x-1 transition" /> Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl md:rounded-[3rem] p-6 md:p-12 border border-slate-100 dark:border-slate-600/50 mb-10 relative overflow-hidden group transition-colors">


          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-slate-100 to-white dark:from-[#0F172A] dark:to-[#1E293B] rounded-[2rem] flex items-center justify-center text-slate-900 dark:text-[#E2E8F0] text-3xl md:text-5xl font-black shadow-2xl border-4 border-slate-100 dark:border-slate-700/50 overflow-hidden relative group/img transition-colors">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-600/20 opacity-0 group-hover/img:opacity-100 transition-opacity" />
              {profile.profileImage && profile.profileImage !== 'no-photo.jpg' ? (
                <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
              ) : profile.name[0]}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight drop-shadow-sm transition-colors">{profile.name}</h1>
                <span className="inline-flex px-5 py-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/20 self-center shadow-lg shadow-indigo-500/10">
                  Verified Talent
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-8 text-slate-500 dark:text-slate-400 font-bold mb-10 text-lg transition-colors">
                <p className="flex items-center gap-3"><Mail size={22} className="text-cyan-600 dark:text-cyan-400" /> {profile.email}</p>
                {profile.location && <p className="flex items-center gap-3"><MapPin size={22} className="text-red-600 dark:text-red-400" /> {profile.location}</p>}
                <p className="flex items-center gap-3"><Briefcase size={22} className="text-emerald-600 dark:text-emerald-400" /> {profile.role}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button 
                  onClick={handleStartProject}
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-black transition hover:brightness-110 active:scale-95 shadow-xl shadow-indigo-500/20"
                >
                  Contact Freelancer
                </button>
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-8 py-4 rounded-2xl font-black transition hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 flex items-center gap-2">
                    View Resume <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-600/50 transition-colors">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-8 flex items-center gap-4 transition-colors">
                <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                   <User size={20} />
                </div>
                Professional Bio
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-black text-lg italic border-l-4 border-indigo-500/30 pl-8 py-2 transition-colors">
                {profile.bio || "This freelancer hasn't added a bio yet, but they're ready to tackle your project with expertise and dedication."}
              </p>
            </section>

            <section className="bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-600/50 transition-colors">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-8 flex items-center gap-4 transition-colors">
                <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                   <Briefcase size={20} />
                </div>
                Top Expertise
              </h3>
              <div className="flex flex-wrap gap-4">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span key={skill} className="px-6 py-3 bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-[#E2E8F0] rounded-2xl font-black text-sm uppercase tracking-widest border border-slate-200 dark:border-slate-600/50 hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-inner">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 italic font-medium">No skills listed yet.</p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-600/50 relative overflow-hidden group transition-colors">
              <div className="absolute -top-4 -right-4 bg-indigo-600/10 h-32 w-32 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors"></div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-8 flex items-center gap-4 relative z-10 transition-colors">
                <div className="h-10 w-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                   <Award size={20} />
                </div>
                Portfolio Highlights
              </h3>

              <div className="space-y-8 relative z-10">
                {profile.portfolio && profile.portfolio.length > 0 ? (
                  profile.portfolio.map((item, idx) => (
                    <div key={idx} className="group/item border-l-2 border-slate-200 dark:border-slate-700/50 pl-6 hover:border-indigo-500/50 transition-colors">
                      <h4 className="font-bold text-slate-800 dark:text-[#E2E8F0] mb-2 group-hover/item:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed transition-colors">{item.description}</p>
                      {item.link && (
                        <a href={item.link} className="text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                          View Case Study <ChevronLeft size={14} className="rotate-180" />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-slate-500 italic font-medium">No portfolio items added yet.</p>
                  </div>
                )}
              </div>
            </section>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-indigo-500/20 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={32} />
              </div>
              <h4 className="text-xl font-black mb-4 tracking-tight">Hire {profile.name.split(' ')[0]}</h4>
              <p className="text-indigo-100 text-sm font-medium mb-8">Ready to bring top-tier skills to your project? Hire them today through JobSphere Escrow.</p>
              <button 
                onClick={handleStartProject}
                className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black shadow-lg shadow-black/10 hover:bg-slate-50 transition active:scale-95"
              >
                Start Project
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FreelancerProfile;
