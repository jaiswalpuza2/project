import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { DollarSign, MapPin, Clock, Send, Briefcase, User, Calendar, Sparkles, RefreshCw, Building, Bookmark } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-20 w-20 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 text-3xl font-black overflow-hidden shadow-inner uppercase">
                {job.employer?.companyLogo ? (
                  <img src={job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : job.employer?.name[0]}
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{job.title}</h1>
                <p className="text-gray-500 font-bold flex items-center gap-2">
                  <Building size={16} className="text-blue-600" /> {job.employer?.name}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-100 mb-8">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <DollarSign size={20} className="text-green-600" />
                <span>Budget: ${job.budget}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Calendar size={20} className="text-blue-600" />
                <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-bold">
                <MapPin size={20} className="text-purple-600" />
                <span>{job.employer?.location || "Remote"}</span>
              </div>
            </div>

            <div className="prose prose-blue max-w-none">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill) => (
                  <span key={skill} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {user?.role === "freelancer" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Send size={20} className="text-blue-600" /> Submit Proposal
                </h3>
                <button
                  type="button"
                  onClick={generateAIProposal}
                  disabled={generatingAI}
                  className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition flex items-center gap-2"
                >
                  {generatingAI ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  {generatingAI ? "Thinking..." : "Generate with AI"}
                </button>
              </div>
              <form onSubmit={handleApply} className="space-y-6">
                <textarea
                  className="w-full p-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  rows="8"
                  placeholder="Tell the employer why you're a good fit for this job..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                >
                  {applying ? "Submitting..." : "Send Application"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition duration-500">
               <Building size={120} />
            </div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-xl font-bold">Company Insight</h3>
              {user && (
                <button 
                  onClick={handleSaveJob}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition duration-300 active:scale-90"
                  title="Save Job"
                >
                  <Bookmark size={20} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center font-black text-xl border border-white/10 overflow-hidden">
                {job.employer?.companyLogo ? (
                  <img src={job.employer.companyLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : job.employer?.name?.[0]}
              </div>
              <div>
                <p className="font-black text-lg">{job.employer?.name}</p>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{job.employer?.location || "Global HQ"}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">
              "{job.employer?.companyDescription || "A leading pioneer in the industry, focused on innovation and excellence."}"
            </p>
            <div className="space-y-4 text-xs font-bold text-gray-400">
              <p className="flex justify-between border-b border-white/5 pb-2">
                <span className="uppercase tracking-widest">Trust Score:</span>
                <span className="text-blue-400">98% Verified</span>
              </p>
              <p className="flex justify-between">
                <span className="uppercase tracking-widest">Industry:</span>
                <span className="text-white">Technology</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
