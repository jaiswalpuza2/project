import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, MapPin, Briefcase, ExternalLink, Award, Sparkles, ChevronLeft } from "lucide-react";

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
      const res = await axios.get(`http://localhost:5000/api/auth/profile/${id}`);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <h2 className="text-3xl font-black text-gray-900 mb-4">Profile Not Found</h2>
      <p className="text-gray-500 mb-8 font-medium">The freelancer you are looking for does not exist or has been removed.</p>
      <Link to="/employer-dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold transition hover:bg-gray-900 shadow-lg shadow-blue-100">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <Link to="/employer-dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 group transition">
          <ChevronLeft className="group-hover:-translate-x-1 transition" /> Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
            <Sparkles size={200} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="h-32 w-32 md:h-40 md:w-40 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-2xl shadow-blue-200 border-4 border-white overflow-hidden">
              {profile.profileImage && profile.profileImage !== 'no-photo.jpg' ? (
                <img src={profile.profileImage} alt={profile.name} className="h-full w-full object-cover" />
              ) : profile.name[0]}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{profile.name}</h1>
                <span className="inline-flex px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 self-center">
                  Verified Talent
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-bold mb-8">
                <p className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> {profile.email}</p>
                {profile.location && <p className="flex items-center gap-2"><MapPin size={18} className="text-red-500" /> {profile.location}</p>}
                <p className="flex items-center gap-2"><Briefcase size={18} className="text-emerald-500" /> {profile.role}</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <a href={`mailto:${profile.email}`} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black transition hover:scale-105 active:scale-95 shadow-xl">
                  Contact Freelancer
                </a>
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-black transition hover:border-blue-200 hover:text-blue-600 active:scale-95 flex items-center gap-2">
                    View Resume <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bio & Skills */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <User className="text-blue-600" /> Professional Bio
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium text-lg italic border-l-4 border-blue-100 pl-6">
                {profile.bio || "This freelancer hasn't added a bio yet, but they're ready to tackle your project with expertise and dedication."}
              </p>
            </section>

            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Briefcase className="text-emerald-600" /> Top Expertise
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span key={skill} className="px-6 py-3 bg-gray-50 text-gray-700 rounded-2xl font-black text-sm border border-gray-100 hover:border-blue-200 hover:text-blue-600 transition shadow-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No skills listed yet.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Experience/Portfolio Summary */}
          <div className="space-y-8">
            <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 bg-blue-600/20 h-32 w-32 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <Award className="text-blue-400" /> Portfolio Highlights
              </h3>
              
              <div className="space-y-6 relative z-10">
                {profile.portfolio && profile.portfolio.length > 0 ? (
                  profile.portfolio.map((item, idx) => (
                    <div key={idx} className="group/item">
                      <h4 className="font-bold text-white mb-2 group-hover/item:text-blue-400 transition">{item.title}</h4>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                      {item.link && (
                        <a href={item.link} className="text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                          View Project <ChevronLeft size={14} className="rotate-180" />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-slate-500 italic">No portfolio items added yet.</p>
                  </div>
                )}
              </div>
            </section>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-blue-100 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={32} />
              </div>
              <h4 className="text-xl font-black mb-4 tracking-tight">Hire {profile.name.split(' ')[0]}</h4>
              <p className="text-blue-100 text-sm font-medium mb-8">Ready to bring top-tier skills to your project? Hire them today through JobSphere Escrow.</p>
              <button 
                onClick={handleStartProject}
                className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black shadow-lg shadow-black/10 hover:bg-gray-50 transition active:scale-95"
              >
                Start Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
