import React, { useEffect, useRef } from "react";
const EsewaPayment = ({ esewaData }) => {
  const formRef = useRef(null);
  useEffect(() => {
    if (esewaData && formRef.current) {
      formRef.current.submit();
    }
  }, [esewaData]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600 font-bold italic">Redirecting to eSewa Gateway...</p>
      <form
        ref={formRef}
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        className="hidden"
      >
        <input type="hidden" name="amount" value={esewaData.amount} required />
        <input type="hidden" name="tax_amount" value={esewaData.tax_amount} required />
        <input type="hidden" name="total_amount" value={esewaData.total_amount} required />
        <input type="hidden" name="transaction_uuid" value={esewaData.transaction_uuid} required />
        <input type="hidden" name="product_code" value={esewaData.product_code} required />
        <input type="hidden" name="product_service_charge" value={esewaData.product_service_charge} required />
        <input type="hidden" name="product_delivery_charge" value={esewaData.product_delivery_charge} required />
        <input type="hidden" name="success_url" value={esewaData.success_url} required />
        <input type="hidden" name="failure_url" value={esewaData.failure_url} required />
        <input type="hidden" name="signed_field_names" value={esewaData.signed_field_names} required />
        <input type="hidden" name="signature" value={esewaData.signature} required />
      </form>
    </div>
  );
};
export default EsewaPayment;
