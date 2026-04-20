import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Briefcase, DollarSign, FileText, ChevronRight, Plus, X, Edit3 } from "lucide-react";

const PostJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Web Development",
    customCategory: "",
    jobType: "Fixed",
    experienceLevel: "Intermediate",
    skillsRequired: [],
    skillInput: "",
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchJobData = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`);
          const job = res.data.data;
          setFormData({
            title: job.title,
            description: job.description,
            budget: job.budget * 133, // Convert back to NPR
            category: job.category,
            customCategory: "",
            jobType: job.jobType || "Fixed",
            experienceLevel: job.experienceLevel || "Intermediate",
            skillsRequired: job.skillsRequired || [],
            skillInput: "",
          });
        } catch (err) {
          toast.error("Failed to load job data");
          navigate("/employer-dashboard");
        }
      };
      fetchJobData();
    }
  }, [id, isEditMode, navigate]);

  const categories = ["Web Development", "Mobile Development", "UI/UX Design", "Content Writing", "Data Science", "Game Development", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (formData.skillInput.trim() && !formData.skillsRequired.includes(formData.skillInput.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, formData.skillInput.trim()],
        skillInput: "",
      });
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_URL}/api/jobs/${id}` 
        : import.meta.env.VITE_API_URL + "/api/jobs";
      const method = isEditMode ? "put" : "post";

      await axios[method](
        url,
        {
          ...formData,
          category: formData.category === "Other" && formData.customCategory ? formData.customCategory : formData.category,
          budget: Number(formData.budget) / 133,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(isEditMode ? "Job updated successfully!" : "Job posted successfully!");
      navigate("/employer-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? "update" : "post"} job`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10">
      <div className="max-w-3xl mx-auto bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden border border-slate-600/50">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-12 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            {isEditMode ? <Edit3 size={80} /> : <Plus size={80} />}
          </div>
          <h2 className="text-5xl font-black tracking-tight">{isEditMode ? "Edit Job Post" : "Post a New Job"}</h2>
          <p className="mt-4 text-indigo-100 font-black uppercase tracking-widest text-xs">
            {isEditMode ? "Update your requirements to attract the best talent" : "Reach thousands of talented freelancers instantly"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Job Title</label>
            <div className="relative group/input">
              <Briefcase className="absolute left-6 top-6 text-slate-400 group-focus-within/input:text-indigo-400 transition-colors" size={24} />
              <input
                name="title"
                required
                className="w-full pl-16 pr-8 py-6 bg-[#0F172A] border border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-black transition text-base text-[#E2E8F0] placeholder:text-slate-500 shadow-inner"
                placeholder="e.g. Full-Stack Developer for SaaS Platform"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Budget (NRP)</label>
              <div className="relative group/input">
                <span className="absolute left-6 top-6 text-[#E2E8F0] font-black group-focus-within/input:text-indigo-400 transition-colors text-lg">NRP</span>
                <input
                  name="budget"
                  type="number"
                  required
                  className="w-full pl-18 pr-8 py-6 bg-[#0F172A] border border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-black transition text-base text-[#E2E8F0] placeholder:text-slate-500 shadow-inner"
                  placeholder="5000"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
             <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
              <div className="relative group/input">
                <select
                  name="category"
                  className="w-full px-8 py-6 bg-[#0F172A] border border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-black transition appearance-none text-base text-[#E2E8F0] shadow-inner"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                   <ChevronRight size={24} className="rotate-90" />
                </div>
              </div>
              {formData.category === "Other" && (
                <input
                  name="customCategory"
                  required
                  className="w-full mt-3 px-6 py-5 bg-[#0F172A] border border-slate-600/50 focus:border-indigo-500/50 rounded-2xl outline-none font-bold transition text-[#E2E8F0] placeholder:text-slate-500 shadow-inner"
                  placeholder="Enter your custom category"
                  value={formData.customCategory}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Job Type</label>
              <select
                name="jobType"
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none text-slate-200"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Remote">Remote</option>
                <option value="Fixed">Fixed Price</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Experience Level</label>
              <select
                name="experienceLevel"
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none text-slate-200"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="Entry">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Job Description</label>
            <textarea
              name="description"
              required
              rows="8"
              className="w-full p-8 bg-[#0F172A] border border-slate-600/50 focus:border-indigo-500/50 rounded-[2rem] outline-none font-medium text-slate-300 leading-relaxed transition placeholder:text-slate-500 shadow-inner"
              placeholder="Detailed description of requirements, scope, and deliverables..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Skills Required</label>
            <div className="flex gap-2">
              <input
                name="skillInput"
                className="flex-1 px-4 py-3 bg-[#0F172A] border border-slate-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-slate-200 placeholder:text-slate-400"
                placeholder="e.g. React, Python"
                value={formData.skillInput}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white p-3 rounded-2xl hover:brightness-110 transition"
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skillsRequired.map((skill) => (
                <span key={skill} className="bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-indigo-500/30">
                  {skill}
                  <X className="h-4 w-4 cursor-pointer hover:text-red-400 transition" onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/20 hover:brightness-110 transition"
          >
            {loading 
              ? (isEditMode ? "Updating..." : "Publishing...") 
              : (isEditMode ? "Update Job Post" : "Publish Job Post")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
