import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  User, 
  Mail, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  ShieldCheck,
  IdCard,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to completely close your account? This action is permanent and cannot be undone.")) return;

    try {
      await axios.delete(import.meta.env.VITE_API_URL + "/api/auth/delete-account", {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Account successfully completely deleted.");
      logout();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to close account");
    }
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <div className="mb-10">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-3 text-base font-black text-slate-400 hover:text-cyan-400 transition-colors mb-8 group uppercase tracking-widest"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-5xl font-black text-slate-200 tracking-tight mb-3">Contact info</h1>
        <p className="text-lg text-slate-400 font-bold">Manage your personal information and account security.</p>
      </div>

      <div className="grid gap-8">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 border border-slate-600/50 relative overflow-hidden group hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                <IdCard size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-200 tracking-tight">Account</h2>
            </div>
            <Link 
              to="/edit-profile"
              className="p-3 bg-slate-700 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-2xl transition-all duration-300"
              title="Edit Profile"
            >
              <Edit3 size={20} />
            </Link>
          </div>

          <div className="space-y-8">

            <div className="group/item">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">User ID</p>
              <p className="text-xl font-black text-[#E2E8F0] tracking-tight font-mono bg-[#0F172A] px-8 py-6 rounded-2xl border border-slate-600/50 shadow-inner group-hover/item:border-indigo-500/30 transition-colors">
                {user?._id || "Loading..."}
              </p>
            </div>

            <div className="group/item">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Name</p>
              <div className="flex items-center gap-6 bg-[#0F172A] p-6 rounded-2xl border border-white/5 shadow-inner">
                <div className="h-14 w-14 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 border border-slate-600/50">
                  <User size={24} />
                </div>
                <p className="text-3xl font-black text-[#E2E8F0] tracking-tight">{user?.name}</p>
                {user?.isVerified && (
                  <ShieldCheck size={24} className="text-cyan-400" />
                )}
              </div>
            </div>

            <div className="group/item">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Email</p>
              <div className="flex items-center gap-6 bg-[#0F172A] p-6 rounded-2xl border border-white/5 shadow-inner">
                <div className="h-14 w-14 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 border border-slate-600/50">
                  <Mail size={24} />
                </div>
                <p className="text-3xl font-black text-[#E2E8F0] tracking-tight">{maskEmail(user?.email)}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-600 flex justify-between items-center">
            <button 
              onClick={handleDeleteAccount}
              className="text-sm font-black text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest flex items-center gap-2 group/btn"
             >
              Close my account
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">JobSphere Secure Account</p>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-violet-500/10 transition-colors duration-700" />
        </motion.div>

        <div className="p-8 bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] border border-slate-600/50 flex items-start gap-6">
          <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 className="text-xl font-black text-[#E2E8F0] mb-2 tracking-tight">Privacy & Security</h4>
            <p className="text-slate-400 leading-relaxed font-medium">
              Your account information is encrypted and securely stored. Masked data helps protect your privacy while browsing settings. For any changes to your core identity, please visit the profile editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
