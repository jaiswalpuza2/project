import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const NotificationDropdown = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };
  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };
  const unreadCount = (notifications || []).filter(n => !n.isRead).length;
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 rounded-xl transition-all relative active:scale-95 group"
      >
        <Bell size={24} className="group-hover:rotate-12 transition-transform" />
        {(notifications || []).length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 text-[11px] flex items-center justify-center bg-indigo-500 text-white font-black rounded-full border-2 border-[#1E293B] shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed md:absolute inset-x-4 md:inset-x-auto md:right-0 top-20 md:top-full mt-2 md:mt-4 w-auto md:w-96 bg-[#0F172A]/95 backdrop-blur-2xl rounded-[2rem] md:rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-700/50 z-[60] overflow-hidden flex flex-col max-h-[70vh] md:max-h-[32rem] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 md:p-6 bg-slate-800/30 border-b border-slate-700/50 flex justify-between items-center">
            <div>
              <h3 className="text-lg md:text-xl font-black text-slate-100 tracking-tight">Notifications</h3>
              <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Activity Updates</p>
            </div>
            {notifications.length > 0 && (
                <button 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`text-[10px] md:text-xs font-black transition uppercase tracking-widest px-4 md:px-5 py-2 md:py-2.5 rounded-xl border active:scale-95 ${
                  unreadCount > 0 
                  ? 'text-white bg-indigo-500 hover:bg-indigo-600 border-indigo-400/20 shadow-lg shadow-indigo-500/20' 
                  : 'text-white/30 bg-slate-800/50 border-slate-700/50 cursor-not-allowed'
                }`}
              >
                Mark all
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
                <div className="p-10 md:p-16 flex flex-col items-center justify-center gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <p className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest">Loading...</p>
                </div>
            ) : notifications.length > 0 ? (
              <ul className="divide-y divide-slate-800/50">
                {(notifications || []).map((notif) => (
                  <li 
                    key={notif._id} 
                    className={`p-4 md:p-5 hover:bg-slate-800/40 transition cursor-pointer flex gap-3 md:gap-4 relative group ${!notif.isRead ? 'bg-indigo-500/10' : ''}`}
                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                  >
                    {!notif.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                    )}
                     <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                      notif.type === 'message' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' :
                      notif.type === 'application' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                      notif.type === 'payment' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                    }`}>
                      {notif.type === 'message' && <HelpCircle size={20} className="md:w-6 md:h-6" />}
                      {notif.type === 'application' && <HelpCircle size={20} className="md:w-6 md:h-6" />}
                      {notif.type === 'payment' && <Check size={20} className="md:w-6 md:h-6" />}
                      {notif.type === 'system' && <Bell size={20} className="md:w-6 md:h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start mb-1.5 md:mb-2">
                        <span className={`text-[9px] md:text-xs font-black uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-md ${
                          notif.type === 'message' ? 'text-purple-400 bg-purple-500/10' :
                          notif.type === 'application' ? 'text-emerald-400 bg-emerald-500/10' :
                          notif.type === 'payment' ? 'text-amber-400 bg-amber-500/10' :
                          'text-slate-500 bg-slate-500/10'
                        }`}>
                          {notif.type}
                        </span>
                        <span className="text-[9px] md:text-xs text-slate-500 font-black bg-slate-800/50 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                       <p className={`text-sm md:text-base leading-relaxed ${!notif.isRead ? 'font-black text-slate-100' : 'text-slate-400 font-bold opacity-80'}`}>
                        {notif.message}
                      </p>
                       <div className="flex items-center gap-1.5 md:gap-2 mt-2 md:mt-3">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-slate-700"></div>
                        <p className="text-[9px] md:text-xs text-slate-600 font-black uppercase tracking-widest">
                          {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-10 md:p-16 text-center text-slate-500 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-800/50 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-8 border border-slate-700/50 shadow-inner">
                  <Bell size={32} className="text-slate-600/50 md:w-12 md:h-12" />
                </div>
                <h4 className="text-slate-200 font-black mb-2 md:mb-3 uppercase tracking-widest text-xs md:text-sm">All caught up!</h4>
                <p className="text-sm md:text-base font-black text-slate-500 max-w-[250px] mx-auto leading-relaxed">No unread notifications.</p>
              </div>
            )}
          </div>
           <div className="p-4 md:p-6 bg-slate-800/30 border-t border-slate-700/50 text-center flex items-center justify-center gap-3 md:gap-4 group/footer">
             <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                System Online
             </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationDropdown;
