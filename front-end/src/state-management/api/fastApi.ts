// src/state-management/api/fastRecommendationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const FastRecommendationApi = createApi({
  reducerPath: "fastRecommendationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://location-recommendation.onrender.com",
  }),
  endpoints: (builder) => ({
    recommendLocation: builder.mutation({
      query: (payload: { query: string; k: number; candidate_source: string }) => ({
        url: "/recommend",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useRecommendLocationMutation } = FastRecommendationApi;
