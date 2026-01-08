
import { PAYMENT_URL } from "../../constant";
import { MainApi } from "./ApiGateway";

// Define response types
interface PaymentSuccessResponse {
  url: string;
}

interface PaymentErrorResponse {
  error: string;
  details?: any;
}

// Define verify payment request type WITH bookingId
// In your payment-api.ts file
interface VerifyPaymentRequest {
  pidx?: string | undefined | null;
  bookingId?: string | undefined | null;
  transactionId?: string | undefined | null;
  amount?: number | undefined | null;
        purchaseOrderId?: string | undefined | null;
        purchaseOrderName?: string | undefined | null;
}

export const paymentApi = MainApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate payment
    pay: builder.query<PaymentSuccessResponse | PaymentErrorResponse, number>({
      query: (amount) => ({
        url: `${PAYMENT_URL}/${amount}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
      transformErrorResponse: (response: any) => {
        return {
          error: response.data?.error || "Payment initialization failed",
          details: response.data?.details
        };
      },
    }),
    
    // Verify payment - use the correct type that includes bookingId
    verifyPayment: builder.mutation<
      any,
      VerifyPaymentRequest // Use the updated type here
    >({
      query: (body) => ({
        url: `${PAYMENT_URL}/verify`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
        body,
      }),
    }),
  }),
});

export const { usePayQuery, useVerifyPaymentMutation } = paymentApi;