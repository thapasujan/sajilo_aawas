// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import { useUpdateBookingMutation } from "../../state-management/api/booking-api";
// import { usePayQuery } from "../../state-management/api/payment-api";
// import { errorTypes } from "../../constant";
// import toast from "react-hot-toast";

interface propTypes {
  user: {
    id: string;
  };
  id: string;
  checkInDate: string;
  status: string;
  room: {
    ownerEmail: string;
    hostelName: string;
    email: string;
    contact: string;
    location: string;
    price: string;
    id: string;
  };
}

// export const Payment = (prop: propTypes) => {
//   const roomPrice = Number(prop.room.price); // 1200
// const { data } = usePayQuery(roomPrice * 10); // send paisa to Khalti

//   // const { data } = usePayQuery(prop.room.price);
//   console.log(data);
//   const [udpateBooking] = useUpdateBookingMutation();
//   const khalti = async () => {
//     window.location.href = data.url;
//     // const updatedData = {
//     //   ...prop,
//     //   paymentStatus: "FullPayment",
//     //    payment: prop.room.price,
//     // };
//     const updatedData = {
//   userId: prop.user.id,
//   roomId: prop.room.id,
//   paymentStatus: "FullPayment",
//   payment: Number(prop.room.price), // ensure numeric
// };

//     await udpateBooking({ id:prop.id, data: updatedData }).then((resp) => {
//       if (resp.error) {
//         console.log(resp.error);
//         const error = resp.error as FetchBaseQueryError;
//         if ("data" in error) {
//           toast.error((error.data as errorTypes).message as string);
//         }
//         if ("error" in error) {
//           toast.error("Server timed out. Please Try Again Later!!!");
//         }
//       }
//       if (resp.data) {

//         toast.success("Successfully updated!!");
//       }
//     });
//   };
//   return (
//     <button
//       type="submit"
//       className="rounded-md bg-brand px-3 py-2 text-sm text-other-white-100 font-semibold hover:animate-glow"
//       onClick={khalti}
//     >
//       Pay
//     </button>
//   );
// };
import { usePayQuery } from "../../state-management/api/payment-api";
import toast from "react-hot-toast";

// interface propTypes {
//   id: string;
//   room: {
//     price: string;
//   };
//   checkInDate?: string;
//   user?: string;
//   status: string;
// }







// export const Payment = (prop: propTypes) => {
//   const roomPrice = Number(prop.room.price);
//   // The response can be either success or error
//   const { data, isLoading, error: queryError } = usePayQuery(roomPrice);

//   const handlePayment = () => {
//     console.log("Payment details:", {
//       roomPrice,
//       bookingId: prop.id,
//       response: data
//     });

//     // Check for query error first
//     if (queryError) {
//       console.error("Payment query error:", queryError);
//       toast.error("Failed to initialize payment");
//       return;
//     }

//     // Check if data exists and has error property
//     if (data && 'error' in data) {
//       toast.error(data.error);
//       console.error("Payment error details:", data.details);
//       return;
//     }

//     // Check if data exists and has url property
//     if (data && 'url' in data) {
//       localStorage.setItem('pendingPaymentBookingId', prop.id);
//       localStorage.setItem('pendingPaymentAmount', roomPrice.toString());
//       window.location.href = data.url;
//     } else {
//       toast.error("Payment initialization failed - no URL received");
//     }
//   };

//   return (
//     <button
//       type="button"
//       className="rounded-md bg-brand px-3 py-2 text-sm text-other-white-100 font-semibold hover:animate-glow disabled:opacity-50"
//       onClick={handlePayment}
//       disabled={isLoading}
//     >
//       {isLoading ? "Processing..." : "Pay with Khalti"}
//     </button>
//   );
// };
export const Payment = (prop: propTypes) => {
  const roomPrice = Number(prop.room.price);
  const { data, isLoading, error: queryError } = usePayQuery(roomPrice);

  const handlePayment = () => {
    if (queryError) {
      toast.error("Failed to initialize payment");
      return;
    }

    if (data && 'error' in data) {
      toast.error(data.error);
      return;
    }

    if (data && 'url' in data) {
      // Store booking information for verification
      localStorage.setItem('pendingPaymentBookingId', prop.id);
      localStorage.setItem('pendingPaymentAmount', roomPrice.toString());
      localStorage.setItem('pendingPaymentRoom', JSON.stringify(prop.room));
      
      window.location.href = data.url;
    } else {
      toast.error("Payment initialization failed");
    }
  };

  return (
    <button
      type="button"
      className="rounded-md bg-brand px-2 py-1 text-sm text-other-white-100 font-semibold hover:animate-glow disabled:opacity-50"
      onClick={handlePayment}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Pay"}
    </button>
  );
};