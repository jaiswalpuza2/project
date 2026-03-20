import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, Star, Bookmark, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const JobListing = () => {
  const { user, token } = useAuth();
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
      let url = `http://localhost:5000/api/jobs?keyword=${search}`;
      if (category !== "All") url += `&category=${category}`;
      if (jobType !== "All") url += `&jobType=${jobType}`;
      if (experienceLevel !== "All") url += `&experienceLevel=${experienceLevel}`;
      if (location) url += `&location=${location}`;
      if (minBudget) url += `&minBudget=${minBudget}`;
      if (maxBudget) url += `&maxBudget=${maxBudget}`;

      const res = await axios.get(url);
      setJobs(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    }
    setLoading(false);
  };

  const handleSaveJob = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/saved-jobs/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job bookmarked!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Already bookmarked");
    }
  };

  const categories = ["All", "Web Development", "Mobile Development", "UI/UX Design", "Content Writing", "Data Science"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
              Job Marketplace
            </span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Find Your Next <span className="text-blue-600">Greatness</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
            Join 10,000+ top freelancers and get matched with elite employers worldwide.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="glass p-6 rounded-[2.5rem] mb-12 flex flex-col lg:flex-row gap-4 items-center border border-white/40 shadow-xl shadow-blue-50/50">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-5 top-5 text-blue-600" size={20} />
            <input
              type="text"
              placeholder="Job title, skills, or company..."
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-[2rem] outline-none focus:border-blue-500 transition shadow-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 relative w-full">
            <MapPin className="absolute left-5 top-5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Location (Remote, NY...)"
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-[2rem] outline-none focus:border-blue-500 transition shadow-sm font-medium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-48 relative">
            <Filter className="absolute left-5 top-5 text-gray-400" size={20} />
            <select
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-[2rem] outline-none focus:border-blue-500 transition shadow-sm font-bold text-gray-700 appearance-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <div className="relative">
            <select
              className="pl-6 pr-10 py-3 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition font-bold text-gray-600 appearance-none cursor-pointer shadow-sm"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Remote">Remote</option>
              <option value="Fixed">Fixed Price</option>
              <option value="Hourly">Hourly</option>
            </select>
          </div>
          <div className="relative">
            <select
              className="pl-6 pr-10 py-3 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 transition font-bold text-gray-600 appearance-none cursor-pointer shadow-sm"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Entry">Entry Level</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 border-2 border-gray-100 rounded-2xl shadow-sm">
            <DollarSign size={16} className="text-gray-400" />
            <input 
              type="number" 
              placeholder="Min" 
              className="w-20 outline-none font-bold text-gray-600"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
            <span className="text-gray-300">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              className="w-20 outline-none font-bold text-gray-600"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchJobs}
            className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg active:scale-95"
          >
            Apply Filters
          </button>
        </div>

        {/* Job List */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="group/card relative">
                  <Link to={`/jobs/${job._id}`} className="block h-full">
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 hover:border-blue-300 transition-all duration-500 h-full flex flex-col shadow-sm hover:shadow-2xl hover:shadow-blue-50 hover:-translate-y-2">
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-20 w-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 text-2xl font-black overflow-hidden shadow-inner uppercase">
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
                            className="p-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-[1.2rem] transition duration-300 active:scale-90"
                          >
                            <Bookmark size={24} />
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-2xl font-black text-gray-900 group-hover/card:text-blue-600 transition tracking-tight mb-2 leading-tight">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                          <Briefcase size={14} /> {job.employer?.name}
                        </div>
                      </div>

                      <div className="mt-auto pt-8 border-t border-gray-50 flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider">
                          <Clock size={14} /> {job.category}
                        </span>
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-wider">
                          <DollarSign size={14} /> ${job.budget}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Sparkles size={64} className="mx-auto text-gray-100 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900">No jobs found</h3>
                <p className="text-gray-400 mt-2 font-medium">Try broadening your search criteria.</p>
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
                  className="mt-6 text-blue-600 font-bold hover:underline"
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
