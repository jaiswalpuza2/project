import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Briefcase, DollarSign, FileText, ChevronRight, Plus, X } from "lucide-react";

const PostJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Web Development",
    jobType: "Fixed",
    experienceLevel: "Intermediate",
    skillsRequired: [],
    skillInput: "",
  });

  const categories = ["Web Development", "Mobile Development", "UI/UX Design", "Content Writing", "Data Science", "Other"];

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
      await axios.post(
        "http://localhost:5000/api/jobs",
        {
          ...formData,
          budget: Number(formData.budget),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Job posted successfully!");
      navigate("/employer-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-900 p-10 text-white">
          <h2 className="text-3xl font-bold">Post a New Job</h2>
          <p className="mt-2 text-gray-400 italic">Reach thousands of talented freelancers instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Job Title</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                name="title"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. Full-Stack Developer for SaaS Platform"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  name="budget"
                  type="number"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="5000"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
              <select
                name="category"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Job Type</label>
              <select
                name="jobType"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Remote">Remote</option>
                <option value="Fixed">Fixed Price</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Experience Level</label>
              <select
                name="experienceLevel"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="Entry">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Job Description</label>
            <textarea
              name="description"
              required
              rows="6"
              className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Detailed description of requirements, scope, and deliverables..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Skills Required</label>
            <div className="flex gap-2">
              <input
                name="skillInput"
                className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. React, Python"
                value={formData.skillInput}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition"
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skillsRequired.map((skill) => (
                <span key={skill} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-100">
                  {skill}
                  <X className="h-4 w-4 cursor-pointer" onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
          >
            {loading ? "Publishing..." : "Publish Job Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
