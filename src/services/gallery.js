import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const galleryApi = createApi({
  reducerPath: "gallery",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/gallery/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["GalleryMedia"],
  endpoints: (builder) => ({
    getAllGalleryMedia: builder.query({
      query: ({ page = 1, limit = 50, mediaType, tag } = {}) => ({
        url: "",
        params: { page, limit, mediaType, tag },
      }),
      providesTags: (result) =>
        result?.media
          ? [
              ...result.media.map(({ _id }) => ({
                type: "GalleryMedia",
                id: _id,
              })),
              { type: "GalleryMedia", id: "LIST" },
            ]
          : [{ type: "GalleryMedia", id: "LIST" }],
    }),
    getGalleryMediaById: builder.query({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: "GalleryMedia", id }],
    }),
    addGalleryMedia: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "GalleryMedia", id: "LIST" }],
    }),
    updateGalleryMedia: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "GalleryMedia", id },
        { type: "GalleryMedia", id: "LIST" },
      ],
    }),
    deleteGalleryMedia: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "GalleryMedia", id },
        { type: "GalleryMedia", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllGalleryMediaQuery,
  useGetGalleryMediaByIdQuery,
  useAddGalleryMediaMutation,
  useUpdateGalleryMediaMutation,
  useDeleteGalleryMediaMutation,
} = galleryApi;

export default galleryApi;
export { galleryApi };
