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
            {showOtpLogin ? "OTP Login" : "Welcome Back"}
          </h2>
          <p className="mt-4 text-center text-base font-black text-slate-400 uppercase tracking-widest">
            {showOtpLogin ? (
              <button 
                onClick={() => { setShowOtpLogin(false); setOtpSent(false); }}
                className="font-medium text-cyan-400 hover:text-cyan-300"
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
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  className="appearance-none rounded-none relative block w-full px-12 py-4 bg-[#0F172A] border border-slate-600/50 placeholder-slate-600 text-[#E2E8F0] rounded-[1.25rem] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all sm:text-sm font-bold shadow-inner"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="appearance-none rounded-none relative block w-full px-14 py-5 bg-[#0F172A] border border-slate-600/50 placeholder-slate-600 text-[#E2E8F0] rounded-[1.25rem] focus:outline-none focus:ring-0 focus:border-indigo-500/50 transition-all text-base font-black shadow-inner mt-4"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors z-20"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-base">
                <button
                  type="button"
                  onClick={() => setShowOtpLogin(true)}
                  className="font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest text-xs"
                >
                  Forgot your password? Login with OTP
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition duration-150 ease-in-out shadow-xl shadow-indigo-500/20 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-indigo-200 group-hover:scale-110 group-hover:text-white transition-all" />
                </span>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={otpSent ? handleOtpSubmit : handleSendOtp}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  disabled={otpSent}
                  className={`appearance-none rounded-none relative block w-full px-10 py-3 bg-[#0F172A] border border-slate-600 placeholder-slate-500 text-slate-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${otpSent ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {otpSent && (
                <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="appearance-none rounded-none relative block w-full px-10 py-3 bg-[#0F172A] border border-slate-600 placeholder-slate-500 text-slate-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm font-bold tracking-[0.5em] text-center"
                    placeholder="ENTER 6-DIGIT OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-black rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition duration-150 ease-in-out shadow-xl shadow-indigo-500/20 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {otpSent ? (
                    <ArrowRight className="h-5 w-5 text-indigo-200 group-hover:text-white" />
                  ) : (
                    <RefreshCw className={`h-5 w-5 text-indigo-200 group-hover:text-white ${loading ? "animate-spin" : ""}`} />
                  )}
                </span>
                {loading 
                  ? (otpSent ? "Verifying..." : "Sending OTP...") 
                  : (otpSent ? "Sign in with OTP" : "Send OTP")}
              </button>
            </div>
            {otpSent && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-sm font-bold text-cyan-400 hover:text-cyan-300"
                >
                  Didn't receive code? Resend
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
    <Footer />
  </div>
);
};
export default Login;
