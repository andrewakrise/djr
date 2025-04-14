import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const fileApi = createApi({
  reducerPath: "file",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/files/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["File"],
  endpoints: (builder) => ({
    // Get all files with filtering
    getFiles: builder.query({
      query: ({
        page = 1,
        limit = 50,
        type,
        category,
        tags,
        isPublic,
      } = {}) => ({
        url: "",
        params: { page, limit, type, category, tags, isPublic },
      }),
      providesTags: (result) =>
        result?.files
          ? [
              ...result.files.map(({ _id }) => ({ type: "File", id: _id })),
              { type: "File", id: "LIST" },
            ]
          : [{ type: "File", id: "LIST" }],
    }),

    // Get single file
    getFile: builder.query({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: "File", id }],
    }),

    // Upload new file
    uploadFile: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "File", id: "LIST" }],
    }),

    // Update file
    updateFile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "File", id },
        { type: "File", id: "LIST" },
      ],
    }),

    // Delete file
    deleteFile: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "File", id },
        { type: "File", id: "LIST" },
      ],
    }),

    // Get files by category
    getFilesByCategory: builder.query({
      query: ({ category, type, tags, isPublic } = {}) => ({
        url: `category/${category}`,
        params: { type, tags, isPublic },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "File", id: _id })),
              { type: "File", id: "LIST" },
            ]
          : [{ type: "File", id: "LIST" }],
      // Add prefetching for individual files
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Prefetch each file individually
          data.forEach((file) => {
            dispatch(
              fileApi.util.prefetch("getFile", file._id, {
                force: true,
                ifOlderThan: 0,
              })
            );
          });
        } catch (error) {
          console.error("Error prefetching files:", error);
        }
      },
    }),
  }),
});

export const {
  useGetFilesQuery,
  useGetFileQuery,
  useUploadFileMutation,
  useUpdateFileMutation,
  useDeleteFileMutation,
  useGetFilesByCategoryQuery,
} = fileApi;

export default fileApi;
