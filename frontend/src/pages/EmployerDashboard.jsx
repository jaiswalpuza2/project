import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { 
  Plus, 
  Users, 
  User,
  FileText, 
  Layout, 
  MessageSquare, 
  MoreHorizontal,
  ChevronRight,
  CreditCard,
  RefreshCw,
  X
} from "lucide-react";
import EsewaPayment from "../components/EsewaPayment";
import NotificationDropdown from "../components/NotificationDropdown";

const EmployerDashboard = () => {
  const { user, logout, token } = useAuth();
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
        const res = await axios.get("http://localhost:5000/api/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` }
        });
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
        const res = await axios.get("http://localhost:5000/api/auth/talent", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTalents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTalent(false);
      }
    };

    if (token) {
      fetchAnalytics();
      fetchMyJobs();
      fetchTalents();
    }
  }, [token, user._id]);

  const viewApplications = async (job) => {
    setSelectedJob(job);
    setLoadingApps(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/job/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${appId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Application ${status}!`);
      // Update local state
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleHireAndPay = async (app) => {
    try {
      // First update status to accepted
      await axios.put(`http://localhost:5000/api/applications/${app._id}`, { status: 'accepted' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const res = await axios.post(
        "http://localhost:5000/api/payments/initiate-esewa",
        {
          jobId: app.job._id || app.job,
          freelancerId: app.freelancer._id || app.freelancer,
          amount: app.job.budget || 100,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEsewaData(res.data.data);
      setApplications(prev => prev.map(a => a._id === app._id ? { ...a, status: 'accepted' } : a));
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate hiring process");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">JobSphere</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Layout size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('myjobs')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition ${activeTab === 'myjobs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <FileText size={20} /> My Job Posts
          </button>
          <button 
            onClick={() => setActiveTab('talent')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition ${activeTab === 'talent' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Users size={20} /> Talent Search
          </button>
          <Link to="/messages" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl font-medium transition">
            <MessageSquare size={20} /> Messages
          </Link>
          <Link to="/payments" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 rounded-xl font-medium transition">
            <CreditCard size={20} /> Billing
          </Link>
          <Link to="/edit-profile" className="flex items-center gap-3 p-3 text-blue-400 hover:bg-slate-800 rounded-xl font-medium transition">
            <User size={20} /> My Profile
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="w-full p-3 text-left text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl font-medium transition flex items-center gap-3"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">

        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Employer Hub </h2>
            <p className="text-gray-500 mt-1">Manage your team hiring and active listings.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/post-job" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition flex items-center gap-2">
              <Plus size={20} /> Post a Job
            </Link>
            <NotificationDropdown />
          </div>
        </header>

        {/* Content Tabs */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main List */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Recently Posted Jobs</h3>
              <div className="space-y-4">
                {jobs.slice(0, 3).length > 0 ? (
                  jobs.slice(0, 3).map((job) => (
                    <div 
                      key={job._id} 
                      onClick={() => viewApplications(job)}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                          <FileText />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-500">${job.budget} • {job.status}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400">No jobs posted yet. Start by posting a job!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Analytics */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Hiring Pipeline</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-100 rounded w-full"></div>)}
                  </div>
                ) : (
                  [
                    { label: "Total Listings", value: stats?.totalJobs || 0, color: "blue" },
                    { label: "Total Applicantions", value: stats?.totalApplicants || 0, color: "emerald" },
                    { label: "Waitlist", value: 12, color: "purple" }
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 font-medium">{stat.label}</span>
                        <span className="text-gray-900 font-bold">{stat.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${stat.color}-500`} 
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
            <h3 className="text-2xl font-bold text-gray-900">All Job Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div 
                    key={job._id} 
                    onClick={() => viewApplications(job)}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition cursor-pointer gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <FileText size={20} />
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{job.status}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 line-clamp-1">{job.title}</h4>
                      <p className="text-gray-500 font-medium mt-1">${job.budget}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400">No jobs posted yet. Start by posting a job!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'talent' && (
          <div className="space-y-6 mb-10">
            <h3 className="text-2xl font-bold text-gray-900">Talent Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingTalent ? (
                <div className="col-span-3 text-center py-10 font-bold text-gray-400 italic">Finding talent...</div>
              ) : talents.length > 0 ? (
                talents.map((freelancer) => (
                  <div key={freelancer._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-lg transition duration-300">
                    <div className="h-20 w-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md mb-4">
                      {freelancer.name[0]}
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 text-center">{freelancer.name}</h4>
                    <p className="text-sm text-gray-500 text-center mb-4">{freelancer.bio || "No bio provided"}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                       {freelancer.skills?.slice(0, 3).map((skill, i) => (
                         <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{skill}</span>
                       ))}
                       {freelancer.skills?.length > 3 && <span className="text-xs text-gray-400">+{freelancer.skills.length - 3}</span>}
                    </div>
                    <Link to={`/profile/${freelancer._id}`} className="w-full text-center py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-bold rounded-xl transition">
                      View Profile
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-400">No freelancers found.</div>
              )}
            </div>
          </div>
        )}

        {/* Universal Modals */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Applications for {selectedJob.title}</h3>
                  <p className="text-gray-500 text-sm italic font-medium">Review talent and secure them with eSewa.</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {loadingApps ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
                    <p className="text-gray-400 font-bold italic">Gathering applications...</p>
                  </div>
                ) : applications.length > 0 ? (
                  applications.map((app) => (
                    <div key={app._id} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-6 hover:shadow-lg transition duration-500">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center font-black text-xl text-blue-600 shadow-sm">
                            {app.freelancer?.name[0]}
                          </div>
                          <div>
                            <h4 className="font-black text-lg text-gray-900">{app.freelancer?.name}</h4>
                            <div className="flex items-center gap-2">
                               <p className="text-xs text-blue-500 font-bold uppercase tracking-widest italic">{app.freelancer?.email}</p>
                               <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                                 app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                 app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                 app.status === 'shortlisted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                 'bg-amber-50 text-amber-600 border-amber-100'
                               }`}>
                                 {app.status}
                               </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 italic">
                          "{app.proposal}"
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        {app.status !== 'accepted' && (
                          <button 
                            onClick={() => handleHireAndPay(app)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-gray-900 transition flex items-center justify-center gap-3 shadow-xl shadow-blue-100 whitespace-nowrap"
                          >
                            <CreditCard size={18} /> Hire & Pay
                          </button>
                        )}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                            className="flex-1 bg-white text-blue-600 px-4 py-3 rounded-2xl font-bold hover:bg-blue-50 transition border border-blue-100 text-sm whitespace-nowrap"
                          >
                            Shortlist
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(app._id, 'rejected')}
                            className="flex-1 bg-white text-red-500 px-4 py-3 rounded-2xl font-bold hover:bg-red-50 transition border border-red-100 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                        <Link 
                          to={`/profile/${app.freelancer._id || app.freelancer}`}
                          className="w-full bg-gray-100 text-gray-500 px-8 py-2 rounded-2xl font-bold hover:bg-gray-200 transition text-center text-xs"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-400">No applications yet for this job.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Esewa Redirect Component */}
        {esewaData && (
          <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-md flex items-center justify-center">
            <EsewaPayment esewaData={esewaData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployerDashboard;
