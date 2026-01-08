import { useDeleteBookingMutation, useGetAllBookingQuery } from "../../state-management/api/booking-api";
import { useSelector } from "react-redux";
import { user } from "../../state-management/local/auth";
import { LoaderSpinner } from "../../units";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast, { Toaster } from "react-hot-toast";
import { errorTypes } from "../../constant";
import MasterTable from "../Table/MasterTable";
import { Payment } from "../payment/payment";
import { get } from "lodash";
import { memo, useMemo, useState } from "react";

interface BookingTypes {
  user: { id: string };
  id: string;
  paymentStatus: string;
  checkInDate: string;
  checkOutDate: string;
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

export const YourBooking = memo(() => {
  const [filters, setFilters] = useState({ 
    page: 1, 
    limit: 10, 
    search: "", 
    status: "" 
  });
  
  const { data, isLoading, refetch } = useGetAllBookingQuery(filters);
  const userInfo = useSelector(user);
  const nav = useNavigate();
  const [deleteBooking, { isLoading: deleteLoading }] = useDeleteBookingMutation();

  // Filter bookings for current user
  const yourBookingDetails = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((booking: BookingTypes) => booking.user.id === userInfo?.id);
  }, [data, userInfo?.id]);

  // Check if there are search filters applied
  const hasSearchFilters = useMemo(() => {
    return filters.search !== "" || filters.status !== "";
  }, [filters.search, filters.status]);

  // Check if there are no results after search
  const noResultsAfterSearch = useMemo(() => {
    return hasSearchFilters && yourBookingDetails.length === 0;
  }, [hasSearchFilters, yourBookingDetails.length]);

  const cancel = async (id: string) => {
    await deleteBooking(id).then((resp) => {
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

  if (isLoading || deleteLoading) return <LoaderSpinner />;

  const table = {
    columns: [
      { key: "hostel", title: "Aawas" },
      { key: "email", title: "Email" },
      { key: "contact", title: "Contact" },
      { key: "address", title: "Address" },
      { key: "price", title: "Price" },
      { key: "checkInDate", title: "Check In" },
      { key: "checkOutDate", title: "Check Out" },
      { key: "paymentStatus", title: "Payment" },
      { key: "status", title: "Status" },
      { key: "action", title: "Action" },
    ],
    rows: yourBookingDetails.map((detail: BookingTypes) => ({
      hostel: (
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => nav(`/room-details/${detail.room.id}`)}
        >
          {detail.room.hostelName}
        </span>
      ),
      email: (
        <div className="break-all">
          {detail.room.ownerEmail}
        </div>
      ),
      contact: detail.room.contact,
      address: (
        <div className="max-w-[120px] truncate" title={detail.room.location}>
          {detail.room.location}
        </div>
      ),
      price: detail.room.price,
      checkInDate: detail.checkInDate?.slice(0, 10) || "-",
      checkOutDate: detail.checkOutDate?.slice(0, 10) || "-",
      paymentStatus: (
        <span className={`px-2 py-1 rounded-full text-xs ${
          detail.paymentStatus === "FullPayment" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {detail.paymentStatus}
        </span>
      ),
      status: (
        <span className={`px-2 py-1 rounded-full text-xs ${
          detail.status === "confirmed" 
            ? "bg-green-100 text-green-800" 
            : detail.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}>
          {detail.status}
        </span>
      ),
      action: (
        <div className="flex flex-col gap-2">
          {detail.status === "confirmed" ? (
            <>
              {detail.paymentStatus === "Pending" && (
                <button
                  type="button"
                  className="text-sm bg-love px-2 py-1 rounded-md text-white font-semibold hover:bg-red-700 transition whitespace-nowrap"
                  onClick={() => cancel(detail.id)}
                >
                  Cancel
                </button>
              )}
              {detail.paymentStatus !== "FullPayment" ? (
                <Payment
                  id={detail.id}
                  checkInDate={detail.checkInDate}
                  room={detail.room}
                  status={detail.status}
                  user={detail.user}
                />
              ) : (
                <p className="text-sm bg-green-600 px-2 py-1 rounded-md text-white font-semibold text-center whitespace-nowrap">
                  Booked
                </p>
              )}
            </>
          ) : (
            <button
              type="button"
              className="text-sm bg-love px-2 py-1 rounded-md text-white font-semibold hover:bg-red-700 transition whitespace-nowrap"
              onClick={() => cancel(detail.id)}
            >
              Delete
            </button>
          )}
        </div>
      ),
    })),
  };

  return (
    <div className="p-2 sm:p-4 rounded-md relative">
      <Toaster />
      
      {/* Search and Filter UI */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6 bg-gray-50 p-3 md:p-4 rounded-lg max-w-full">
        <div className="flex-1 min-w-0">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Bookings
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by Aawas name"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        
        <div className="w-full md:w-40">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Booking Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="flex items-end mt-2 md:mt-0">
          <button
            onClick={() => setFilters({ page: 1, limit: 10, search: "", status: "" })}
            className="w-full md:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {noResultsAfterSearch ? (
        <div className="border border-gray-200 rounded-lg p-4 md:p-8 text-center bg-white">
          <div className="text-gray-400 mb-3 md:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-base md:text-lg font-medium mb-2">No bookings found</p>
          <p className="text-gray-400 text-sm md:text-base mb-4">We couldn't find any bookings matching your search criteria.</p>
          <button
            onClick={() => setFilters({ page: 1, limit: 10, search: "", status: "" })}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm md:text-base"
          >
            Clear Filters
          </button>
        </div>
      ) : !yourBookingDetails.length ? (
        <div className="border border-gray-200 rounded-lg p-4 md:p-8 text-center bg-white">
          <div className="text-gray-400 mb-3 md:mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-500 text-base md:text-lg font-medium mb-2">You have not booked any hostel yet.</p>
          <p className="text-gray-400 text-sm md:text-base mb-4">Start exploring our hostels to find your perfect stay.</p>
          <button
            onClick={() => nav("/hostels")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm md:text-base"
          >
            Browse Aawas
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <MasterTable
            rows={table.rows}
            columns={table.columns}
            loading={false}
            showCheckbox={false}
            pagination={{
              currentPage: get(data, "pagination.page", filters.page),
              totalPage: get(data, "pagination.pages", 1),
              limit: filters.limit,
              onClick: ({ page, limit }: { page?: number; limit?: number }) => {
                setFilters((prev) => ({
                  ...prev,
                  page: page || prev.page,
                  limit: limit || prev.limit,
                }));
              },
            }}
          />
        </div>
      )}
    </div>
  );
});