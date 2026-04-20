import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, ArrowRight, RefreshCw, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { user, token, reloadUser } = useAuth();
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
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/verify-otp",
        { otp: otpCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/resend-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("New code sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    }
  };
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] rounded-[3rem] p-12 border border-slate-600/50 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] rotate-12 group-hover:rotate-45 transition-transform duration-1000">
            <Sparkles size={160} />
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-3xl mb-8 shadow-xl shadow-indigo-500/20 relative z-10">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-4xl font-black text-[#E2E8F0] tracking-tight mb-3 relative z-10">Check your email</h2>
        <p className="text-slate-400 mb-10 font-medium relative z-10">
          We've sent a 6-digit verification code to <br />
          <span className="font-bold text-[#E2E8F0]">{user?.email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                className="w-12 h-16 md:w-14 md:h-16 text-2xl font-black text-center bg-[#0F172A] text-[#E2E8F0] border border-slate-600/50 rounded-2xl focus:border-indigo-500/50 focus:bg-[#0F172A] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all shadow-inner"
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
        <div className="mt-10 pt-8 border-t border-slate-600/50 relative z-10">
          <p className="text-slate-400 text-sm">
            Didn't receive the code? {" "}
            <button 
              type="button"
              onClick={handleResend}
              className="text-cyan-400 font-bold hover:underline"
            >
              Resend Code
            </button>
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 text-slate-400 text-sm font-medium hover:text-slate-300 flex items-center justify-center gap-2 mx-auto transition"
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
