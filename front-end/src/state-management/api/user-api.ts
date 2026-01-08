import { USER_URL } from "../../constant";
import { MainApi } from "./ApiGateway";

const UserApi = MainApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
        
      }),
        providesTags: ["user"], 
    }),

 getAllUser: builder.query({
  query: ({ page = 1, limit = 10, role = "", search = "" }) => ({
    url: `${USER_URL}?page=${page}&limit=${limit}&role=${role}&search=${search}`,
    headers: {
      Authorization: `Bearer ${JSON.parse(
        localStorage.getItem("token") as string
      )}`,
    },
  }),
  providesTags: ["user"],
}),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        method: "PUT",
        body: body,
        url: `${USER_URL}/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
      invalidatesTags: ["user"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `${USER_URL}/delete/${id}`,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("token") as string
          )}`,
        },
      }),
      invalidatesTags: ["user"],
    }),
  }),
    overrideExisting: false,
});

export const {
  useDeleteUserMutation,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = UserApi;
