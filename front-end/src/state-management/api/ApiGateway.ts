import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { Base_Url } from "../../constant";

const baseQuery = fetchBaseQuery({ baseUrl: Base_Url });

export const MainApi = createApi({
  baseQuery,
  tagTypes: ["user", "room", "booking"],
  endpoints: () => ({}),
});
