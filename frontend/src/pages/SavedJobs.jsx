import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bookmark, Star, Trash2, MapPin, Briefcase, Clock, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/saved-jobs");
      setSavedJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const unsaveJob = async (id) => {
    try {
      await api.delete(`/saved-jobs/${id}`);
      setSavedJobs(savedJobs.filter(sj => sj._id !== id));
      toast.success("Job removed from bookmarks");
    } catch (err) {
      toast.error("Failed to remove bookmark");
    }
  };

  return (
    <div className="space-y-10 md:space-y-16 px-4 md:px-0">
      <header className="mb-10 md:mb-16 text-center max-w-2xl mx-auto transition-all">
        <h1 className="text-lg md:text-4xl font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight mb-4 md:mb-6 transition-colors">Saved Opportunities</h1>
        <p className="text-[15px] md:text-base text-slate-500 dark:text-slate-400 font-medium italic transition-colors px-4 leading-relaxed">Manage all the positions you've bookmarked for later application.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8 md:space-y-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        ) : savedJobs.length > 0 ? (
          savedJobs.map((item) => (
            <div key={item._id} className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-600/50 group flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-6 transition-all duration-500 hover:shadow-indigo-500/10 dark:hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:border-indigo-500/30 mx-2 md:mx-0">
              <div className="flex gap-4 md:gap-8 items-center w-full">
                <div className="h-14 w-14 md:h-20 md:w-20 bg-slate-50 dark:bg-[#0F172A] rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl md:text-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 transition-colors shrink-0">
                  {item.job.employer?.companyLogo ? (
                    <img src={item.job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                  ) : item.job.title[0]}
                </div>
                <div>
                  <Link to={`/jobs/${item.job._id}`} className="min-w-0 flex-1">
                    <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-[#E2E8F0] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition tracking-tight mb-2 md:mb-3 transition-colors truncate">{item.job.title}</h3>
                  </Link>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400 dark:text-slate-500" /> <span className="truncate max-w-[120px] md:max-w-none">{item.job.employer?.name}</span></span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400 dark:text-slate-500" /> {item.job.category}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black tracking-tight normal-case text-sm md:text-base transition-colors">NPR {(item.job.budget * 133).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Link to={`/jobs/${item.job._id}`} className="flex-1 md:flex-none text-center bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:brightness-110 transition shadow-xl shadow-indigo-500/20 active:scale-95">
                  Apply Now
                </Link>
                <button 
                  onClick={() => unsaveJob(item._id)}
                  className="p-3.5 md:p-4 bg-slate-50 dark:bg-[#0F172A] text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl md:rounded-2xl transition border border-slate-200 dark:border-white/5 active:scale-95 shadow-lg transition-colors"
                  title="Remove Bookmark"
                >
                  <Trash2 size={20} className="md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-black/20 rounded-[3rem] border border-slate-100 dark:border-slate-600 transition-colors">
            <Star size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4 transition-colors" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 transition-colors">No saved jobs yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">Explore the job board and bookmark positions that match your skills.</p>
            <Link to="/jobs" className="inline-block mt-6 text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-colors">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
