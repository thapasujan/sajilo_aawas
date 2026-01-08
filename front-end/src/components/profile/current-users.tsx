
import { memo, useMemo, useState } from "react";
import { useDeleteBookingMutation, useGetAllBookingQuery } from "../../state-management/api/booking-api";
import { useSelector } from "react-redux";
import { user } from "../../state-management/local/auth";
import { LoaderSpinner, InfoText } from "../../units";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { errorTypes } from "../../constant";
import toast, { Toaster } from "react-hot-toast";

import { UpdateBookingDetails } from "./YourBookingUpdate";
import MasterTable from "../Table/MasterTable";
import { get } from "lodash";


interface BookingTypes {
  user: {
    email: string;
    contact: string;
    userName: string;
    address: string;
    id: string;
  };
  people: number;
  id: string;
  payment: string;
  isActiveStatus?:any;
  status: string;
  checkInDate: string;
  room: {
    ownerEmail: string;
    hostelName: string;
    price: string;
    _id: string;
  };
}

export const CurrentUsers = memo(() => {
  const [popup, setPopup] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [filters, setFilters] = useState({ 
    page: 1, 
    limit: 10,
    search: "",
    isActiveStatus: "" // Empty string means no filter
  });

  const { data, isLoading, refetch } = useGetAllBookingQuery(filters);
  const [deleteBooking, { isLoading: deleteLoading }] = useDeleteBookingMutation();
  const userInfo = useSelector(user);
  const nav = useNavigate();

  // Check if there are search filters applied
  const hasSearchFilters = useMemo(() => {
    return filters.search !== "" || filters.isActiveStatus !== "";
  }, [filters.search, filters.isActiveStatus]);

  const ownerHostelBookingDetails = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.filter(
      (booking: BookingTypes) =>
        booking.room.ownerEmail === userInfo?.email && 
        booking.status === "confirmed"
    ) || [];
  }, [data, userInfo?.email]);

  // Check if there are no results after search
  const noResultsAfterSearch = useMemo(() => {
    return hasSearchFilters && ownerHostelBookingDetails.length === 0;
  }, [hasSearchFilters, ownerHostelBookingDetails.length]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      isActiveStatus: ""
    });
  };

  const deleteUser = async (id: string) => {
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
      { key: "user", title: "User" },
      { key: "contact", title: "Contact" },
      { key: "address", title: "Address" },
      { key: "joinedDate", title: "Joined Date" },
      { key: "people", title: "No. of People" },
      { key: "hostel", title: "Hostel" },
      { key: "price", title: "Price" },
      { key: "payment", title: "Payment" },
      { key: "activeStatus", title: "Active Status" },
      { key: "action", title: "Action" },
    ],
    rows: ownerHostelBookingDetails.map((detail: BookingTypes) => ({
      user: (
        <>
          <InfoText title={detail.user.userName} />
          <InfoText title={detail.user.email} />
        </>
      ),
      contact: detail.user.contact,
      address: detail.user.address,
      joinedDate: detail.checkInDate?.slice(0, 10) || "-",
      people: detail.people,
      hostel: (
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => nav(`/room-details/${detail.room._id}`)}
        >
          {detail.room.hostelName}
        </span>
      ),
      price: detail.room.price,
      payment: detail.payment,
      activeStatus: (
        <span className={detail.isActiveStatus ? "text-complete border px-2 py-1 rounded-md" : "text-secondary border px-2 py-1 rounded-md"}>
          {detail.isActiveStatus ? "Active" : "Inactive"}
        </span>
      ),
      action: (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="text-sm bg-love px-2 py-1 rounded-md text-white font-semibold hover:bg-red-700 transition"
            onClick={() => deleteUser(detail.id)}
          >
            Delete
          </button>
{detail.isActiveStatus === 1 && (
  <button
    type="button"
    className="text-sm bg-brand px-2 py-1 rounded-md text-white font-semibold hover:bg-blue-700 transition"
    onClick={() => {
      setPopup("bookedUpdate");
      setUpdateId(detail.id);
    }}
  >
    CheckOut
  </button>
)}




        </div>
      ),
    })),
  };

  return (
    <div className="relative rounded-md p-4">
      <Toaster />
      
      {/* Search and Filter UI */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 rounded-lg">
        <div className="flex-1 max-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Users
          </label>
          <input
            type="text"
            placeholder="Search by name, email, or hostel"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        
        <div className="min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status Filter
          </label>
          <select
            value={filters.isActiveStatus}
            onChange={(e) => setFilters({ ...filters, isActiveStatus: e.target.value, page: 1 })}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">All Users</option>
            <option value="1">Active Users</option>
            <option value="0">Inactive Users</option>
          </select>
        </div>
        
  
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-hold text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
     
      </div>

      {noResultsAfterSearch ? (
        <div className="border border-gray-200 rounded-lg p-8 text-center bg-white">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No users found</p>
          <p className="text-gray-400 mb-4">We couldn't find any users matching your search criteria.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-hold text-white rounded-md hover:bg-blue-600 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : !ownerHostelBookingDetails.length ? (
        <div className="border border-gray-200 rounded-lg p-8 text-center bg-white">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium mb-2">No users found</p>
          <p className="text-gray-400">No users have been signed up for your hostels yet.</p>
        </div>
      ) : (
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
      )}
      
      {popup === "bookedUpdate" && <UpdateBookingDetails id={updateId} setPopup={setPopup} />}
    </div>
  );
});