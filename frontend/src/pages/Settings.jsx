import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
import api from "../utils/api";
import { toast } from "react-toastify";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to completely close your account? This action is permanent and cannot be undone.")) return;

    try {
      await api.delete("/auth/delete-account");
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
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-200 tracking-tight mb-2 transition-colors">Contact info</h1>
        <p className="text-base text-slate-500 dark:text-slate-400 font-bold transition-colors">Manage your personal information and account security.</p>
      </div>

      <div className="grid gap-8">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-600/50 relative overflow-hidden group hover:shadow-indigo-500/10 transition-all duration-500 transition-colors"
        >
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 transition-colors">
                <IdCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-200 tracking-tight transition-colors">Account</h2>
            </div>
            <Link 
              to="/edit-profile"
              className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all duration-300 transition-colors"
              title="Edit Profile"
            >
              <Edit3 size={20} />
            </Link>
          </div>

          <div className="space-y-8">

            <div className="group/item">
              <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-1 transition-colors">User ID</p>
              <p className="text-base font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight font-mono bg-slate-50 dark:bg-[#0F172A] px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-600/50 shadow-inner group-hover/item:border-indigo-500/30 transition-colors">
                {user?._id || "Loading..."}
              </p>
            </div>

            <div className="group/item">
              <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-1 transition-colors">Name</p>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner transition-colors">
                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-600/50 transition-colors">
                  <User size={20} />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight transition-colors">{user?.name}</p>
                {user?.isVerified && (
                  <ShieldCheck size={20} className="text-emerald-500 dark:text-cyan-400 transition-colors" />
                )}
              </div>
            </div>

            <div className="group/item">
              <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-1 transition-colors">Email</p>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner transition-colors">
                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-600/50 transition-colors">
                  <Mail size={20} />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight transition-colors">{maskEmail(user?.email)}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-600 flex justify-between items-center transition-colors">
            <button 
              onClick={handleDeleteAccount}
              className="text-sm font-black text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors uppercase tracking-widest flex items-center gap-2 group/btn"
             >
              Close my account
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[12px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest transition-colors">JobSphere Secure Account</p>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-violet-500/10 transition-colors duration-700" />
        </motion.div>

        <div className="p-8 bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] border border-slate-100 dark:border-slate-600/50 flex items-start gap-6 transition-colors">
          <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900 dark:text-[#E2E8F0] mb-2 tracking-tight transition-colors">Privacy & Security</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium transition-colors">
              Your account information is encrypted and securely stored. Masked data helps protect your privacy while browsing settings. For any changes to your core identity, please visit the profile editor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
