import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      verifyPayment(data);
    } else {
      setStatus("error");
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyPayment = async (encodedData) => {
    try {
      await axios.get(`http://localhost:5000/api/payments/verify-esewa?data=${encodedData}`);
      setStatus("success");
      toast.success("Payment verified and funds escrowed!");
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error("Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100">
        {verifying ? (
          <>
            <div className="inline-block p-6 bg-blue-50 text-blue-600 rounded-full mb-6">
              <RefreshCw size={48} className="animate-spin" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Verifying Payment</h2>
            <p className="text-gray-500 font-medium italic">Please wait while we secure your transaction...</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="inline-block p-6 bg-emerald-50 text-emerald-600 rounded-full mb-6">
              <CheckCircle size={64} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Payment Successful!</h2>
            <p className="text-gray-500 font-medium mb-10 italic">Your funds have been securely placed in escrow. You can now start collaborating with the freelancer.</p>
            <Link
              to="/employer-dashboard"
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          </>
        ) : (
          <>
            <div className="inline-block p-6 bg-red-50 text-red-600 rounded-full mb-6">
              <CheckCircle size={64} className="rotate-45" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-500 font-medium mb-10 italic">We couldn't verify your payment. Please contact support if your balance was deducted.</p>
            <Link
              to="/payments"
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            >
              Back to Billing <ArrowRight size={20} />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
