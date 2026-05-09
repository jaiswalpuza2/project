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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center py-6 md:py-12 px-2 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-4 md:space-y-10 bg-white dark:bg-[#1E293B] shadow-2xl p-4 md:p-12 rounded-2xl md:rounded-[2.5rem] border border-slate-200 dark:border-slate-600/50 transition-all duration-500 relative overflow-hidden group">
          
          <div className="flex flex-col items-center">
            <h2 className="text-center text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
              Join JobSphere
            </h2>
            <p className="mt-2 md:mt-4 text-center text-[10px] md:text-base font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 dark:hover:text-cyan-300">
                Sign in
              </Link>
            </p>
          </div>

          <form className="mt-4 md:mt-8 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 md:space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 md:h-6 md:w-6 text-slate-500" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="off"
                  className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-xs md:text-base font-medium shadow-inner"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 md:h-6 md:w-6 text-slate-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-xs md:text-base font-medium shadow-inner"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 md:h-6 md:w-6 text-slate-500" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-xs md:text-base font-medium shadow-inner"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors z-20"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 md:h-6 md:w-6 text-slate-500" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 text-slate-900 dark:text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-xs md:text-base font-medium shadow-inner cursor-pointer"
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="employer">Employer</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center pointer-events-none">
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 md:py-5 px-4 border border-transparent text-sm md:text-lg font-black rounded-lg md:rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 focus:outline-none transition duration-150 shadow-xl shadow-indigo-500/20 uppercase tracking-widest disabled:opacity-70"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-4 w-4 md:h-6 md:w-6 text-indigo-200 group-hover:scale-110 transition-all" />
              </span>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
