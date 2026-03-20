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
      const res = await axios.get("http://localhost:5000/api/payments/my-payments", {
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
    <div className="min-h-screen bg-gray-50 p-10">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Financials</h1>
        <p className="text-gray-500">Track your earnings, escrowed funds, and transaction history.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-blue-200 flex flex-col justify-between">
          <div>
            <CreditCard size={32} className="mb-6 opacity-80" />
            <p className="text-blue-100 font-medium uppercase tracking-widest text-xs">Total Balance</p>
            <h2 className="text-4xl font-black mt-2">$12,450.00</h2>
          </div>
          <div className="mt-10 flex gap-4">
            <button className="flex-1 bg-white text-blue-600 py-3 rounded-2xl font-bold text-sm">Withdraw</button>
            <button className="flex-1 bg-blue-500 text-white py-3 rounded-2xl font-bold text-sm">Transfer</button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <ShieldCheck size={32} className="text-emerald-500 mb-6" />
            <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Escrowed Funds</p>
            <h2 className="text-4xl font-black mt-2 text-gray-900">$3,200.00</h2>
          </div>
          <p className="text-xs text-gray-400 mt-10 italic">Securely held until project completion.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <Clock size={32} className="text-orange-500 mb-6" />
            <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Pending Clearances</p>
            <h2 className="text-4xl font-black mt-2 text-gray-900">$850.00</h2>
          </div>
          <p className="text-xs text-orange-500 mt-10 font-bold">Expect funds by March 5th.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                <th className="px-8 py-4">Transaction ID</th>
                <th className="px-8 py-4">Project</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition cursor-default">
                    <td className="px-8 py-6 font-mono text-xs text-gray-400 uppercase">{p.transactionId}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-900">{p.job?.title}</p>
                      <p className="text-xs text-gray-400">Escrow Payment</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === "escrowed" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                      }`}>
                        {p.status === "escrowed" ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-gray-900">
                      ${p.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
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
