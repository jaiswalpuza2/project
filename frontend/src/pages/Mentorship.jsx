import React, { useState, useEffect } from "react";
import { BookOpen, Target, Sparkles, Briefcase, RefreshCw, ArrowRight, User } from "lucide-react";
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
  const [activeGap, setActiveGap] = useState("");

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/recommend-mentorship",
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
        `http://localhost:5000/api/mentorships?skill=${encodeURIComponent(skill)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProviders(res.data.data);
      if (res.data.data.length > 0) {
        toast.info(`Found ${res.data.data.length} providers for ${skill}`);
        // Scroll to results
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
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm mb-4">
            <Sparkles size={16} /> Beta AI Feature
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Skill Growth & Mentorship
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our AI analyzes your profile, skills, and current market trends to recommend personalized mentorships and micro-internships to bridge your skill gaps.
          </p>
        </header>

        {/* Action Button */}
        {!hasGenerated && !loading && (
          <div className="flex justify-center mb-16">
            <button
              onClick={fetchRecommendations}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition duration-300 flex items-center gap-3"
            >
              <RefreshCw size={24} /> Generate My Growth Path
            </button>
          </div>
        )}

        {/* Loading State */}
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

        {/* Results */}
        {hasGenerated && !loading && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {recommendations.map((rec, i) => (
                <div key={i} className={`bg-white rounded-3xl p-8 shadow-sm border relative group overflow-hidden transition duration-300 flex flex-col ${activeGap === rec.skillGap ? 'border-blue-500 shadow-lg ring-1 ring-blue-500' : 'border-gray-100 hover:shadow-xl'}`}>
                  <div className="absolute top-0 right-0 p-6 text-gray-100 group-hover:text-blue-50 transition duration-500 z-0">
                    <Target size={120} />
                  </div>
                  
                  <div className="relative z-10 flex-1">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      <Target size={28} className="stroke-[2.5]" />
                    </div>
                    
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Identified Gap</h3>
                    <h2 className="text-2xl font-black text-gray-900 mb-8">{rec.skillGap}</h2>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-blue-600 font-bold">
                          <User size={18} /> Recommended Mentorship
                        </div>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed">{rec.mentorshipTopic}</p>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-2 text-purple-600 font-bold">
                          <Briefcase size={18} /> Micro-Internship Task
                        </div>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed">{rec.microInternshipTask}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 mt-8 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => fetchProviders(rec.skillGap)}
                      disabled={searchingProviders}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${activeGap === rec.skillGap ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
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

            {/* Provider List Section */}
            {activeGap && (
              <div id="provider-results" className="pt-12 border-t-2 border-dashed border-gray-200 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-12 w-1.5 bg-blue-600 rounded-full"></div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900">Providers for {activeGap}</h2>
                    <p className="text-gray-500 font-medium">Matching mentorships and micro-internships from our verified network</p>
                  </div>
                </div>

                {searchingProviders ? (
                  <div className="flex justify-center py-20">
                    <RefreshCw size={48} className="text-blue-600 animate-spin" />
                  </div>
                ) : providers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {providers.map((p) => (
                      <div key={p._id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition flex flex-col lg:flex-row gap-8 items-center lg:items-start text-center lg:text-left">
                        <div className="h-24 w-24 min-w-[6rem] bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                          <BookOpen size={40} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-100">
                              {p.category}
                            </span>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
                              {p.duration}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 mb-2">{p.title}</h3>
                          <p className="text-blue-600 font-bold mb-4">Provider: {p.providerName}</p>
                          <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                            {p.description}
                          </p>
                          <a 
                            href={p.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-50 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
                          >
                            Go to Provider <ArrowRight size={18} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
                    <Briefcase size={64} className="mx-auto text-gray-100 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900">No active providers for this specific gap</h3>
                    <p className="text-gray-400 mt-2 font-medium max-w-md mx-auto">
                      Our network is expanding. Try another skill gap or check back soon as new providers join every week.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center mt-8">
              <button
                onClick={fetchRecommendations}
                className="text-gray-500 font-bold flex items-center gap-2 hover:text-blue-600 transition"
              >
                <RefreshCw size={16} /> Recalculate based on updated profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentorship;
