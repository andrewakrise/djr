import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const eventApi = createApi({
  reducerPath: "event",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/events/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: () => "get-all",
      providesTags: ["Event"],
    }),
    addEvent: builder.mutation({
      query: (formData) => {
        return {
          url: "create-one",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Event"],
    }),
    updateEvent: builder.mutation({
      query: ({ eventId, data }) => {
        return {
          url: `update-one/${eventId}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `delete-one/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
    uploadInvoice: builder.mutation({
      query: ({ eventId, formData }) => ({
        url: `upload-invoice/${eventId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Event"],
    }),
    getInvoice: builder.query({
      query: (eventId) => ({
        url: `invoice/${eventId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      skip: (eventId) => !eventId,
      providesTags: ["Event"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useUploadInvoiceMutation,
  useGetInvoiceQuery,
  useLazyGetInvoiceQuery,
} = eventApi;

export default eventApi;
export { eventApi };
