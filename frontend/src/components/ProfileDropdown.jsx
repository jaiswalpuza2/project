import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
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
    { label: "Settings", icon: <Settings size={18} />, to: "/settings" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#1E293B] rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700/50 group"
      >
        <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 overflow-hidden font-black text-sm uppercase">
          {user?.profileImage && user.profileImage !== "no-photo.jpg" ? (
            <img src={`http://localhost:5000${user.profileImage}`} alt="" className="h-full w-full object-cover" />
          ) : (
            user?.name?.[0]
          )}
        </div>
        <div className="hidden md:block text-left pr-2">
          <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-1">{user?.name?.split(' ')[0]}</p>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-600/50 overflow-hidden z-[100] transition-colors duration-300"
          >
            <div className="p-6 bg-slate-50 dark:bg-[#0F172A]/50 border-b border-slate-200 dark:border-slate-600/50 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 bg-slate-100 dark:bg-[#0F172A] rounded-2xl flex items-center justify-center text-indigo-400 font-black text-xl shadow-inner border border-slate-200 dark:border-slate-600/50 overflow-hidden uppercase transition-colors duration-300">
                  {user?.profileImage && user.profileImage !== "no-photo.jpg" ? (
                    <img src={`http://localhost:5000${user.profileImage}`} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-slate-900 dark:text-[#E2E8F0] text-xl tracking-tight">{user?.name}</h4>
                    {user?.isVerified && <CheckCircle size={14} className="text-blue-400 flex-shrink-0" />}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                      <Mail size={12} /> {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Profile Completion</span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase italic">{completion}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-[#0F172A] shadow-inner rounded-full overflow-hidden transition-colors duration-300">
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
                <Link
                  key={index}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 group text-slate-600 dark:text-[#E2E8F0]"
                >
                  <div className="flex items-center gap-3.5 font-bold text-sm">
                    <div className="p-2 bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-600/50 group-hover:border-slate-300 dark:group-hover:border-slate-500 group-hover:bg-white dark:group-hover:bg-[#1E293B] rounded-xl transition-colors">
                      {item.icon}
                    </div>
                    {item.label}
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
                </Link>
              ))}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0F172A]/30 border-t border-slate-200 dark:border-slate-600/50 transition-colors duration-300">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-500/10 rounded-2xl transition-all active:scale-[0.98] border border-transparent hover:border-red-500/20"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
