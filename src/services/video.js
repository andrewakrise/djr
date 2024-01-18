import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const videoApi = createApi({
  reducerPath: "video",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/video-links/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Video"],
  endpoints: (builder) => ({
    addVideoLink: builder.mutation({
      query: ({ url, description }) => ({
        url: "add-video-link/",
        method: "POST",
        body: { url, description },
      }),
      invalidatesTags: ["Video"],
    }),
    getVideoLink: builder.query({
      query: (videoId) => {
        return {
          url: `get-video-link/${videoId}`,
          method: "GET",
        };
      },
      skip: (videoId) => !videoId,
      providesTags: ["Video"],
    }),
    getAllVideoLinks: builder.query({
      query: () => {
        return {
          url: "get-all-video-links",
          method: "GET",
        };
      },
      providesTags: ["Video"],
    }),
    updateVideoLink: builder.mutation({
      query: ({ videoId, formData }) => {
        return {
          url: `update-video-link/${videoId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Video"],
    }),
    deleteVideoLink: builder.mutation({
      query: ({ videoId }) => ({
        url: `delete-video-link/${videoId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Video"],
    }),
  }),
});

export const {
  useAddVideoLinkMutation,
  useGetAllVideoLinksQuery,
  useGetVideoLinkQuery,
  useUpdateVideoLinkMutation,
  useDeleteVideoLinkMutation,
} = videoApi;

export default videoApi;
export { videoApi };
