import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Briefcase, Clock, DollarSign, ChevronRight, FileText, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatNPR } from "../utils/currency";

const MyApplications = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/applications/my", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyApplications();
    }
  }, [token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted": return <CheckCircle className="text-emerald-400" size={18} />;
      case "rejected": return <XCircle className="text-red-400" size={18} />;
      case "shortlisted": return <AlertCircle className="text-blue-400" size={18} />;
      default: return <Clock className="text-amber-400" size={18} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "shortlisted": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="space-y-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-200 tracking-tight">My Applications </h2>
          <p className="text-slate-400 mt-2 font-medium italic">Track the status of your active proposals and job reach-outs.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : applications.length > 0 ? (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] border border-slate-600/50 hover:border-indigo-500/30 transition-all duration-500 group overflow-hidden">
                <div className="flex flex-col md:flex-row items-stretch">

                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-3xl font-black text-[#E2E8F0] group-hover:text-indigo-400 transition mb-3 tracking-tight">
                       {app.job?.title || "Deleted Job"}
                    </h3>

                    <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-400">
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-slate-500" />
                        <span className="text-slate-300">{app.job?.employer?.name || "Company"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 font-black">
                        <DollarSign size={18} />
                        {formatNPR(app.job?.budget || 0)}
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-[#0F172A] rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-slate-400 leading-relaxed font-medium italic">
                         <span className="font-black text-slate-500 not-italic mr-2 uppercase text-[10px] tracking-widest">Your Proposal:</span> 
                         "{app.proposal}"
                      </p>
                    </div>
                  </div>

                  <div className="md:w-72 bg-slate-900/30 border-t md:border-t-0 md:border-l border-slate-600/50 p-8 flex flex-col justify-center gap-4">
                    <Link 
                      to={`/jobs/${app.job?._id || ''}`}
                      className="w-full bg-[#1E293B] text-slate-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-600/50 hover:bg-slate-800 hover:text-white transition text-center flex items-center justify-center gap-2 shadow-lg"
                    >
                      View Job <ChevronRight size={16} />
                    </Link>
                    <Link 
                      to="/messages"
                      state={{ initialContact: app.job?.employer }}
                      className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20"
                    >
                      <MessageSquare size={16} /> Message
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1E293B] shadow-lg shadow-black/20 rounded-[3rem] border border-dashed border-slate-600 py-32 text-center">
            <div className="h-20 w-20 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-600">
              <FileText className="text-slate-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-200">No applications yet</h3>
            <p className="text-slate-400 mt-2">Start showcasing your skills by applying to jobs!</p>
            <Link to="/jobs" className="mt-8 inline-block bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-8 py-3 rounded-2xl font-bold hover:brightness-110 transition shadow-lg shadow-indigo-500/20">
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
