import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, Star, Bookmark, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
const JobListing = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [experienceLevel, setExperienceLevel] = useState("All");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = `/jobs?keyword=${search}`;
      if (category !== "All") url += `&category=${category}`;
      if (jobType !== "All") url += `&jobType=${jobType}`;
      if (experienceLevel !== "All") url += `&experienceLevel=${experienceLevel}`;
      if (location) url += `&location=${location}`;
      if (minBudget) url += `&minBudget=${Number(minBudget) / 133}`;
      if (maxBudget) url += `&maxBudget=${Number(maxBudget) / 133}`;
      const res = await api.get(url);
      setJobs(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    }
    setLoading(false);
  };
  const handleSaveJob = async (jobId) => {
    try {
      await api.post(`/saved-jobs/${jobId}`);
      toast.success("Job bookmarked!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Already bookmarked");
    }
  };
  const categories = ["All", "Web Development", "Mobile Development", "UI/UX Design", "Content Writing", "Data Science"];
  return (
    <div className="space-y-10 md:space-y-16">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <header className="mb-10 md:mb-16 text-center transition-all">
          <h1 className="text-[26px] md:text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 tracking-tight transition-colors leading-tight">Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">Greatness</span></h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-[15px] md:text-lg font-medium transition-colors leading-relaxed">
            Join 10,000+ top freelancers and get matched with elite employers worldwide.
          </p>
        </header>
        <div className="glass bg-white/80 dark:bg-slate-800/80 p-8 md:p-10 rounded-[2.5rem] mb-10 md:mb-12 flex flex-col lg:flex-row gap-6 md:gap-4 items-center border border-slate-200 dark:border-slate-600 shadow-xl dark:shadow-slate-950/50 transition-colors">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-5 top-5 text-indigo-500 dark:text-indigo-400" size={20} />
            <input
              type="text"
              placeholder="Job title, skills, or company..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-600 rounded-[2rem] outline-none text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 transition shadow-sm font-medium transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 relative w-full">
            <MapPin className="absolute left-5 top-5 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Location (Remote, NY...)"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-600 rounded-[2rem] outline-none text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 transition shadow-sm font-medium transition-colors"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-56 relative">
            <Filter className="absolute left-6 top-6 text-slate-400 dark:text-slate-500" size={20} />
            <select
              className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-600 rounded-[2rem] outline-none focus:border-indigo-500 transition shadow-sm font-black text-slate-900 dark:text-slate-200 appearance-none cursor-pointer text-lg transition-colors"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-[#0F172A]">{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mb-12 md:mb-16 justify-center">
          <div className="relative">
            <select
              className="pl-8 pr-12 py-4 bg-white dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:border-indigo-500 transition font-black text-slate-600 dark:text-slate-300 appearance-none cursor-pointer shadow-sm text-base transition-colors"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="All" className="bg-white dark:bg-[#1E293B]">All Types</option>
              <option value="Remote" className="bg-white dark:bg-[#1E293B]">Remote</option>
              <option value="Fixed" className="bg-white dark:bg-[#1E293B]">Fixed Price</option>
              <option value="Hourly" className="bg-white dark:bg-[#1E293B]">Hourly</option>
            </select>
          </div>
          <div className="relative">
            <select
              className="pl-8 pr-12 py-4 bg-white dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:border-indigo-500 transition font-black text-slate-600 dark:text-slate-300 appearance-none cursor-pointer shadow-sm text-base transition-colors"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="All" className="bg-white dark:bg-[#1E293B]">All Levels</option>
              <option value="Entry" className="bg-white dark:bg-[#1E293B]">Entry Level</option>
              <option value="Intermediate" className="bg-white dark:bg-[#1E293B]">Intermediate</option>
              <option value="Expert" className="bg-white dark:bg-[#1E293B]">Expert</option>
            </select>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-[#1E293B] px-6 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm transition-colors">
            <span className="text-slate-500 dark:text-slate-400 font-black ml-1 text-base transition-colors">NPR</span>
            <input 
              type="number" 
              placeholder="Min" 
              className="w-24 outline-none bg-transparent font-black text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-base transition-colors"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
            <span className="text-slate-500 dark:text-slate-400 font-black transition-colors">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              className="w-24 outline-none bg-transparent font-black text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-base transition-colors"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchJobs}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-10 py-5 md:py-4 rounded-2xl font-black hover:brightness-110 transition shadow-lg shadow-indigo-500/20 active:scale-95 text-base uppercase tracking-widest"
          >
            Apply Filters
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="group/card relative">
                  <Link to={`/jobs/${job._id}`} className="block h-full">
                    <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-600 hover:border-indigo-600/30 dark:hover:border-indigo-400/50 transition-all duration-500 h-full flex flex-col hover:shadow-indigo-500/10 dark:hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] hover:-translate-y-2 group transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-20 w-20 bg-slate-50 dark:bg-[#0F172A] rounded-[1.5rem] flex items-center justify-center text-slate-900 dark:text-slate-100 text-2xl font-black overflow-hidden shadow-inner uppercase border border-slate-200 dark:border-white/5 transition-colors">
                          {job.employer?.companyLogo ? (
                            <img src={job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                          ) : job.employer?.name[0]}
                        </div>
                        {user && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleSaveJob(job._id);
                            }}
                            className="p-4 bg-slate-50 dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[1.2rem] transition duration-300 active:scale-90 border border-slate-200 dark:border-white/5 transition-colors"
                          >
                            <Bookmark size={24} />
                          </button>
                        )}
                      </div>
                      <div className="mb-10">
                        <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-[#E2E8F0] group-hover:text-indigo-600 dark:group-hover:text-white transition tracking-tight mb-3 leading-relaxed transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-[#CBD5E1] text-[15px] md:text-base font-medium transition-colors">
                          <Briefcase size={18} className="text-indigo-600 dark:text-indigo-400" /> {job.employer?.name}
                        </div>
                      </div>
                      <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-600/50 flex flex-wrap gap-3 transition-colors">
                        <span className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 rounded-full text-xs font-black uppercase tracking-wider border border-slate-200 dark:border-white/5 transition-colors">
                          <Clock size={16} className="text-indigo-500 dark:text-cyan-400" /> {job.category}
                        </span>
                        <span className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/30 rounded-full text-xs font-black uppercase tracking-wider transition-colors">
                          NPR {(job.budget * 133).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-black/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-600 transition-colors">
                <Sparkles size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-6 transition-colors" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-200 transition-colors">No jobs found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium transition-colors">Try broadening your search criteria.</p>
                <button 
                  onClick={() => { 
                    setSearch(""); 
                    setCategory("All"); 
                    setLocation(""); 
                    setJobType("All");
                    setExperienceLevel("All");
                    setMinBudget("");
                    setMaxBudget("");
                    fetchJobs(); 
                  }}
                  className="mt-6 text-indigo-600 dark:text-cyan-400 font-bold hover:brightness-110 transition-all underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default JobListing;
