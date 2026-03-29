import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setLoading(true);
    try {
      await axios.put("http://localhost:5000/api/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Password changed successfully!");
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-10">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-400 transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-black text-slate-200 tracking-tight mb-2">Change Password</h1>
        <p className="text-slate-400 font-medium">Update your account password to keep your account secure.</p>
      </div>

      <div className="bg-[#1E293B] shadow-lg shadow-black/20 rounded-[2.5rem] p-8 shadow-sm border border-slate-600 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 bg-[#0F172A] rounded-2xl flex items-center justify-center text-indigo-400 shadow-sm border border-slate-600">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-200 tracking-tight">Security</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full pl-11 pr-10 py-3 bg-[#0F172A] border border-slate-600 rounded-xl text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-[#0F172A] transition-all placeholder-slate-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors z-20"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full pl-11 pr-10 py-3 bg-[#0F172A] border border-slate-600 rounded-xl text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-[#0F172A] transition-all placeholder-slate-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors z-20"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="w-full pl-11 pr-10 py-3 bg-[#0F172A] border border-slate-600 rounded-xl text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-[#0F172A] transition-all placeholder-slate-500"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors z-20"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black rounded-2xl hover:brightness-110 shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
