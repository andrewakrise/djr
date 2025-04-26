// src/services/review.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const reviewApi = createApi({
  reducerPath: "review",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/reviews/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: "",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review"],
    }),
    addReviewAsAdmin: builder.mutation({
      query: (formData) => ({
        url: "admin",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Review"],
    }),
    getAllReviews: builder.query({
      query: (page = 1, limit = 10) => `?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.reviews
          ? [
              ...result.reviews.map(({ _id }) => ({ type: "Review", id: _id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),
    getReview: builder.query({
      query: (reviewId) => `${reviewId}`,
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),
    updateReview: builder.mutation({
      query: ({ reviewId, data }) => ({
        url: `${reviewId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Review", id: reviewId },
        { type: "Review", id: "LIST" },
      ],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),
    getAllVerifiedReviews: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `verified?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.reviews
          ? [
              ...result.reviews.map(({ _id }) => ({ type: "Review", id: _id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),
    getReviewImageUrl: builder.query({
      query: (reviewId) => `${reviewId}/image-url`,
    }),
  }),
});

export const {
  useAddReviewMutation,
  useAddReviewAsAdminMutation,
  useGetAllReviewsQuery,
  useGetReviewQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetAllVerifiedReviewsQuery,
  useGetReviewImageUrlQuery,
} = reviewApi;

export default reviewApi;
export { reviewApi };
