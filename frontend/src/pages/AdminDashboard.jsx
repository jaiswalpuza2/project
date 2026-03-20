import React, { useState, useEffect } from "react";
import { Users, FileText, Activity, AlertCircle, BarChart3, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFraudReports();
  }, []);

  const fetchFraudReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/fraud-reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFraudReports(res.data.data);
    } catch (err) {
      toast.error("Failed to load fraud reports");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Users", value: "1,284", icon: <Users className="text-blue-600" />, trend: "+12%" },
    { label: "Active Jobs", value: "452", icon: <FileText className="text-purple-600" />, trend: "+5%" },
    { label: "Reported Issues", value: fraudReports.length.toString(), icon: <AlertCircle className="text-red-600" />, trend: fraudReports.length > 0 ? "Action Req" : "Safe" },
    { label: "Platform Revenue", value: "$12.5k", icon: <BarChart3 className="text-green-600" />, trend: "+18%" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-400" size={24} />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-slate-400">
          <a href="#" className="flex items-center gap-3 p-3 bg-slate-800 text-white rounded-xl font-medium transition">
            <Activity size={20} /> Overview
          </a>
          <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition">
            <Users size={20} /> Manage Users
          </a>
          <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 hover:text-white rounded-xl font-medium transition">
            <FileText size={20} /> Job Posts
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-gray-900">System Overview</h2>
          <p className="text-gray-500 mt-1">Real-time platform metrics and activity logs.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-2xl">{stat.icon}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith("+") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Recent Platform Activities</h3>
            <button className="text-sm text-blue-600 font-bold">View Audit Logs</button>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ) : fraudReports.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">No suspicious activity detected.</p>
            ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-widest font-bold border-b">
                  <th className="pb-4">Activity</th>
                  <th className="pb-4">User</th>
                  <th className="pb-4">Time</th>
                  <th className="pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600">
                {fraudReports.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                    <td className="py-4 font-medium text-gray-900">{row.type}</td>
                    <td className="py-4">{row.user} ({row.email})</td>
                    <td className="py-4 text-gray-400">{new Date(row.timestamp).toLocaleString()}</td>
                    <td className="py-4 text-right flex flex-col items-end gap-1">
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">Flagged</span>
                      <span className="text-xs text-gray-400">{row.details}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
