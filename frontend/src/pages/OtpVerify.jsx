import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, ArrowRight, RefreshCw, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { user, reloadUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isVerified) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return toast.error("Please enter 6-digit OTP");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { otp: otpCode });
      await reloadUser();
      toast.success("Email verified successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", {});
      toast.success("New code sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] flex flex-col transition-colors duration-500">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[3rem] p-12 border border-slate-100 dark:border-slate-600/50 text-center relative overflow-hidden group transition-colors"
        >

          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-3xl mb-8 shadow-xl shadow-indigo-500/20 relative z-10">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-[#E2E8F0] tracking-tight mb-3 relative z-10 transition-colors">Check your email</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-10 font-medium relative z-10 transition-colors">
          We've sent a 6-digit verification code to <br />
          <span className="font-bold text-slate-900 dark:text-[#E2E8F0] transition-colors">{user?.email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                className="w-12 h-16 md:w-14 md:h-16 text-2xl font-black text-center bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-[#E2E8F0] border border-slate-200 dark:border-slate-600/50 rounded-2xl focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#0F172A] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all shadow-inner transition-colors"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-5 rounded-3xl font-black text-lg hover:brightness-110 transition shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <>Verify Account <ArrowRight size={20} /></>}
          </button>
        </form>
        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-600/50 relative z-10 transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
            Didn't receive the code? {" "}
            <button 
              type="button"
              onClick={handleResend}
              className="text-indigo-600 dark:text-cyan-400 font-bold hover:underline transition-colors"
            >
              Resend Code
            </button>
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-slate-300 flex items-center justify-center gap-2 mx-auto transition transition-colors"
          >
             <Mail size={16} /> Use a different email
          </button>
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);
};
export default OtpVerify;
