import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyPaymentMutation } from "../../state-management/api/payment-api";
import toast from "react-hot-toast";

type PaymentStatus = "verifying" | "success" | "failed";

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [status, setStatus] = useState<PaymentStatus>("verifying");


  useEffect(() => {
    const verifyPaymentProcess = async () => {
      const pidx = searchParams.get("pidx") ?? undefined;
      const transactionId = searchParams.get("transaction_id") ?? undefined;
      const purchaseOrderId = searchParams.get("purchase_order_id") ?? undefined;
      const purchaseOrderName = searchParams.get("purchase_order_name") ?? undefined;
      const amountPaisa = searchParams.get("amount");
      const statusParam = searchParams.get("status");

      const bookingId = localStorage.getItem("pendingPaymentBookingId") ?? undefined;

      console.log("Payment callback parameters:", {
        pidx, transactionId, purchaseOrderId, purchaseOrderName, amountPaisa, statusParam, bookingId
      });

      if (!pidx || !bookingId) {
        setStatus("failed");
        toast.error("Missing payment information. Please contact support.");
        return;
      }

      // Handle cancelled or failed directly from URL
      if (statusParam === "Cancelled" || statusParam === "Failed") {
        setStatus("failed");
        toast.error("Payment was cancelled or failed.");
        return;
      }

      try {
 const result = await verifyPayment({
  pidx,
  bookingId,
  transactionId,
  purchaseOrderId,
  purchaseOrderName
}).unwrap();
console.log("Calling verifyPayment with payload:", {
  pidx, bookingId, transactionId, purchaseOrderId, purchaseOrderName
});

        console.log("Verification result:", result);

        if (result.success || result.status === "Completed") {
          setStatus("success");
          toast.success("Payment verified successfully!");

          // Clean localStorage
          localStorage.removeItem("pendingPaymentBookingId");
          localStorage.removeItem("pendingPaymentAmount");
          localStorage.removeItem("pendingPaymentRoom");

          // Redirect after 3 seconds
          setTimeout(() => navigate("/profile/your-booking"), 3000);
        } else if (result.status === "Pending" || result.status === "Initiated") {
          setStatus("verifying");
          toast("Payment is being processed. Please wait...", { icon: "⏳", duration: 5000 });
        } else {
          setStatus("failed");
          toast.error(result.message || "Payment verification failed.");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setStatus("failed");
        toast.error(err?.data?.message || "Payment verification failed. Contact support.");
      }
    };

    verifyPaymentProcess();
  }, [searchParams, verifyPayment, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
        {status === "verifying" && (
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we verify your payment.</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment has been verified and your booking is confirmed.</p>
            <p className="text-sm text-gray-500">Redirecting to your bookings...</p>
          </div>
        )}
        {status === "failed" && (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Issue</h2>
            <p className="text-gray-600 mb-4">There was an issue processing your payment. Please try again or contact support.</p>
            <button onClick={() => navigate("/profile/your-booking")} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Back to Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
