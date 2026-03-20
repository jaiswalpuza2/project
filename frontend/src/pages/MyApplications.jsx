import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Briefcase, Clock, DollarSign, ChevronRight, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyApplications = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applications/my", {
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
      case "accepted": return <CheckCircle className="text-emerald-500" size={18} />;
      case "rejected": return <XCircle className="text-red-500" size={18} />;
      case "shortlisted": return <AlertCircle className="text-blue-500" size={18} />;
      default: return <Clock className="text-amber-500" size={18} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected": return "bg-red-50 text-red-700 border-red-100";
      case "shortlisted": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Applications 📄</h2>
          <p className="text-gray-500 mt-2 font-medium italic">Track the status of your active proposals and job reach-outs.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length > 0 ? (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden">
                <div className="flex flex-col md:flex-row items-stretch">
                   {/* Job Info Section */}
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition mb-2">
                       {app.job.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400">
                      <div className="flex items-center gap-1.5 ">
                        <Briefcase size={16} className="text-gray-300" />
                        {app.job.employer?.name || "Company"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign size={16} className="text-emerald-400" />
                        ${app.job.budget}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-sm text-gray-500 italic line-clamp-2">
                         <span className="font-bold text-gray-400 not-italic mr-1">Your Proposal:</span> 
                         "{app.proposal}"
                      </p>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="md:w-64 bg-gray-50/50 border-t md:border-t-0 md:border-l border-gray-100 p-8 flex flex-col justify-center gap-4">
                    <Link 
                      to={`/jobs/${app.job._id}`}
                      className="w-full bg-white text-gray-700 py-3 rounded-xl font-bold border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition text-center flex items-center justify-center gap-2 shadow-sm"
                    >
                      View Job <ChevronRight size={16} />
                    </Link>
                    <Link 
                      to="/messages"
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
                    >
                      <FileText size={16} /> Contact Hiring Manager
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 py-32 text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-gray-300" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No applications yet</h3>
            <p className="text-gray-400 mt-2">Start showcasing your skills by applying to jobs!</p>
            <Link to="/jobs" className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-900 transition shadow-xl shadow-blue-100">
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
