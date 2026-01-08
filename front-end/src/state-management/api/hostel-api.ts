
import {  Room_URL } from "../../constant/url/url";
import { MainApi } from "./ApiGateway";


const HostelApi = MainApi.injectEndpoints({
  
  endpoints: (builder) => ({
    createHostel: builder.mutation({
      query: (data) => ({
        url: `${Room_URL}`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),
    
    getAllHostel: builder.query({
      query: ({ page = 1, limit = 5, search = "", price, location }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search: search || "",
        });

        if (price && price > 0) params.append("price", String(price));
        if (location && location !== "") params.append("location", location);

        return {
          url: `${Room_URL}?${params.toString()}`,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`,
          },
        };
      },
    }),

    getHostelById: builder.query({
      query: (id) => ({
        url: `${Room_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),

    updateHostel: builder.mutation({
      query: ({ id, ...body }) => ({
        method: "PUT",
        body: body,
        url: `${Room_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
    }),

    deleteHostel: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `${Room_URL}/${id}`,
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
  useCreateHostelMutation,
  useDeleteHostelMutation,
  useUpdateHostelMutation,
  useGetAllHostelQuery,
  useGetHostelByIdQuery,
} = HostelApi;