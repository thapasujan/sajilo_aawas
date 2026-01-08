
import { Booking_URL } from "../../constant/url/url";
import { MainApi } from "./ApiGateway";

const BookingApi = MainApi.injectEndpoints({
  endpoints: (builder) => ({
    bookHostel: builder.mutation({
      query: (data) => ({
        url: `${Booking_URL}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("booking-token") as string
          )}`,
        },
      }),
    }),

    // 🔹 Get all bookings with pagination + filters
    getAllBooking: builder.query({
      query: (params: { page?: number; limit?: number; search?: string; status?: string ,isActiveStatus?:string }) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.isActiveStatus) queryParams.append("isActiveStatus", params.isActiveStatus);
        return {
          url: `${Booking_URL}?${queryParams.toString()}`,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") as string
            )}`,
          },
        };
      },
    }),

    getBookingById: builder.query({
      query: (id) => ({
        url: `${Booking_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),

    getBookingByUserId: builder.query({
      query: (id) => ({
        url: `${Booking_URL}/byUser/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),

    updateBooking: builder.mutation({
      query: ({ id, ...body }) => ({
        method: "PUT",
        body: body,
        url: `${Booking_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),

    updateBybookingId: builder.mutation({
      query: ({ id, ...body }) => ({
        method: "PUT",
        body: body,
        url: `${Booking_URL}/update/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),

    deleteBooking: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `${Booking_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),
  }),
});

export const {
  useBookHostelMutation,
  useDeleteBookingMutation,
  useGetAllBookingQuery,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
  useUpdateBybookingIdMutation,
} = BookingApi;
