import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Search, 
  User, 
  Layout,
  MessageSquare,
  Bell,
  Star,
  Sparkles,
  RefreshCw,
  CreditCard,
  Bookmark,
  Target
} from "lucide-react";
import NotificationDropdown from "../components/NotificationDropdown";

const FreelancerDashboard = () => {
  const { user, logout, token } = useAuth();
  const [recommendations, setRecommendations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('dashboard');

  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs/recommendations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-8 border-b">
          <h1 className="text-2xl font-bold text-blue-600">JobSphere</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Layout size={20} /> Dashboard
          </button>
          <Link to="/jobs" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
            <Search size={20} /> Find Jobs
          </Link>
          <Link to="/saved-jobs" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
            <Bookmark size={20} /> Saved Jobs
          </Link>
          <Link to="/my-applications" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition group">
            <Briefcase size={20} className="group-hover:text-blue-500 transition" /> My Applications
          </Link>
          <Link to="/messages" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
            <MessageSquare size={20} /> Messages
          </Link>
          <Link to="/resume-generator" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
            <Star size={20} /> AI Resume Builder
          </Link>
          <button 
            onClick={() => setActiveTab('matches')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition ${activeTab === 'matches' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Sparkles size={20} className="text-blue-500" /> AI Matches (Beta)
          </button>
          <Link to="/payments" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
            <CreditCard size={20} /> Financials
          </Link>
          <Link to="/edit-profile" className="flex items-center gap-3 p-3 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition">
            <User size={20} /> My Profile
          </Link>
          <Link to="/mentorship" className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition">
            <Target size={20} /> Skill Growth
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={logout}
            className="w-full p-3 text-left text-red-500 hover:bg-red-50 rounded-xl font-medium transition flex items-center gap-3"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}! </h2>
            <p className="text-gray-500 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              {user?.name?.[0]}
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { label: "Active Applications", value: "12", color: "blue" },
                { label: "Recommended Jobs", value: "24", color: "green" },
                { label: "Profile Views", value: "158", color: "purple" }
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Recommended Jobs Sections (Placeholder) */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">AI Job Matches</h3>
                <button onClick={() => setActiveTab('matches')} className="text-blue-600 font-semibold hover:underline">View All</button>
              </div>
              <div className="grid gap-4">
                {loading ? (
                  <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-blue-600" /></div>
                ) : recommendations.length > 0 ? (
                  recommendations.slice(0, 3).map((job, idx) => (
                    <Link to={`/jobs/${job._id}`} key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{job.title}</h4>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1 font-bold"><User size={14} /> {job.employer?.name}</span>
                            <span className="flex items-center gap-1"><Clock size={14} /> {job.category}</span>
                            <span className="flex items-center gap-1 text-green-600 font-bold"><DollarSign size={14} /> ${job.budget}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-10 bg-white rounded-2xl border text-center text-gray-500">
                    Update your skills to get AI matches!
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="text-blue-500" /> AI Matches (Beta)
            </h3>
            <p className="text-gray-500">Jobs matched to your profile using our AI recommendation engine.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {loading ? (
                  <div className="col-span-3 flex justify-center p-20"><RefreshCw className="animate-spin text-blue-600" /></div>
                ) : recommendations.length > 0 ? (
                  recommendations.map((job, idx) => (
                    <Link to={`/jobs/${job._id}`} key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 hover:shadow-lg transition flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Briefcase size={20} />
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Match</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 line-clamp-1">{job.title}</h4>
                        <p className="text-blue-600 font-bold mt-1">${job.budget}</p>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400">Update your profile to get more AI matches.</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FreelancerDashboard;
