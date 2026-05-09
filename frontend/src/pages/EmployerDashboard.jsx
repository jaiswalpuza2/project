import React from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { 
  Plus, 
  Users, 
  User,
  FileText, 
  MoreHorizontal,
  ChevronRight,
  CreditCard,
  RefreshCw,
  Sparkles,
  X,
  MessageSquare,
  Edit,
  Trash2
} from "lucide-react";
import EsewaPayment from "../components/EsewaPayment";
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [stats, setStats] = React.useState(null);
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedJob, setSelectedJob] = React.useState(null);
  const [applications, setApplications] = React.useState([]);
  const [loadingApps, setLoadingApps] = React.useState(false);
  const [esewaData, setEsewaData] = React.useState(null);
  const [talents, setTalents] = React.useState([]);
  const [loadingTalent, setLoadingTalent] = React.useState(false);
  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics");
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchMyJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data.data.filter(j => j.employer === user._id || j.employer?._id === user._id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchTalents = async () => {
      try {
        setLoadingTalent(true);
        const res = await api.get("/auth/talent");
        setTalents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTalent(false);
      }
    };
    if (user?._id) {
      fetchAnalytics();
      fetchMyJobs();
      fetchTalents();
    }
  }, [user?._id]);
  const viewApplications = async (job) => {
    setSelectedJob(job);
    setLoadingApps(true);
    try {
      const res = await api.get(`/applications/job/${job._id}`);
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };
  const updateApplicationStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      toast.success(`Application ${status}!`);
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };
  const handleHireAndPay = async (app) => {
    try {
      await api.put(`/applications/${app._id}`, { status: 'accepted' });
      const res = await api.post(
        "/payments/initiate-esewa",
        {
          jobId: app.job._id || app.job,
          freelancerId: app.freelancer._id || app.freelancer,
          amount: 500,
        }
      );
      setEsewaData(res.data.data);
      setApplications(prev => prev.map(a => a._id === app._id ? { ...a, status: 'accepted' } : a));
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate hiring process");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };
  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex justify-start md:justify-end items-center mb-4 md:mb-6">
        <Link to="/post-job" className="w-full md:w-auto justify-center bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-black shadow-lg shadow-indigo-500/20 hover:brightness-110 transition flex items-center gap-2 uppercase text-xs md:text-sm tracking-widest">
          <Plus size={20} className="md:w-[22px] md:h-[22px]" /> Post a Job
        </Link>
      </div>
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-200 transition-colors">Recently Posted Jobs</h3>
              <div className="space-y-4">
                {jobs.slice(0, 3).length > 0 ? (
                  jobs.slice(0, 3).map((job) => (
                    <div 
                      key={job._id} 
                      onClick={() => viewApplications(job)}
                      className="bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-6 rounded-2xl border border-slate-100 dark:border-slate-600/50 flex justify-between items-center hover:border-indigo-400/50 transition-all duration-300 cursor-pointer group hover:shadow-xl dark:hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-50 dark:bg-[#0F172A] border border-slate-100 dark:border-white/5 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <FileText size={20} />
                        </div>
                         <div>
                          <h4 className="text-xl font-black text-slate-900 dark:text-[#E2E8F0] group-hover:text-indigo-600 dark:group-hover:text-white transition tracking-tight">{job.title}</h4>
                          <p className="text-sm font-black text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">NPR {(job.budget * 133).toLocaleString()} • <span className="text-indigo-600 dark:text-indigo-400">{job.status}</span></p>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-black/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-600 transition-colors">
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-bold transition-colors">No jobs posted yet. Start by posting a job!</p>
                  </div>
                )}
                {jobs.length > 0 && (
                  <button 
                    onClick={() => setActiveTab('myjobs')}
                    className="w-full text-center py-5 text-base font-black text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-[#1E293B] shadow-lg dark:shadow-black/20 rounded-2xl transition uppercase tracking-widest"
                  >
                    View All Job Posts
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-200 transition-colors">Hiring Pipeline</h3>
              <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-8 rounded-3xl border border-slate-100 dark:border-slate-600/50 space-y-8 transition-colors">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-700 rounded w-full"></div>)}
                  </div>
                ) : (
                  [
                    { label: "Total Listings", value: stats?.totalJobs || 0, color: "indigo" },
                    { label: "Total Applicantions", value: stats?.totalApplicants || 0, color: "emerald" },
                    { label: "Waitlist", value: 12, color: "violet" }
                  ].map((stat) => (
                     <div key={stat.label}>
                      <div className="flex justify-between text-base mb-4">
                        <span className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest transition-colors">{stat.label}</span>
                        <span className="text-slate-900 dark:text-[#E2E8F0] font-black text-xl transition-colors">{stat.value}</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-[#0F172A] rounded-full overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner transition-colors">
                        <div 
                          className={`h-full bg-${stat.color}-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] dark:shadow-[0_0_10px_rgba(99,102,241,0.5)]`} 
                          style={{ width: `${Math.min((stat.value / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'myjobs' && (
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setActiveTab('dashboard')}
                className="bg-white dark:bg-[#1E293B] shadow-lg dark:shadow-black/20 p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200 transition flex items-center justify-center border border-slate-200 dark:border-slate-600"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-200 transition-colors">All Job Posts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div 
                    key={job._id}
                    className="group bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-black/20 p-6 rounded-3xl border border-slate-100 dark:border-slate-600 flex flex-col hover:shadow-2xl dark:hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition duration-300 relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div 
                        onClick={() => viewApplications(job)}
                        className="h-14 w-14 bg-slate-50 dark:bg-[#0F172A] text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-600 cursor-pointer group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"
                      >
                        <FileText size={24} />
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/edit-job/${job._id}`); }}
                          className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-400/30 transition"
                          title="Edit Job"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteJob(job._id); }}
                          className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-red-400/30 transition"
                          title="Delete Job"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div onClick={() => viewApplications(job)} className="cursor-pointer">
                      <h4 className="font-black text-2xl text-slate-900 dark:text-slate-200 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-white transition">{job.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 font-black mt-2 text-lg transition-colors">NPR {(job.budget * 133).toLocaleString()}</p>
                      <div className="mt-4 flex items-center justify-between">
                         <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black px-4 py-1.5 rounded-full border border-indigo-500/20 uppercase tracking-widest">{job.status}</span>
                         <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">View Apps <ChevronRight size={14} /></span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-black/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-600 transition-colors">
                    <p className="text-slate-500 dark:text-slate-400 font-bold transition-colors">No jobs posted yet. Start by posting a job!</p>
                  </div>
              )}
            </div>
          </div>
        )}
         {activeTab === 'talent' && (
          <div className="space-y-8 mb-10">
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-200 transition-colors">Talent Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingTalent ? (
                <div className="col-span-3 text-center py-10 font-bold text-slate-400 italic">Finding talent...</div>
              ) : talents.length > 0 ? (
                talents.map((freelancer) => (
                  <div key={freelancer._id} className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-black/20 p-6 rounded-3xl border border-slate-100 dark:border-slate-600 flex flex-col items-center hover:shadow-2xl hover:border-indigo-500/30 transition duration-300">
                    <div className="h-20 w-20 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md mb-4">
                      {freelancer.name[0]}
                    </div>
                     <h4 className="font-black text-xl text-slate-900 dark:text-slate-200 text-center transition-colors">{freelancer.name}</h4>
                    <p className="text-base text-slate-600 dark:text-slate-400 text-center mb-6 transition-colors">{freelancer.bio || "No bio provided"}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                       {freelancer.skills?.slice(0, 3).map((skill, i) => (
                         <span key={i} className="text-sm bg-slate-50 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 font-bold transition-colors">{skill}</span>
                       ))}
                       {freelancer.skills?.length > 3 && <span className="text-sm text-slate-400 font-bold">+{freelancer.skills.length - 3}</span>}
                    </div>
                    <Link to={`/profile/${freelancer._id}`} className="w-full text-center py-2 bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white font-bold rounded-xl transition border border-slate-200 dark:border-slate-600">
                      View Profile
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-slate-400">No freelancers found.</div>
              )}
            </div>
          </div>
        )}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0F172A] w-full max-w-4xl rounded-2xl md:rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh] border border-slate-200 dark:border-slate-600/50 transition-colors duration-300">
               <div className="p-6 md:p-10 border-b border-slate-100 dark:border-slate-600/50 flex justify-between items-center bg-slate-50 dark:bg-[#1E293B] transition-colors">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight transition-colors">Applications for {selectedJob.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-black uppercase tracking-widest mt-1 md:mt-2 transition-colors">Review talent and secure them with eSewa.</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-3 bg-white dark:bg-[#0F172A] text-slate-400 hover:text-red-600 rounded-full transition-all border border-slate-200 dark:border-white/5 shadow-lg active:scale-95"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
                {loadingApps ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <RefreshCw className="animate-spin text-indigo-400 mb-4" size={48} />
                    <p className="text-slate-400 font-bold italic">Gathering applications...</p>
                  </div>
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                  <div key={app._id} className="bg-white dark:bg-[#1E293B] p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-600/50 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8 hover:border-indigo-400/50 transition-all duration-500 shadow-xl">
                      <div className="flex-1 space-y-4 md:space-y-6 w-full">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="h-12 w-12 md:h-16 md:w-16 bg-slate-50 dark:bg-[#0F172A] rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-white/5 shadow-inner transition-colors">
                            {app.freelancer?.name[0]}
                          </div>
                           <div className="min-w-0 flex-1">
                            <h4 className="font-black text-lg md:text-2xl text-slate-900 dark:text-[#E2E8F0] tracking-tight truncate transition-colors">{app.freelancer?.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-2">
                               <p className="text-xs md:text-sm text-cyan-400 font-black uppercase tracking-[0.1em] truncate max-w-[150px] md:max-w-none">{app.freelancer?.email}</p>
                               <span className={`text-xs md:text-sm px-3 md:px-4 py-1 rounded-full font-black uppercase tracking-widest border ${
                                 app.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                 app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                 app.status === 'shortlisted' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                               }`}>
                                 {app.status}
                               </span>
                            </div>
                          </div>
                        </div>
                         <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-black line-clamp-4 md:line-clamp-none transition-colors">
                          {app.proposal}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:gap-3 w-full md:w-64">
                        <div className="flex flex-col gap-2">
                          {app.status !== 'accepted' && (
                            <button 
                              onClick={() => handleHireAndPay(app)}
                              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white h-12 md:h-14 rounded-xl md:rounded-2xl font-black hover:brightness-110 transition flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 whitespace-nowrap text-sm md:text-base uppercase tracking-widest"
                            >
                              <CreditCard size={18} className="md:w-5 md:h-5" /> Hire & Pay
                            </button>
                          )}
                          <button 
                            onClick={() => navigate("/messages", { state: { initialContact: app.freelancer } })}
                            className="w-full bg-cyan-500 text-slate-900 h-14 rounded-2xl font-black hover:bg-cyan-400 transition flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/20 whitespace-nowrap text-base uppercase tracking-widest"
                          >
                            <MessageSquare size={20} /> Message User
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                            className="bg-slate-50 dark:bg-[#0F172A] text-indigo-600 dark:text-indigo-400 h-12 rounded-xl font-black hover:bg-indigo-600 hover:text-white transition border border-slate-200 dark:border-slate-700 text-xs uppercase tracking-tighter transition-colors"
                          >
                            Shortlist
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(app._id, 'rejected')}
                            className="bg-slate-50 dark:bg-[#0F172A] text-red-600 dark:text-red-400 h-12 rounded-xl font-black hover:bg-red-600 hover:text-white transition border border-slate-200 dark:border-slate-700 text-xs uppercase tracking-tighter transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                        
                        <Link 
                          to={`/profile/${app.freelancer._id || app.freelancer}`}
                          className="w-full bg-slate-100 dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 h-10 rounded-xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition text-center flex items-center justify-center text-xs border border-slate-200 dark:border-slate-700 uppercase tracking-widest transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <p className="text-slate-400">No applications yet for this job.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {esewaData && (
          <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-md flex items-center justify-center">
            <EsewaPayment esewaData={esewaData} />
          </div>
        )}
    </div>
  );
};
export default EmployerDashboard;
