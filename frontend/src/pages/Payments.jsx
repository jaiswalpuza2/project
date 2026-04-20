import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { CreditCard, ShieldCheck, Clock, CheckCircle, ArrowUpRight } from "lucide-react";

const Payments = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/api/payments/my-payments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <header className="mb-10">
        <h1 className="text-2xl font-black text-slate-200 mb-2">Financials</h1>
        <p className="text-slate-400">Track your earnings, escrowed funds, and transaction history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-indigo-500/90 to-violet-700/90 p-10 rounded-[2.5rem] text-white shadow-[0_20px_50px_-12px_rgba(79,70,229,0.3)] flex flex-col justify-between border border-white/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 bg-white/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
          <div>
            <CreditCard size={36} className="mb-8 text-white/80" />
            <p className="text-indigo-100 font-black uppercase tracking-[0.2em] text-[10px]">Total Balance</p>
            <h2 className="text-2xl font-black mt-3 tracking-tight">NRP 16,55,850.00</h2>
          </div>
          <div className="mt-12 flex gap-4">
            <button className="flex-1 bg-white text-indigo-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">Withdraw</button>
            <button className="flex-1 bg-white/20 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 backdrop-blur-md hover:bg-white/30 active:scale-95 transition-all">Transfer</button>
          </div>
        </div>

        <div className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-10 rounded-[2.5rem] border border-slate-600/50 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500">
          <div>
            <div className="h-14 w-14 bg-[#0F172A] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner mb-8 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Escrowed Funds</p>
            <h2 className="text-2xl font-black mt-3 text-[#E2E8F0] tracking-tight">NRP 4,25,600.00</h2>
          </div>
          <p className="text-[10px] text-slate-500 mt-12 font-black uppercase tracking-widest">Securely held until project completion</p>
        </div>

        <div className="bg-[#1E293B] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-10 rounded-[2.5rem] border border-slate-600/50 flex flex-col justify-between group hover:border-amber-500/30 transition-all duration-500">
          <div>
            <div className="h-14 w-14 bg-[#0F172A] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner mb-8 group-hover:scale-110 transition-transform">
              <Clock size={32} className="text-amber-400" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Pending Clearances</p>
            <h2 className="text-2xl font-black mt-3 text-[#E2E8F0] tracking-tight">NRP 1,13,050.00</h2>
          </div>
          <p className="text-[10px] text-amber-500/80 mt-12 font-black uppercase tracking-[0.15em]">Expect funds by March 5th</p>
        </div>
      </div>

      <div className="bg-[#1E293B] shadow-lg shadow-black/20 rounded-[2.5rem] border border-slate-600 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-600">
          <h3 className="text-xl font-bold text-slate-200">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50">
              <tr className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                <th className="px-8 py-4">Transaction ID</th>
                <th className="px-8 py-4">Project</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-700/30 transition cursor-default">
                    <td className="px-8 py-6 font-mono text-xs text-slate-400 uppercase">{p.transactionId}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-200">{p.job?.title}</p>
                      <p className="text-xs text-slate-400">Escrow Payment</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === "escrowed" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {p.status === "escrowed" ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-slate-200">
                      NRP {(p.amount * 133).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400">
                    No transactions found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
