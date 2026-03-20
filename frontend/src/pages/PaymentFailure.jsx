import React from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100">
        <div className="inline-block p-6 bg-red-50 text-red-600 rounded-full mb-6">
          <XCircle size={64} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Payment Cancelled</h2>
        <p className="text-gray-500 font-medium mb-10 italic">The transaction was cancelled or failed. Your funds haven't been deposited.</p>
        <Link
          to="/employer-dashboard"
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;
