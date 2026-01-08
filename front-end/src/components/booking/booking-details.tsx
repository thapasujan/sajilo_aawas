
 import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { memo, useState, useMemo } from "react";
import { useGetBookingByIdQuery, useUpdateBookingMutation } from "../../state-management/api/booking-api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { errorTypes } from "../../constant";
import MasterTable from "../Table/MasterTable";

interface BookingDetails {
  id: number;
  userId: number;
  roomId: number;
  userName: string;
  email: string;
  contact: string;
  hostelName: string;
  location: string;
  checkInDate: string;
  checkOutDate: string | null;
  payment: string;
  paymentStatus: string;
  status: string;
  people: number;
  createdAt: string;
  updatedAt: string;
}

export const BookingDetails = memo(() => {
  const { id } = useParams();
  const [filters, _] = useState({ page: 1, limit: 10 });

  const { data, isLoading, refetch } = useGetBookingByIdQuery(id);
  const [updateBooking, { isLoading: bookingUpdate }] = useUpdateBookingMutation();

  const bookings: BookingDetails[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data?.data ? data.data : [];
  }, [data]);

  const makeDecision = async (bookingId: number, status: string) => {
    await updateBooking({ id: bookingId.toString(), data: { status } }).then((resp) => {
      if (resp.error) {
        const error = resp.error as FetchBaseQueryError;
        toast.error("data" in error ? (error.data as errorTypes).message : "Server timed out. Please try again!");
      }
      if (resp.data) {
        toast.success("Successfully updated!");
        refetch();
      }
    });
  };

  if (isLoading || bookingUpdate) return <div className="p-8">Loading...</div>;
  if (!bookings.length) return <div className="p-8">No data has been found yet!!</div>;

  // Pagination slice
  const paginatedData = bookings.slice((filters.page - 1) * filters.limit, filters.page * filters.limit);

  const table = {
    columns: [
      { key: "userName", title: "User" },
      { key: "contact", title: "Contact" },
      { key: "email", title: "Email" },
      { key: "location", title: "Location" },
      { key: "checkInDate", title: "Arrival Date" },
      { key: "createdAt", title: "Submitted Date" },
      { key: "action", title: "Action" },
    ],
    rows: paginatedData.map((detail) => ({
      userName: detail.userName,
      contact: detail.contact,
      email: detail.email,
      location: detail.location,
      checkInDate: detail.checkInDate.slice(0, 10),
      createdAt: detail.createdAt.slice(0, 10),
      action: (
     <div className="flex gap-2">
  {/* If cancelled, just show Cancelled text */}
  {detail.status === "cancelled" ? (
    <p className="text-sm bg-red-500 px-2 py-1 rounded-md text-white font-semibold">
      Cancelled
    </p>
  ) : detail.paymentStatus === "Pending" ? (
    <button
      className="text-sm bg-love px-2 py-1 rounded-md text-white font-semibold hover:animate-glow"
      onClick={() => makeDecision(detail.id, "cancelled")}
    >
      Reject
    </button>
  ) : (
    <p className="text-sm bg-brand px-2 py-1 rounded-md text-white font-semibold">
      Booked
    </p>
  )}

  {detail.status === "pending" && (
    <button
      className="text-sm bg-brand px-2 py-1 rounded-md text-white font-semibold hover:animate-glow"
      onClick={() => makeDecision(detail.id, "confirmed")}
    >
      Accept
    </button>
  )}
</div>

      ),
    })),
  };

  return (
    <div className="p-4">
      <Toaster />
      <MasterTable
        rows={table.rows}
        columns={table.columns}
        loading={false}
        showCheckbox={false}
        // pagination={{
        //   currentPage: filters.page,
        //   totalPage: bookings.length > 0 ? Math.ceil(bookings.length / filters.limit) : 1,
        //   limit: filters.limit,
        //   onClick: ({ page, limit }) => {
        //     setFilters((prev) => ({
        //       ...prev,
        //       page: page || prev.page,
        //       limit: limit || prev.limit,
        //     }));
        //   },
        // }}
      />
    </div>
  );
});
