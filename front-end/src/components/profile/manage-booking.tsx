import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  useGetAllBookingQuery,
  useUpdateBookingMutation,
} from "../../state-management/api/booking-api";
import { LoaderSpinner } from "../../units";
import { user } from "../../state-management/local/auth";
import { errorTypes } from "../../constant";
import { memo, useMemo, useState } from "react";
import MasterTable from "../Table/MasterTable";
import { get } from "lodash";
import { Status } from "../Table/Interface/Status";
import { removeNotification } from "../../state-management/redux/notificationSlice";

interface BookingUser {
  userName: string;
  email: string;
  contact: string;
  address: string;
  id: string;
}

interface BookingRoom {
  ownerEmail: string;
  hostelName: string;
  price: string;
  id: string;
}

interface BookingType {
  id: string;
  user: BookingUser;
  room: BookingRoom;
  checkInDate: string;
  createdAt: string;
  paymentStatus: string;
  status: string;
}

export const ManageBookings = memo(() => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
  });

  // pass filters to backend
  const { data, isLoading, refetch } = useGetAllBookingQuery(filters);

  const dispatch = useDispatch();
  const [updateBooking, { isLoading: bookingUpdate }] = useUpdateBookingMutation();
  const userInfo = useSelector(user);
  const navigate = useNavigate();

  // Filter bookings for current owner
  const ownerHostelBookings = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter(
      (booking: BookingType) =>
        booking.room.ownerEmail === userInfo?.email &&
        booking.status !== "cancelled"
    );
  }, [data, userInfo?.email]);

  // Check if there are no results after search
  const hasSearchFilters = useMemo(() => {
    return filters.search !== "" || filters.status !== "";
  }, [filters.search, filters.status]);

  const noResultsAfterSearch = useMemo(() => {
    return hasSearchFilters && ownerHostelBookings.length === 0;
  }, [hasSearchFilters, ownerHostelBookings.length]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      search: "",
      status: "",
    });
  };

  // Handle status update
  const makeDecision = async (status: string, id: string) => {
    try {
      const resp = await updateBooking({ id, data: { status } });

      if ("error" in resp) {
        const error = resp.error as FetchBaseQueryError;
        if ("data" in error) {
          toast.error((error.data as errorTypes).message as string);
        } else {
          toast.error("Server timed out. Please try again later.");
        }
      }
      if ("data" in resp) {
        dispatch(removeNotification(id));
        refetch();
        toast.success("Booking status updated successfully!");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  if (isLoading || bookingUpdate) return <LoaderSpinner />;
  
  const table = {
    columns: [
      { key: "id", title: "ID", hideOnMobile: true },
      { key: "name", title: "Name" },
      { key: "email", title: "Email", hideOnMobile: true },
      { key: "contact", title: "Contact", hideOnMobile: true },
      { key: "address", title: "Address", hideOnMobile: true },
      { key: "arrivalDate", title: "Arrival Date" },
      { key: "submittedDate", title: "Submitted Date", hideOnMobile: true },
      { key: "aawas", title: "Aawas" },
      { key: "price", title: "Price" },
      { key: "paymentStatus", title: "Payment Status" },
      { key: "action", title: "Action" },
    ],
    rows: ownerHostelBookings.map((detail: BookingType) => ({
      id: detail.id,
      name: detail.user?.userName,
      email: detail.user?.email,
      contact: detail.user?.contact,
      address: detail.user?.address,
      arrivalDate: new Date(detail.checkInDate).toLocaleDateString(),
      submittedDate: new Date(detail.createdAt).toLocaleDateString(),
      aawas: (
        <span
          className="cursor-pointer text-blue-600"
          onClick={() => navigate(`/room-details/${detail.room?.id}`)}
        >
          {detail.room?.hostelName}
        </span>
      ),
      price: detail.room?.price,
      paymentStatus: <Status status={detail.paymentStatus} />,
      action: (
        <div className="flex flex-col gap-2 sm:gap-4">
          {detail.status === "cancelled" ? (
            <p className="text-xs sm:text-sm bg-love px-2 py-1 rounded-md text-other-white-100 font-semibold">
              Cancelled
            </p>
          ) : detail.paymentStatus === "Pending" ? (
            <button
              type="button"
              disabled={bookingUpdate}
              className="text-xs sm:text-sm bg-love px-2 py-1 rounded-md text-other-white-100 font-semibold hover:animate-glow"
              onClick={() => makeDecision("cancelled",detail.id)}
            >
              Reject
            </button>
          ) : (
            <p className="text-xs sm:text-sm bg-brand px-2 py-1 rounded-md text-other-white-100 font-semibold hover:animate-glow">
              Booked
            </p>
          )}

          {detail.status === "pending" && (
            <button
              type="button"
              disabled={bookingUpdate}
              className="rounded-md bg-brand px-2 py-1 text-xs sm:text-sm text-other-white-100 font-semibold hover:animate-glow"
              onClick={() => makeDecision("confirmed", detail.id)}
            >
              Accept
            </button>
          )}
        </div>
      ),
    })),
  };

  return (
    <div className="p-2 sm:p-4">
      <Toaster />

      {/* 🔎 Filters UI - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-stretch sm:items-end">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by name or email
          </label>
          <input
            type="text"
            placeholder="Enter search term..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="border px-3 py-2 rounded-md w-full"
          />
        </div>
        
        <div className="min-w-[150px] flex-1 sm:flex-none">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border px-3 py-2 rounded-md w-full"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="mt-2 sm:mt-0">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-hold text-gray-700 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {noResultsAfterSearch ? (
        <div className="border rounded-md p-6 sm:p-8 text-center">
          <p className="text-gray-500 text-base sm:text-lg">No bookings found matching your search criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-hold text-white rounded-md hover:bg-blue-600"
          >
            Clear Filters
          </button>
        </div>
      ) : !ownerHostelBookings?.length ? (
        <div className="border rounded-md p-6 sm:p-8 text-center">
          <p className="text-gray-500 text-base sm:text-lg">No bookings found for your hostels.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <MasterTable
            rows={table.rows}
            columns={table.columns}
            loading={false}
            pagination={{
              currentPage: get(data, "pagination.page", 1),
              totalPage: get(data, "pagination.pages", 1),
              limit: filters.limit,
              onClick: (params: { page?: number; limit?: number }) => {
                if (params.page) {
                  setFilters({ ...filters, page: params.page });
                }
                if (params.limit) {
                  setFilters({ ...filters, limit: params.limit });
                }
              },
            }}
          />
        </div>
      )}
    </div>
  );
});