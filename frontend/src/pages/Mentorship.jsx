import React, { useState, useEffect } from "react";
import { BookOpen, Target, Sparkles, Briefcase, RefreshCw, ArrowRight, User, Star, Filter, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
const Mentorship = () => {
  const { token, user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [providers, setProviders] = useState([]);
  const [searchingProviders, setSearchingProviders] = useState(false);
  const navigate = useNavigate();
  const [activeGap, setActiveGap] = useState("");
  const [sortBy, setSortBy] = useState("match"); // match, rating, experience
  const [mentors, setMentors] = useState([]);
  const [fetchingMentors, setFetchingMentors] = useState(false);
  useEffect(() => {
    fetchRealMentors();
  }, []);
  const fetchRealMentors = async () => {
    setFetchingMentors(true);
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/auth/mentors");
      if (res.data.success && res.data.data.length > 0) {
        const fetchedMentors = res.data.data.map((m, index) => {
          const userSkills = user?.skills || [];
          const mentorSkills = m.skills || [];
          const commonSkills = mentorSkills.filter(s => userSkills.includes(s));
          const matchScore = Math.min(99, 85 + (commonSkills.length * 5));
          return {
            id: m._id,
            name: m.name,
            role: m.role || "Expert",
            company: m.location || "JobSphere",
            rating: m.mentorRating || 5.0,
            experience: m.mentorExperience || 5,
            description: m.mentorBio || m.bio || "Available for professional guidance and career mentorship.",
            skills: m.skills || [],
            matchScore: matchScore,
            initials: m.name.split(" ").map(n => n[0]).join("").toUpperCase(),
            gradient: index % 4 === 0 ? "from-emerald-400 to-cyan-500" : 
                      index % 4 === 1 ? "from-blue-500 to-indigo-600" :
                      index % 4 === 2 ? "from-violet-500 to-purple-600" :
                      "from-pink-500 to-rose-600"
          };
        });
        setMentors(fetchedMentors);
      } else {
        setMentors(mentorsData);
      }
    } catch (err) {
      console.error("Failed to fetch mentors", err);
      setMentors(mentorsData);
    } finally {
      setFetchingMentors(false);
    }
  };
  const mentorsData = [
    {
      id: 1,
      name: "Sarah Rodriguez",
      role: "Senior Product Designer",
      company: "Google",
      rating: 4.9,
      experience: 12,
      description: "Specializing in user-centric design and building scalable design systems for global products.",
      skills: ["React.js", "UX Research", "Figma"],
      matchScore: 98,
      initials: "SR",
      gradient: "from-emerald-400 to-cyan-500"
    },
    {
      id: 2,
      name: "Amit Kumar",
      role: "Full Stack Architect",
      company: "Netflix",
      rating: 4.8,
      experience: 15,
      description: "Expert in high-scale distributed systems and performance optimization for React applications.",
      skills: ["Node.js", "System Design", "Kubernetes"],
      matchScore: 95,
      initials: "AK",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 3,
      name: "Mia Johnson",
      role: "AI Lead",
      company: "OpenAI",
      rating: 4.7,
      experience: 8,
      description: "Focused on responsible AI development and large language model safety for enterprise applications.",
      skills: ["Python", "TensorFlow", "Generative AI"],
      matchScore: 92,
      initials: "MJ",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      id: 4,
      name: "David Chen",
      role: "Cybersecurity Expert",
      company: "Microsoft",
      rating: 4.6,
      experience: 10,
      description: "Deep expertise in threat modeling, cloud security, and zero-trust architecture.",
      skills: ["Security Hub", "Azure", "Penetration Testing"],
      matchScore: 89,
      initials: "DC",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      id: 5,
      name: "Elena Rossi",
      role: "Frontend Specialist",
      company: "Vercel",
      rating: 4.9,
      experience: 7,
      description: "Dedicated to crafting beautiful, performant user experiences with Next.js and Tailwind CSS.",
      skills: ["Next.js", "Tailwind CSS", "Framermotion"],
      matchScore: 96,
      initials: "ER",
      gradient: "from-amber-400 to-orange-500"
    },
    {
      id: 6,
      name: "Marcus Thorne",
      role: "DevOps Engineer",
      company: "AWS",
      rating: 4.5,
      experience: 14,
      description: "Helping organizations automate their infrastructure and achieve continuous delivery at scale.",
      skills: ["Terraform", "Docker", "CI/CD"],
      matchScore: 88,
      initials: "MT",
      gradient: "from-teal-400 to-emerald-600"
    }
  ];
  const learningRecs = [
    {
      id: 1,
      title: "Advanced Figma Masterclass",
      description: "Learn advanced Figma techniques, auto-layout, components, and prototyping.",
      progress: 60,
      color: "blue",
      icon: <Sparkles className="text-blue-400" size={24} />
    },
    {
      id: 2,
      title: "React.js for Designers",
      description: "Understand React fundamentals to collaborate better with developers.",
      progress: 75,
      color: "emerald",
      icon: <Target className="text-emerald-400" size={24} />
    },
    {
      id: 3,
      title: "Backend Development with Node.js",
      description: "Learn APIs, authentication, and server-side development.",
      progress: 50,
      color: "indigo",
      icon: <BookOpen className="text-indigo-400" size={24} />
    }
  ];
  const sortedMentors = [...mentors].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "experience") return b.experience - a.experience;
    return b.matchScore - a.matchScore;
  });
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/api/ai/recommend-mentorship",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecommendations(res.data.data);
      setHasGenerated(true);
      setProviders([]); // Reset providers when new path is generated
      setActiveGap("");
      toast.success("AI analyzed your profile and generated tailored recommendations!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate recommendations");
    } finally {
      setLoading(false);
    }
  };
  const fetchProviders = async (skill) => {
    setSearchingProviders(true);
    setActiveGap(skill);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/mentorships?skill=${encodeURIComponent(skill)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProviders(res.data.data);
      if (res.data.data.length > 0) {
        toast.info(`Found ${res.data.data.length} providers for ${skill}`);
        setTimeout(() => {
          document.getElementById("provider-results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        toast.warn("No specific providers found in our database yet.");
      }
    } catch (err) {
      toast.error("Failed to fetch providers");
    } finally {
      setSearchingProviders(false);
    }
  };
  return (
    <div className="space-y-10">
      <div className="max-w-6xl mx-auto w-full">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full font-bold text-sm border border-indigo-500/30 mb-4">
            <Sparkles size={16} /> Beta AI Feature
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-200 tracking-tight mb-4">
            Skill Growth & Mentorship
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our AI analyzes your profile, skills, and current market trends to recommend personalized mentorships and micro-internships to bridge your skill gaps.
          </p>
        </header>
        {!hasGenerated && !loading && (
          <div className="flex justify-center mb-16">
            <button
              onClick={fetchRecommendations}
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:brightness-110 hover:-translate-y-1 transition duration-300 flex items-center gap-3 shadow-indigo-500/20"
            >
              <RefreshCw size={24} /> Generate My Growth Path
            </button>
          </div>
        )}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center animate-pulse">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl mb-6"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-8"></div>
                <div className="w-full h-16 bg-gray-50 rounded-xl mb-4"></div>
                <div className="w-full h-16 bg-gray-50 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}
        {hasGenerated && !loading && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {recommendations.map((rec, i) => (
                <div key={i} className={`bg-[#1E293B] shadow-lg shadow-black/20 rounded-3xl p-8 shadow-sm border relative group overflow-hidden transition duration-300 flex flex-col ${activeGap === rec.skillGap ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-600 hover:shadow-xl'}`}>
                  <div className="absolute top-0 right-0 p-6 text-slate-700 group-hover:text-indigo-500/10 transition duration-500 z-0">
                    <Target size={120} />
                  </div>
                  <div className="relative z-10 flex-1">
                    <div className="w-14 h-14 bg-[#0F172A] border border-slate-600 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      <Target size={28} className="stroke-[2.5]" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Identified Gap</h3>
                    <h2 className="text-2xl font-black text-slate-200 mb-8">{rec.skillGap}</h2>
                    <div className="space-y-6">
                      <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-600">
                        <div className="flex items-center gap-3 mb-2 text-indigo-400 font-bold">
                          <User size={18} /> Recommended Mentorship
                        </div>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed">{rec.mentorshipTopic}</p>
                      </div>
                      <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-600">
                        <div className="flex items-center gap-3 mb-2 text-violet-400 font-bold">
                          <Briefcase size={18} /> Micro-Internship Task
                        </div>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed">{rec.microInternshipTask}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 mt-8 pt-6 border-t border-slate-600">
                    <button 
                      onClick={() => fetchProviders(rec.skillGap)}
                      disabled={searchingProviders}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${activeGap === rec.skillGap ? 'bg-indigo-600 text-white' : 'bg-[#0F172A] text-slate-300 hover:bg-[#1E293B]'}`}
                    >
                      {searchingProviders && activeGap === rec.skillGap ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <>Find Provider <ArrowRight size={18} /></>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {activeGap && (
              <div id="provider-results" className="pt-12 border-t-2 border-dashed border-slate-600 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-12 w-1.5 bg-indigo-500 rounded-full"></div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-200">Providers for {activeGap}</h2>
                    <p className="text-slate-400 font-medium">Matching mentorships and micro-internships from our verified network</p>
                  </div>
                </div>
                {searchingProviders ? (
                  <div className="flex justify-center py-20">
                    <RefreshCw size={48} className="text-indigo-500 animate-spin" />
                  </div>
                ) : providers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {providers.map((p) => (
                      <div key={p._id} className="bg-[#1E293B] shadow-lg shadow-black/20 p-8 rounded-3xl border border-slate-600 shadow-sm hover:shadow-xl transition flex flex-col lg:flex-row gap-8 items-center lg:items-start text-center lg:text-left">
                        <div className="h-24 w-24 min-w-[6rem] bg-[#0F172A] border border-slate-600 text-indigo-400 rounded-3xl flex items-center justify-center">
                          <BookOpen size={40} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                              {p.category}
                            </span>
                            <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-500/30">
                              {p.duration}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-200 mb-2">{p.title}</h3>
                          <p className="text-indigo-400 font-bold mb-4">Provider: {p.providerName}</p>
                          <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                            {p.description}
                          </p>
                          <a 
                            href={p.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#0F172A] border border-slate-600 text-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition"
                          >
                            Go to Provider <ArrowRight size={18} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1E293B] shadow-lg shadow-black/20 p-20 rounded-[3rem] border border-dashed border-slate-600 text-center">
                    <Briefcase size={64} className="mx-auto text-slate-600 mb-6" />
                    <h3 className="text-2xl font-bold text-slate-200">No active providers for this specific gap</h3>
                    <p className="text-slate-400 mt-2 font-medium max-w-md mx-auto">
                      Our network is expanding. Try another skill gap or check back soon as new providers join every week.
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="pt-20 border-t border-slate-600/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-full"></div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-black text-slate-200 uppercase tracking-tight">AI Recommended Mentors</h2>
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                        Personalized for You
                      </span>
                    </div>
                    <p className="text-slate-400 font-bold mt-1">Connect with industry leaders matched to your professional trajectory</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#1E293B] p-2 rounded-2xl border border-slate-600">
                  <button 
                    onClick={() => setSortBy("match")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sortBy === "match" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Best Match
                  </button>
                  <button 
                    onClick={() => setSortBy("rating")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sortBy === "rating" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Top Rated
                  </button>
                  <button 
                    onClick={() => setSortBy("experience")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sortBy === "experience" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Most Experienced
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedMentors.map((mentor) => (
                  <div key={mentor.id} className="bg-[#1E293B] border border-slate-600/50 rounded-[2.5rem] p-8 hover:border-indigo-500/50 transition-all duration-500 group relative flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${mentor.gradient} flex items-center justify-center text-white text-2xl font-black shadow-xl shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                        {mentor.initials}
                      </div>
                      <div className="bg-[#0F172A] border border-slate-600 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <TrendingUp size={16} className="text-emerald-400" />
                        <span className="text-base font-black text-slate-200">{mentor.matchScore}% <span className="text-slate-400 text-xs">Match</span></span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-slate-200 mb-1 group-hover:text-indigo-400 transition-colors">{mentor.name}</h3>
                      <p className="text-indigo-400 font-bold text-sm mb-4">{mentor.role} at {mentor.company}</p>
                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={16} fill={s <= Math.floor(mentor.rating) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-slate-200 font-black text-sm">{mentor.rating}</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest ml-2 border-l border-slate-700 pl-3">{mentor.experience}Yrs Exp</span>
                      </div>
                      <p className="text-slate-400 text-base font-medium leading-relaxed mb-6 line-clamp-3">
                        {mentor.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {mentor.skills.map((skill) => (
                          <span key={skill} className="bg-[#0F172A] border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate("/messages")}
                      className="w-full py-4 bg-[#0F172A] border border-slate-600 text-slate-200 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-slate-700 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      Connect <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-20 border-t border-slate-600/30">
              <div className="flex items-center gap-5 mb-10">
                <div className="h-14 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <div>
                  <h2 className="text-4xl font-black text-slate-200 uppercase tracking-tight">AI Learning Recommendations</h2>
                  <p className="text-slate-400 font-bold mt-1">Curated learning paths based on your current skill set and career goals</p>
                </div>
              </div>
              <div className="space-y-6">
                {learningRecs.map((course) => (
                  <div key={course.id} className="bg-[#1E293B] border border-slate-600/50 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col md:flex-row items-center gap-8 hover:shadow-xl hover:shadow-indigo-500/5">
                    <div className="w-16 h-16 rounded-2xl bg-[#0F172A] border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {course.icon}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-200 mb-1">{course.title}</h3>
                          <p className="text-slate-400 text-sm font-medium">{course.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-${course.color}-400 font-black text-lg tracking-widest`}>{course.progress}%</span>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-[#0F172A] rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full bg-gradient-to-r from-${course.color}-500 to-${course.color}-600 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className={`px-8 py-3 bg-${course.color}-600 hover:bg-${course.color}-500 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-${course.color}-500/20 active:scale-95`}>
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-12 bg-[#0F172A]/30 p-8 rounded-3xl border border-dashed border-slate-600/50">
              <button
                onClick={fetchRecommendations}
                className="text-slate-400 font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:text-indigo-400 transition duration-300"
              >
                <RefreshCw size={18} /> Recalculate based on updated profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Mentorship;
