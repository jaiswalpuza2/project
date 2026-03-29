import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { DollarSign, MapPin, Clock, Send, Briefcase, User, Calendar, Sparkles, RefreshCw, Building, Bookmark, MessageSquare } from "lucide-react";
import { formatNPR } from "../utils/currency";
const JobDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState("");
  const [applying, setApplying] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const handleSaveJob = async () => {
    try {
      await axios.post(`http://localhost:5000/api/saved-jobs/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job bookmarked!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Already bookmarked");
    }
  };
  useEffect(() => {
    fetchJob();
  }, [id]);
  const generateAIProposal = async () => {
    setGeneratingAI(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/generate-proposal",
        { jobId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProposal(res.data.data);
      toast.success("AI Proposal generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI Generation failed");
    }
    setGeneratingAI(false);
  };
  const fetchJob = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(res.data.data);
    } catch (err) {
      toast.error("Failed to load job details");
    }
    setLoading(false);
  };
  const handleApply = async (e) => {
    e.preventDefault();
    if (!proposal.trim()) return toast.error("Please write a proposal");
    setApplying(true);
    try {
      await axios.post(
        "http://localhost:5000/api/applications/apply",
        {
          job: id,
          proposal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Application submitted!");
      navigate("/freelancer-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    }
    setApplying(false);
  };
  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  if (!job) return <div>Job not found</div>;
  return (
    <div className="space-y-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#1E293B] shadow-lg shadow-black/20 p-8 rounded-3xl shadow-sm border border-slate-600">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black overflow-hidden shadow-inner uppercase">
                {job.employer?.companyLogo ? (
                  <img src={job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : job.employer?.name[0]}
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-200 tracking-tight mb-2">{job.title}</h1>
                <p className="text-slate-400 font-bold flex items-center gap-3 text-lg">
                  <Building size={20} className="text-cyan-400" /> {job.employer?.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-8 py-8 border-y border-slate-600 mb-10">
              <div className="flex items-center gap-3 text-slate-300 font-black text-lg">
                <span className="text-emerald-400 font-black ml-1 text-2xl">NPR</span>
                <span>Budget: {formatNPR(job.budget)}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 font-black text-lg">
                <Calendar size={24} className="text-indigo-400" />
                <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 font-black text-lg">
                <MapPin size={24} className="text-violet-400" />
                <span>{job.employer?.location || "Remote"}</span>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <h3 className="text-2xl font-black text-slate-200 mb-6">Description</h3>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap text-lg">
                {job.description}
              </p>
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-black text-slate-200 mb-6">Required Skills</h3>
              <div className="flex flex-wrap gap-3">
                {job.skillsRequired.map((skill) => (
                  <span key={skill} className="bg-[#0F172A] text-slate-300 border border-slate-600 px-5 py-2.5 rounded-xl font-black text-base">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {user?.role === "freelancer" && (
            <div className="bg-[#1E293B] shadow-lg shadow-black/20 p-8 rounded-3xl shadow-sm border border-slate-600">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <Send size={20} className="text-indigo-400" /> Submit Proposal
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/messages", { state: { initialContact: job.employer } })}
                    className="text-sm bg-[#0F172A] text-slate-300 border border-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-700 transition flex items-center gap-2"
                  >
                    <MessageSquare size={16} /> Message Employer
                  </button>
                  <button
                    type="button"
                    onClick={generateAIProposal}
                    disabled={generatingAI}
                    className="text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-2 rounded-xl font-bold hover:bg-indigo-500/30 transition flex items-center gap-2"
                  >
                    {generatingAI ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    {generatingAI ? "Thinking..." : "Generate with AI"}
                  </button>
                </div>
              </div>
              <form onSubmit={handleApply} className="space-y-6">
                <textarea
                  className="w-full p-6 bg-[#0F172A] border border-slate-600 rounded-2xl focus:border-indigo-500 text-slate-200 placeholder-slate-500 outline-none transition"
                  rows="8"
                  placeholder="Tell the employer why you're a good fit for this job..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-4 rounded-2xl font-black text-lg hover:brightness-110 transition shadow-xl shadow-indigo-500/20 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {applying ? "Submitting..." : "Send Application"}
                </button>
              </form>
            </div>
          )}
        </div>
        <div className="space-y-8">
          <div className="bg-[#1E293B] border border-slate-600 p-8 rounded-[2.5rem] text-slate-200 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition duration-500">
               <Building size={120} />
            </div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-xl font-bold">Company Insight</h3>
              {user && (
                <button 
                  onClick={handleSaveJob}
                  className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-2xl transition duration-300 active:scale-90"
                  title="Save Job"
                >
                  <Bookmark size={20} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="h-14 w-14 bg-[#0F172A] rounded-2xl flex items-center justify-center font-black text-xl border border-slate-600 overflow-hidden text-cyan-400">
                {job.employer?.companyLogo ? (
                  <img src={job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : job.employer?.name?.[0]}
              </div>
              <div>
                <p className="font-black text-lg">{job.employer?.name}</p>
                <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{job.employer?.location || "Global HQ"}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 italic">
              "{job.employer?.companyDescription || "A leading pioneer in the industry, focused on innovation and excellence."}"
            </p>
            <div className="space-y-4 text-xs font-bold text-slate-400">
              <p className="flex justify-between border-b border-slate-600 pb-2">
                <span className="uppercase tracking-widest">Trust Score:</span>
                <span className="text-indigo-400">98% Verified</span>
              </p>
              <p className="flex justify-between">
                <span className="uppercase tracking-widest">Industry:</span>
                <span className="text-slate-200">Technology</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobDetail;
