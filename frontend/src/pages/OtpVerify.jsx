import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ShieldCheck, ArrowRight, RefreshCw, Mail } from "lucide-react";
import { motion } from "framer-motion";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { user, token, reloadUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already verified
  useEffect(() => {
    if (user?.isVerified) {
      navigate("/freelancer-dashboard");
    }
  }, [user, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
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
        "http://localhost:5000/api/auth/verify-otp",
        { otp: otpCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await reloadUser();
      toast.success("Email verified successfully!");
      navigate(user?.role === "employer" ? "/employer-dashboard" : "/freelancer-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/resend-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("New code sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 p-10 border border-gray-100 text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl mb-8">
          <ShieldCheck size={40} />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 mb-10">
          We've sent a 6-digit verification code to <br />
          <span className="font-bold text-gray-900">{user?.email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                className="w-12 h-16 text-2xl font-black text-center bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <>Verify Account <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            Didn't receive the code? {" "}
            <button 
              type="button"
              onClick={handleResend}
              className="text-blue-600 font-bold hover:underline"
            >
              Resend Code
            </button>
          </p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 text-gray-400 text-sm font-medium hover:text-gray-600 flex items-center justify-center gap-2 mx-auto"
          >
             <Mail size={16} /> Use a different email
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerify;
