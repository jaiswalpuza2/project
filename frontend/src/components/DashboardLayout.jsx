import React from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Briefcase, 
  Search, 
  User, 
  Layout,
  MessageSquare,
  Star,
  Sparkles,
  CreditCard,
  Bookmark,
  Target,
  Plus,
  Activity,
  Users,
  FileText,
  Bot,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import Footer from "./Footer";

const DashboardLayout = ({ children, setActiveTab, activeTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const freelancerLinks = [
    { to: "/freelancer-dashboard", icon: <Layout size={24} />, label: "Dashboard" },
    { to: "/jobs", icon: <Search size={24} />, label: "Find Jobs" },
    { to: "/saved-jobs", icon: <Bookmark size={24} />, label: "Saved Jobs" },
    { to: "/my-applications", icon: <Briefcase size={24} />, label: "My Applications" },
    { to: "/messages", icon: <MessageSquare size={24} />, label: "Messages" },
    { to: "/resume-generator", icon: <Star size={24} />, label: "AI Resume Builder" },
    { to: "/ai-chatbot", icon: <Bot size={24} />, label: "AI Chatbot" },
    { to: "/payments", icon: <CreditCard size={24} />, label: "Financials" },
    { to: "/edit-profile", icon: <User size={24} />, label: "My Profile" },
    { to: "/mentorship", icon: <Target size={24} />, label: "Skill Growth" },
  ];

  const employerLinks = [
    { to: "/employer-dashboard", icon: <Layout size={24} />, label: "Dashboard" },
    { to: "/jobs", icon: <Search size={24} />, label: "Browse Jobs" },
    { to: "/messages", icon: <MessageSquare size={24} />, label: "Messages" },
    { to: "/payments", icon: <CreditCard size={24} />, label: "Billing" },
    { to: "/post-job", icon: <Plus size={24} />, label: "Post a Job" },
    { to: "/edit-profile", icon: <User size={24} />, label: "My Profile" },
  ];

  const adminLinks = [
    { to: "/admin", icon: <Activity size={24} />, label: "Overview" },
    { to: "/admin", icon: <Users size={24} />, label: "Manage Users", activeTab: "users" },
    { to: "/admin", icon: <FileText size={24} />, label: "Job Posts", activeTab: "jobs" },
    { to: "/admin", icon: <Sparkles size={24} />, label: "Insights Blog", activeTab: "blogs" },
  ];


  const links = user?.role === "admin" ? adminLinks : user?.role === "employer" ? employerLinks : freelancerLinks;

  return (
    <div className="min-h-screen bg-[#0F172A] flex overflow-x-hidden">
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0F172A] text-slate-200 border-r border-slate-700/50 flex flex-col no-print h-full transition-all duration-300 ease-in-out shadow-2xl shadow-black/30 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={22} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">JobSphere</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-xl transition text-slate-400"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {links.map((link) => (
            <NavLink
              key={link.activeTab ? `${link.to}-${link.activeTab}` : link.to}
              to={link.to}
              onClick={() => {
                setIsSidebarOpen(false);
                if (link.activeTab && typeof setActiveTab === 'function') {
                  setActiveTab(link.activeTab);
                } else if (!link.activeTab && typeof setActiveTab === 'function' && link.to.includes('admin')) {
                   setActiveTab('overview');
                }
              }}
              className={({ isActive }) => {
                const isItemActive = user?.role === "admin" 
                  ? (link.activeTab ? activeTab === link.activeTab : activeTab === "overview")
                  : isActive;

                return `flex items-center gap-4 p-4 rounded-xl font-black text-base transition ${
                  isItemActive 
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`;
              }}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-72 min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
        <header className="bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-700/50 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center no-print w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-slate-800 rounded-xl transition text-slate-400 border border-slate-700"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {links.find(l => 
                l.to === "/" ? location.pathname === "/" : location.pathname.startsWith(l.to)
              )?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 bg-[#111827]/30">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
