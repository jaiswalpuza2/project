import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bookmark, Star, Trash2, MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

const SavedJobs = () => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/saved-jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/saved-jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedJobs(savedJobs.filter(sj => sj._id !== id));
      toast.success("Job removed from bookmarks");
    } catch (err) {
      toast.error("Failed to remove bookmark");
    }
  };

  return (
    <div className="space-y-10">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-block p-6 bg-indigo-500/10 text-indigo-400 rounded-[2rem] mb-6 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
          <Bookmark size={40} />
        </div>
        <h1 className="text-4xl font-black text-[#E2E8F0] tracking-tight mb-3">Saved Opportunities</h1>
        <p className="text-slate-400 font-medium italic">Manage all the positions you've bookmarked for later application.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        ) : savedJobs.length > 0 ? (
          savedJobs.map((item) => (
            <div key={item._id} className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-6 rounded-[2.5rem] border border-slate-600/50 group flex justify-between items-center transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:border-indigo-500/30">
              <div className="flex gap-8 items-center">
                <div className="h-20 w-20 bg-[#0F172A] rounded-2xl flex items-center justify-center text-indigo-400 font-black text-2xl overflow-hidden border border-white/5 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {item.job.employer?.companyLogo ? (
                    <img src={item.job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                  ) : item.job.title[0]}
                </div>
                <div>
                  <Link to={`/jobs/${item.job._id}`}>
                    <h3 className="text-2xl font-black text-[#E2E8F0] group-hover:text-indigo-400 transition tracking-tight mb-2">{item.job.title}</h3>
                  </Link>
                  <div className="flex flex-wrap gap-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-slate-500" /> {item.job.employer?.name}</span>
                    <span className="flex items-center gap-2"><Clock size={16} className="text-slate-500" /> {item.job.category}</span>
                    <span className="flex items-center gap-2 text-emerald-400 font-black tracking-tight normal-case text-base">NRP {(item.job.budget * 133).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link to={`/jobs/${item.job._id}`} className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition shadow-xl shadow-indigo-500/20 active:scale-95">
                  Apply Now
                </Link>
                <button 
                  onClick={() => unsaveJob(item._id)}
                  className="p-4 bg-[#0F172A] text-red-400 hover:bg-red-500/10 rounded-2xl transition border border-white/5 active:scale-95 shadow-lg"
                  title="Remove Bookmark"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-[#1E293B] shadow-lg shadow-black/20 rounded-3xl border border-slate-600 shadow-sm">
            <Star size={64} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-200">No saved jobs yet</h3>
            <p className="text-slate-400 mt-2">Explore the job board and bookmark positions that match your skills.</p>
            <Link to="/jobs" className="inline-block mt-6 text-indigo-400 font-bold hover:underline">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
