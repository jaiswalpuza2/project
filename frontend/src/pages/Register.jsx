import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Lock, User, Briefcase, Sparkles, ChevronRight, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      toast.success("Account created! Please verify your email.");
      navigate("/verify-otp");
    } else {
      toast.error(result.message);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-10 bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-12 rounded-[2.5rem] border border-slate-600/50 transition-all duration-500 relative overflow-hidden group">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform hover:rotate-12">
                <Sparkles size={28} />
              </div>
              <span className="text-3xl font-black tracking-tight text-slate-200 uppercase">JobSphere</span>
            </div>
            <h2 className="text-center text-5xl font-black text-[#E2E8F0] tracking-tight">
              Join JobSphere
            </h2>
            <p className="mt-4 text-center text-base font-black text-slate-400 uppercase tracking-widest">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300">
                Sign in
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-6 w-6 text-slate-500" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="off"
                  className="appearance-none rounded-[1.25rem] relative block w-full px-14 py-5 bg-[#0F172A] border border-slate-600/50 placeholder-slate-600 text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-base font-black shadow-inner"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-slate-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  className="appearance-none rounded-[1.25rem] relative block w-full px-14 py-5 bg-[#0F172A] border border-slate-600/50 placeholder-slate-600 text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-base font-black shadow-inner"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-slate-500" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="appearance-none rounded-[1.25rem] relative block w-full px-14 py-5 bg-[#0F172A] border border-slate-600/50 placeholder-slate-600 text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-base font-black shadow-inner"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-6 w-6 text-slate-500" />
                </div>
                <select
                  name="role"
                  className="appearance-none rounded-[1.25rem] relative block w-full px-14 py-5 bg-[#0F172A] border border-slate-600/50 text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-base font-black shadow-inner cursor-pointer"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-black text-lg hover:brightness-110 transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group uppercase tracking-widest"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
