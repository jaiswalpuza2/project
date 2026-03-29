import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  CheckCircle, 
  Layout, 
  Edit3, 
  CreditCard, 
  Lock,
  Phone,
  Mail,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileDropdown = () => {
  const { user, logout, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateCompletion = () => {
    if (!user) return 0;
    const fields = [
      user.name,
      user.email,
      user.phone,
      user.bio,
      user.location,
      user.profileImage !== "no-photo.jpg",
      user.skills?.length > 0,
    ];
    const filledFields = fields.filter(field => field).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completion = calculateCompletion();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuItems = [
    { label: "Overview", icon: <Layout size={18} />, to: user?.role === "employer" ? "/employer-dashboard" : "/freelancer-dashboard" },
    { label: user?.role === "employer" ? "Billing" : "Financials", icon: <CreditCard size={18} />, to: "/payments" },
    { label: "Change Password", icon: <Lock size={18} />, to: "/change-password" },
    { label: "Log out", icon: <LogOut size={18} />, onClick: handleLogout, danger: true },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-800 transition-all duration-300 group"
      >
        <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold border-2 border-slate-700 shadow-sm ring-2 ring-transparent group-hover:ring-indigo-500 transition-all overflow-hidden relative">
          {user?.profileImage && user.profileImage !== "no-photo.jpg" ? (
            <img src={`http://localhost:5000${user.profileImage}`} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm uppercase">{user?.name?.[0]}</span>
          )}
          {user?.isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-[#0F172A] rounded-full p-0.5">
              <CheckCircle size={12} className="text-blue-400 fill-blue-400" />
            </div>
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-black text-slate-200 leading-none group-hover:text-indigo-400 transition-colors">{user?.name}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-slate-300 transition-colors">{user?.role}</p>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-[#1E293B] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-600/50 overflow-hidden z-[100]"
          >

            <div className="p-6 bg-[#0F172A]/50 border-b border-slate-600/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 bg-[#0F172A] rounded-2xl flex items-center justify-center text-indigo-400 font-black text-xl shadow-inner border border-slate-600/50 overflow-hidden uppercase">
                  {user?.profileImage && user.profileImage !== "no-photo.jpg" ? (
                    <img src={`http://localhost:5000${user.profileImage}`} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-[#E2E8F0] truncate tracking-tight">{user?.name}</h4>
                    {user?.isVerified && <CheckCircle size={14} className="text-blue-400 flex-shrink-0" />}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                      <Mail size={12} /> {user?.email}
                    </p>
                    {user?.phone && (
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Phone size={12} /> {user?.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Completion</span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase italic">{completion}%</span>
                </div>
                <div className="h-2 w-full bg-[#0F172A] shadow-inner rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 space-y-1">
              {menuItems.map((item, index) => (
                item.onClick ? (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 group ${
                      item.danger ? 'hover:bg-red-500/10 text-red-500' : 'hover:bg-slate-700/50 text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 font-bold text-sm">
                      <div className={`p-2 rounded-xl transition-colors ${item.danger ? 'bg-red-500/10' : 'bg-[#0F172A] group-hover:bg-[#1E293B] border border-slate-600/50 group-hover:border-slate-500'}`}>
                        {item.icon}
                      </div>
                      {item.label}
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-700/50 transition-all duration-200 group text-[#E2E8F0]"
                  >
                    <div className="flex items-center gap-3.5 font-bold text-sm">
                      <div className="p-2 bg-[#0F172A] border border-slate-600/50 group-hover:border-slate-500 group-hover:bg-[#1E293B] rounded-xl transition-colors">
                        {item.icon}
                      </div>
                      {item.label}
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
