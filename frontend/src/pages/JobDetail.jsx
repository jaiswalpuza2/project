import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { DollarSign, MapPin, Clock, Send, Briefcase, User, Calendar, Sparkles, RefreshCw, Building, Bookmark, MessageSquare } from "lucide-react";
import { formatNPR } from "../utils/currency";
const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState("");
  const [applying, setApplying] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const handleSaveJob = async () => {
    try {
      await api.post(`/saved-jobs/${id}`);
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
      const res = await api.post("/ai/generate-proposal", { jobId: id });
      setProposal(res.data.data);
      toast.success("AI Proposal generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI Generation failed");
    }
    setGeneratingAI(false);
  };
  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
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
      await api.post(
        "/applications/apply",
        {
          job: id,
          proposal,
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
      <RefreshCw className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
    </div>
  );
  if (!job) return <div>Job not found</div>;
  return (
    <div className="space-y-10 md:space-y-16 px-4 md:px-0">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-8">
        <div className="lg:col-span-2 space-y-10 md:space-y-12">
          <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-lg dark:shadow-black/20 p-8 md:p-12 rounded-[2rem] md:rounded-3xl border border-slate-100 dark:border-slate-600 transition-colors">
            <div className="flex items-center gap-6 mb-8">
              <div className="h-16 w-16 md:h-20 md:w-20 min-w-[4rem] md:min-w-[5rem] bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-white text-2xl md:text-3xl font-black overflow-hidden shadow-inner uppercase shrink-0 transition-all">
                {job.employer?.companyLogo ? (
                  <img src={job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : job.employer?.name[0]}
              </div>
              <div className="min-w-0">
                <h1 className="text-[26px] md:text-3xl font-black text-slate-900 dark:text-slate-200 tracking-tight mb-2 transition-colors leading-tight">
                  {job.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-[15px] md:text-lg transition-colors">
                  {job.employer?.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-y-4 gap-x-6 py-5 border-y border-slate-100 dark:border-slate-600 mb-8 md:mb-10 transition-colors">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm whitespace-nowrap transition-colors">
                <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400 transition-colors" />
                <span>Budget: {formatNPR(job.budget)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm whitespace-nowrap transition-colors md:border-l border-slate-100 dark:border-slate-600 md:pl-6">
                <Calendar size={18} className="text-indigo-600 dark:text-indigo-400 transition-colors" />
                <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm whitespace-nowrap transition-colors md:border-l border-slate-100 dark:border-slate-600 md:pl-6">
                <MapPin size={18} className="text-violet-600 dark:text-violet-400 transition-colors" />
                <span>{job.employer?.location || "Remote"}</span>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-slate-200 mb-6 transition-colors">Description</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-[1.7] whitespace-pre-wrap text-[15px] md:text-lg transition-colors">
                {job.description}
              </p>
            </div>
            <div className="mt-12">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-slate-200 mb-6 transition-colors">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skillsRequired.map((skill) => (
                  <span key={skill} className="bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-[13px] md:text-base transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {user?.role === "freelancer" && (
            <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-lg dark:shadow-black/20 p-8 rounded-3xl border border-slate-100 dark:border-slate-600 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-200 flex items-center gap-2 transition-colors whitespace-nowrap">
                  <Send size={18} className="text-indigo-600 dark:text-indigo-400 transition-colors" /> Submit Proposal
                </h3>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate("/messages", { state: { initialContact: job.employer } })}
                    className="flex-1 sm:flex-none text-xs md:text-sm bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <MessageSquare size={16} /> Message Employer
                  </button>
                  <button
                    type="button"
                    onClick={generateAIProposal}
                    disabled={generatingAI}
                    className="flex-1 sm:flex-none text-xs md:text-sm bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/30 px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {generatingAI ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    {generatingAI ? "Thinking..." : "AI Assist"}
                  </button>
                </div>
              </div>
              <form onSubmit={handleApply} className="space-y-6">
                <textarea
                  className="w-full p-6 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600 rounded-2xl focus:border-indigo-500 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition shadow-inner transition-colors"
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
          <div className="bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-600 p-8 rounded-[2.5rem] text-slate-900 dark:text-slate-200 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-colors">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] transition-colors text-slate-400 dark:text-slate-500">Company Insight</h3>
              {user && (
                <button 
                  onClick={handleSaveJob}
                  className="p-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition duration-300 active:scale-90 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                  title="Save Job"
                >
                  <Bookmark size={18} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="h-14 w-14 bg-slate-50 dark:bg-[#0F172A] rounded-2xl flex items-center justify-center font-black text-xl border border-slate-200 dark:border-slate-600 overflow-hidden text-indigo-600 dark:text-cyan-400 transition-colors">
                {job.employer?.companyLogo ? (
                  <img src={job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : job.employer?.name?.[0]}
              </div>
              <div>
                <p className="font-black text-lg transition-colors leading-tight">{job.employer?.name}</p>
                <p className="text-xs text-indigo-600 dark:text-cyan-400 font-bold uppercase tracking-widest transition-colors mt-1">{job.employer?.location || "Global HQ"}</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 italic transition-colors">
              "{job.employer?.companyDescription || "A leading pioneer in the industry, focused on innovation and excellence."}"
            </p>
            <div className="space-y-4 text-xs font-bold text-slate-500 dark:text-slate-400 transition-colors">
              <p className="flex justify-between border-b border-slate-100 dark:border-slate-600 pb-2 transition-colors">
                <span className="uppercase tracking-widest">Trust Score:</span>
                <span className="text-indigo-600 dark:text-indigo-400 transition-colors">98% Verified</span>
              </p>
              <p className="flex justify-between transition-colors">
                <span className="uppercase tracking-widest">Industry:</span>
                <span className="text-slate-700 dark:text-slate-200 transition-colors truncate pl-4">Technology</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JobDetail;
