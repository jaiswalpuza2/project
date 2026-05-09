import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { CreditCard, ShieldCheck, Clock, CheckCircle, ArrowUpRight } from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments/my-payments");
      setPayments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-12 max-w-full overflow-x-hidden">
      <header className="mb-6 md:mb-8 transition-all">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-200 mb-1 transition-colors">Financials</h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors">Track your earnings, escrowed funds, and transaction history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-600/50 flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-500 transition-colors">
          <div>
            <div className="h-14 w-14 bg-slate-50 dark:bg-[#0F172A] rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-inner mb-8 group-hover:scale-110 transition-transform transition-colors">
              <ShieldCheck size={32} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] transition-colors">Escrowed Funds</p>
            <h2 className="text-base md:text-xl lg:text-2xl font-black mt-3 text-slate-900 dark:text-[#E2E8F0] tracking-tight transition-colors">NPR 1,00,00,000.00</h2>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-10 font-black uppercase tracking-widest transition-colors">Securely held until project completion</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-600/50 flex flex-col justify-between group hover:border-amber-500/30 transition-all duration-500 transition-colors">
          <div>
            <div className="h-14 w-14 bg-slate-50 dark:bg-[#0F172A] rounded-2xl flex items-center justify-center border border-slate-100 dark:border-white/5 shadow-inner mb-8 group-hover:scale-110 transition-transform transition-colors">
              <Clock size={32} className="text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] transition-colors">Pending Clearances</p>
            <h2 className="text-base md:text-xl lg:text-2xl font-black mt-3 text-slate-900 dark:text-[#E2E8F0] tracking-tight transition-colors">NPR 1,13,050.00</h2>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-500/80 mt-10 font-black uppercase tracking-[0.15em] transition-colors">Expect funds by March 5th</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] shadow-xl dark:shadow-black/20 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-600 overflow-hidden transition-colors">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-600 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 transition-colors">Recent Transactions</h3>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700/50">
          {payments.length > 0 ? (
            payments.map((p) => (
              <div key={p._id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-sm text-slate-900 dark:text-slate-200 transition-colors truncate">{p.job?.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 transition-colors uppercase tracking-widest mt-1">Escrow Payment</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black transition-colors shrink-0 ${
                    p.status === "escrowed" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {p.status === "escrowed" ? <Clock size={10} /> : <CheckCircle size={10} />}
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Transaction ID</p>
                    <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 break-all">{p.transactionId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-base text-slate-900 dark:text-slate-200 transition-colors">
                      NPR {(p.amount * 133).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400 transition-colors">No transactions found.</div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 transition-colors">
              <tr className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                <th className="px-8 py-4">Transaction ID</th>
                <th className="px-8 py-4">Project</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 transition-colors">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition cursor-default transition-colors">
                    <td className="px-8 py-8 font-mono text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase transition-colors">{p.transactionId}</td>
                    <td className="px-8 py-6">
                      <p className="font-black text-sm md:text-lg text-slate-900 dark:text-slate-200 transition-colors">{p.job?.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Escrow Payment</p>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-colors ${
                        p.status === "escrowed" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}>
                        {p.status === "escrowed" ? <Clock size={14} /> : <CheckCircle size={14} />}
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-base md:text-xl text-slate-900 dark:text-slate-200 transition-colors">
                      NPR {(p.amount * 133).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-500 dark:text-slate-400 transition-colors">
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
