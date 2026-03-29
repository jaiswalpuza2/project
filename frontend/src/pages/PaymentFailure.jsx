import Footer from "../components/Footer";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1E293B] shadow-lg shadow-black/20 rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-600">
          <div className="inline-block p-6 bg-red-500/20 text-red-400 rounded-full mb-6">
            <XCircle size={64} />
          </div>
          <h2 className="text-3xl font-black text-slate-200 mb-4 tracking-tight">Payment Cancelled</h2>
          <p className="text-slate-400 font-medium mb-10 italic">The transaction was cancelled or failed. Your funds haven't been deposited.</p>
          <Link
            to="/employer-dashboard"
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition shadow-lg shadow-indigo-500/20"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentFailure;
