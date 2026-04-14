import React, { useState, useEffect } from "react";
import { Users, FileText, Activity, AlertCircle, BarChart3, ShieldCheck, LogOut, TrendingUp, DollarSign, Briefcase, CheckCircle, Sparkles } from "lucide-react";

import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatNPR } from "../utils/currency";
import Footer from "../components/Footer";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import DashboardLayout from "../components/DashboardLayout";

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, jobs
  const [fraudReports, setFraudReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("Monthly");
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalRevenue: 0,
    fraudCount: 0
  });
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({ 
    title: "", 
    excerpt: "", 
    content: "", 
    category: "Freelancing Tips", 
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80" 
  });

  const [blogLoading, setBlogLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Access denied. Admin only.");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === "overview") fetchDashboardData();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "jobs") fetchJobs();
    if (activeTab === "blogs") fetchBlogs();
  }, [activeTab]);


  useEffect(() => {
    if (activeTab === "overview") fetchChartData();
  }, [timeRange, activeTab]);

  const fetchChartData = async () => {
    try {
      const chartRes = await axios.get(`http://localhost:5000/api/admin/chart-stats?period=${timeRange.toLowerCase()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChartData(chartRes.data.data);
    } catch (err) {
      console.error("Failed to load chart data");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [fraudRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/fraud-reports", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setFraudReports(fraudRes.data.data);
      setStatsData(statsRes.data.data);
      fetchChartData();
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data.data);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {

    e.preventDefault();
    setBlogLoading(true);
    try {
      await axios.post("http://localhost:5000/api/blogs", blogForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Blog post created successfully!");
      setBlogForm({ 
        title: "", 
        excerpt: "", 
        content: "", 
        category: "Freelancing Tips", 
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80" 
      });

      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create blog");
    } finally {
      setBlogLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };


  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleUserStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User status updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const stats = [
    { label: "Total Revenue", value: formatNPR(statsData?.totalRevenue || 0), icon: <DollarSign size={20} className="md:w-6 md:h-6" />, color: "emerald", trend: "+12.5%" },
    { label: "Total Users", value: (statsData?.totalUsers || 0).toLocaleString(), icon: <Users size={20} className="md:w-6 md:h-6" />, color: "indigo", trend: "+5.2%" },
    { label: "Active Jobs", value: (statsData?.activeJobs || 0).toLocaleString(), icon: <Briefcase size={20} className="md:w-6 md:h-6" />, color: "amber", trend: "Live" },
    { label: "Completed Projects", value: (statsData?.completedProjects || 0).toLocaleString(), icon: <CheckCircle size={20} className="md:w-6 md:h-6" />, color: "cyan", trend: "+8%" }
  ];

  const adminMenu = [
    { id: 'overview', label: 'Overview', icon: <Activity size={20} /> },
    { id: 'users', label: 'Manage Users', icon: <Users size={20} /> },
    { id: 'jobs', label: 'Job Posts', icon: <FileText size={20} /> },
    { id: 'blogs', label: 'Insights Blog', icon: <Sparkles size={20} /> },
  ];


  const renderContent = () => {
    if (loading) return (
      <div className="flex items-center justify-center h-96">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );

    switch (activeTab) {
      case "users":
        return (
          <div className="bg-[#1E293B] shadow-2xl rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 md:p-10 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/20">
              <h3 className="text-xl md:text-2xl font-black text-slate-100 uppercase tracking-tight">Platform Users ({users.length})</h3>
              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-black uppercase tracking-widest">
                System Users List
              </div>
            </div>
            <div className="p-4 md:p-8 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-black border-b border-slate-700/50">
                    <th className="pb-6">Name</th>
                    <th className="pb-6">Role</th>
                    <th className="pb-6">Status</th>
                    <th className="pb-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition group">
                      <td className="py-4 md:py-6">
                        <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{u.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{u.email}</div>
                      </td>
                      <td className="py-4 md:py-6">
                        <span className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border ${
                          u.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : 
                          u.role === "employer" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 md:py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.isDeactivated ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                          {u.isDeactivated ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 md:py-6 text-right space-x-2">
                        <button 
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-300 font-black text-[10px] uppercase border ${u.isDeactivated ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500 hover:text-white'}`}
                        >
                          {u.isDeactivated ? 'Activate' : 'Deactivate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 md:px-4 py-2 rounded-lg transition-all duration-300 font-black text-[10px] uppercase border border-red-500/20"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "jobs":
        return (
          <div className="bg-[#1E293B] shadow-2xl rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 md:p-8 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
              <h3 className="text-lg md:text-xl font-black text-slate-100 uppercase tracking-tight">Active Job Posts ({jobs.length})</h3>
            </div>
            <div className="p-4 md:p-8 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-black border-b border-slate-700/50">
                    <th className="pb-6">Job Title</th>
                    <th className="pb-6">Employer</th>
                    <th className="pb-6">Budget</th>
                    <th className="pb-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                  {jobs.map((job) => (
                    <tr key={job._id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition group">
                      <td className="py-4 md:py-6 font-bold text-slate-200 group-hover:text-amber-400 transition-colors uppercase tracking-tight">{job.title}</td>
                      <td className="py-4 md:py-6">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-[#F1F5F9]">{job.employer?.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{job.employer?.email}</span>
                        </div>
                      </td>
                      <td className="py-4 md:py-6 font-black text-emerald-400 text-xs md:text-sm">{formatNPR(job.budget)}</td>
                      <td className="py-4 md:py-6 text-right">
                        <button 
                          onClick={() => handleDeleteJob(job._id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all duration-300 font-black text-[10px] md:text-xs uppercase border border-red-500/20"
                        >
                          Delete Post
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "blogs":

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Create Blog Form */}
            <div className="bg-[#1E293B] shadow-2xl rounded-[2.5rem] border border-slate-700/50 overflow-hidden">
               <div className="p-10 border-b border-slate-700/50 bg-slate-800/20">
                 <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Create New Insight Story</h3>
               </div>
               <form onSubmit={handleCreateBlog} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Title</label>
                   <input 
                     type="text" 
                     value={blogForm.title}
                     onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                     className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                     placeholder="How to land your first gig..."
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Category</label>
                   <select 
                     value={blogForm.category}
                     onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                     className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-bold"
                   >
                     <option>Freelancing Tips</option>
                     <option>Market Trends</option>
                     <option>Lifestyle</option>
                     <option>Success Stories</option>
                   </select>
                 </div>
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Image URL</label>
                   <input 
                     type="text" 
                     value={blogForm.image}
                     onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                     className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono text-sm"
                     placeholder="https://images.unsplash.com/..."
                     required
                   />
                 </div>

                 <div className="md:col-span-2 space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Excerpt (Short Summary)</label>
                   <textarea 
                     value={blogForm.excerpt}
                     onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                     className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                     placeholder="A brief summary of the story..."
                     required
                   />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Main Content</label>
                   <textarea 
                     value={blogForm.content}
                     onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                     className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white h-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                     placeholder="Write the full story here..."
                     required
                   />
                 </div>
                 <button 
                   type="submit" 
                   disabled={blogLoading}
                   className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                 >
                   {blogLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
                   Publish Story
                 </button>
               </form>
            </div>

            {/* Blogs List */}
            <div className="bg-[#1E293B] shadow-2xl rounded-[2.5rem] border border-slate-700/50 overflow-hidden">
               <div className="p-10 border-b border-slate-700/50 bg-slate-800/20">
                 <h3 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Existing Stories</h3>
               </div>
               <div className="p-8 overflow-x-auto">
                 <table className="w-full text-left min-w-[600px]">
                   <thead>
                     <tr className="text-xs text-slate-500 uppercase tracking-widest font-black border-b border-slate-700/50">
                       <th className="pb-6">Title</th>
                       <th className="pb-6">Category</th>
                       <th className="pb-6">Date</th>
                       <th className="pb-6 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm text-slate-300">
                     {blogs.map((b) => (
                       <tr key={b._id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition group">
                         <td className="py-6 pr-6 font-bold text-slate-200 group-hover:text-indigo-400 transition-colors tracking-tight line-clamp-1">{b.title}</td>
                         <td className="py-6">
                           <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
                             {b.category}
                           </span>
                         </td>
                         <td className="py-6 text-slate-500 text-xs font-black tracking-widest">{new Date(b.createdAt).toLocaleDateString()}</td>
                         <td className="py-6 text-right">
                           <button 
                             onClick={() => handleDeleteBlog(b._id)}
                             className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-xl transition-all font-black text-xs uppercase border border-red-500/20"
                           >
                             Delete
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-10 overflow-visible">
              {stats.map((stat, i) => (
                <div key={i} className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-500 relative group overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                  <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-slate-900 border border-slate-700/50 rounded-xl md:rounded-2xl flex items-center justify-center text-${stat.color}-400 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>{stat.icon}</div>
                    <span className={`text-[9px] md:text-xs font-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl uppercase tracking-widest border ${stat.trend.startsWith("+") || stat.trend === "Live" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-pink-500/10 text-pink-400 border-pink-500/20"}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1 md:mb-2 relative z-10">{stat.label}</p>
                  <h3 className="text-2xl md:text-3xl font-black text-[#F8FAFC] tracking-tight relative z-10">{stat.value}</h3>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:gap-10 mb-8 md:mb-10 overflow-visible">
              <div className="bg-[#1E293B] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-slate-700/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-12 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 md:gap-4 mb-2">
                      <div className="w-2 h-6 md:w-2.5 md:h-8 bg-indigo-500 rounded-full"></div>
                      <h3 className="text-lg md:text-2xl font-black text-slate-100 uppercase tracking-tight">Platform Growth</h3>
                    </div>
                    <p className="text-slate-400 text-sm md:text-lg font-medium ml-5 md:ml-6">Real-time system engagement metrics.</p>
                  </div>
                  <div className="flex bg-[#0F172A] p-1 rounded-xl md:p-1.5 md:rounded-2xl border border-slate-700/50 shadow-inner w-full sm:w-auto">
                    {["Weekly", "Monthly", "Yearly"].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`flex-1 sm:flex-none px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${timeRange === range ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "text-slate-500 hover:text-slate-200"}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-[250px] md:h-[400px] w-full mt-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} 
                        dy={5}
                      />
                      <YAxis 
                        yAxisId="left"
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} 
                        dx={-5}
                        width={40}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }} 
                        dx={5}
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0F172A', 
                          border: '1px solid #334155', 
                          borderRadius: '1rem',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                          padding: '0.75rem'
                        }}
                        itemStyle={{ color: '#F8FAFC', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}
                        labelStyle={{ color: '#94A3B8', fontWeight: 900, marginBottom: '0.5rem', fontSize: '12px' }}
                      />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#6366f1" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                      <Area 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8b5cf6" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorUsers)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-700/30 relative z-10">
                   <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-indigo-500"></div>
                      <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest">Revenue</span>
                   </div>
                   <div className="flex items-center gap-2 md:gap-4">
                      <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500"></div>
                      <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest">Users</span>
                   </div>
                   <div className="sm:ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <TrendingUp size={16} className="text-emerald-400" />
                      <span className="text-[9px] md:text-xs font-black text-emerald-400 uppercase tracking-widest">+18.4% Growth</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1E293B] shadow-2xl rounded-2xl md:rounded-[3rem] border border-slate-700/50 overflow-hidden group">
              <div className="p-6 md:p-8 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
                  <h3 className="text-lg md:text-2xl font-black text-slate-100 uppercase tracking-tight">Security & Fraud Monitoring</h3>
                </div>
                <button className="w-full sm:w-auto bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-black text-[10px] uppercase border border-indigo-500/20 tracking-widest">
                  View Full Audit Logs
                </button>
              </div>
              <div className="p-4 md:p-8">
                {(fraudReports || []).length === 0 ? (
                  <div className="py-12 md:py-20 text-center flex flex-col items-center justify-center">
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 border border-slate-700/50 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                        <ShieldCheck size={32} className="text-emerald-500/50 md:w-10 md:h-10" />
                     </div>
                     <p className="text-slate-100 text-xs md:text-sm font-black uppercase tracking-widest mb-1">System Health: Green</p>
                     <p className="text-slate-500 text-[10px] md:text-xs font-medium">No recent incidents detected.</p>
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-black border-b border-slate-700/50">
                        <th className="pb-6">Activity Type</th>
                        <th className="pb-6">User Identity</th>
                        <th className="pb-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300">
                      {(fraudReports || []).map((row, i) => (
                        <tr key={i} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition group">
                          <td className="py-4 md:py-6">
                            <span className="font-bold text-slate-200 group-hover:text-pink-400 transition-colors uppercase tracking-tight">{row.type}</span>
                          </td>
                          <td className="py-4 md:py-6">
                            <div className="flex flex-col">
                              <span className="text-slate-300 font-bold">{row.user}</span>
                              <span className="text-slate-500 text-[10px]">{row.email}</span>
                            </div>
                          </td>
                          <td className="py-4 md:py-6 text-right">
                             <span className="px-3 md:px-5 py-1.5 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-lg md:rounded-xl text-[10px] font-black uppercase tracking-widest">Flagged</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout 
      role="admin" 
      menuItems={adminMenu} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      <div className="space-y-6 md:space-y-10">
        <header className="mb-6 md:mb-10 px-1 md:px-0">
          <h2 className="text-xl md:text-2xl font-black text-slate-200 uppercase tracking-tight">
            {activeTab === "overview" ? "System Insight" : activeTab === "users" ? "User Management" : "Job Management"}
          </h2>
          <p className="text-xs md:text-base text-slate-400 mt-1 font-bold">JobSphere real-time control panel</p>
        </header>
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
