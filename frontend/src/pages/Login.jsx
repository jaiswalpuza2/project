import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight, RefreshCw, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, forgotPasswordOTP, loginWithOTP } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    const result = await forgotPasswordOTP(email);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
      setOtpSent(true);
    } else {
      toast.error(result.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
    setLoading(true);
    const result = await loginWithOTP(email, otp);
    setLoading(false);
    if (result.success) {
      toast.success("Login successful!");
      navigate("/dashboard");
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
              {showOtpLogin ? "OTP Login" : "Welcome Back"}
            </h2>
            <p className="mt-2 md:mt-4 text-center text-[10px] md:text-base font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {showOtpLogin ? (
                <button 
                  onClick={() => { setShowOtpLogin(false); setOtpSent(false); }}
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Back to password login
                </button>
              ) : (
                <>
                  Or{" "}
                  <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 tracking-wide">
                    create a new account
                  </Link>
                </>
              )}
            </p>
          </div>

          {!showOtpLogin ? (
            <form className="mt-4 md:mt-8 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3 md:space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-xs md:text-sm font-medium shadow-inner"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-[#E2E8F0] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-xs md:text-sm font-medium shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors z-20"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowOtpLogin(true)}
                  className="font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest text-[9px] md:text-xs"
                >
                  Forgot your password? Login with OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 md:py-5 px-4 border border-transparent text-sm md:text-lg font-black rounded-lg md:rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 transition duration-150 shadow-xl shadow-indigo-500/20 uppercase tracking-widest disabled:opacity-70"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-4 w-4 md:h-5 md:w-5 text-indigo-200 group-hover:scale-110 transition-all" />
                </span>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form className="mt-4 md:mt-8 space-y-4 md:space-y-6" onSubmit={otpSent ? handleOtpSubmit : handleSendOtp}>
               <div className="space-y-3 md:space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={otpSent}
                    className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 placeholder-slate-400 dark:placeholder-slate-600 text-slate-900 dark:text-[#E2E8F0] focus:outline-none transition-all text-xs md:text-sm font-medium shadow-inner disabled:opacity-60"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {otpSent && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                      <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      required
                      className="appearance-none rounded-lg md:rounded-[1.25rem] relative block w-full px-10 md:px-14 py-2 md:py-5 bg-slate-50 dark:bg-[#0F172A] border border-indigo-500/30 placeholder-slate-400 text-slate-900 dark:text-[#E2E8F0] focus:outline-none transition-all text-xs md:text-sm font-medium shadow-inner"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 md:py-5 px-4 border border-transparent text-sm md:text-lg font-black rounded-lg md:rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 transition duration-150 shadow-xl shadow-indigo-500/20 uppercase tracking-widest disabled:opacity-70"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {otpSent ? <LogIn className="h-4 w-4 md:h-5 md:w-5 text-indigo-200" /> : <RefreshCw className={`h-4 w-4 md:h-5 md:w-5 text-indigo-200 ${loading ? 'animate-spin' : ''}`} />}
                </span>
                {loading ? "Processing..." : (otpSent ? "Verify & Login" : "Send OTP")}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
