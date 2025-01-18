// src/services/event.js
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
    getAllConfEvents: builder.query({
      query: () => "get-all-conf",
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
    uploadDeposit: builder.mutation({
      query: ({ eventId, formData }) => ({
        url: `upload-deposit/${eventId}`,
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
    getDeposit: builder.query({
      query: (eventId) => ({
        url: `deposit/${eventId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      skip: (eventId) => !eventId,
      providesTags: ["Event"],
    }),
    confirmEvent: builder.mutation({
      query: ({ eventId, sendEmail }) => ({
        url: `confirm-event`,
        method: "POST",
        body: { eventId, sendEmail },
      }),
      invalidatesTags: ["Event"],
    }),
    unconfirmEvent: builder.mutation({
      query: (eventId) => ({
        url: `unconfirm-event`,
        method: "POST",
        body: eventId,
      }),
      invalidatesTags: ["Event"],
    }),
    finalPaymentEvent: builder.mutation({
      query: ({ eventId, sendEmail }) => ({
        url: `final-payment-event`,
        method: "POST",
        body: { eventId, sendEmail },
      }),
      invalidatesTags: ["Event"],
    }),
    togglePublic: builder.mutation({
      query: (eventId) => ({
        url: `toggle-public-event`,
        method: "POST",
        body: { eventId },
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetAllConfEventsQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useUploadInvoiceMutation,
  useUploadDepositMutation,
  useGetInvoiceQuery,
  useGetDepositQuery,
  useLazyGetInvoiceQuery,
  useLazyGetDepositQuery,
  useConfirmEventMutation,
  useUnconfirmEventMutation,
  useFinalPaymentEventMutation,
  useTogglePublicMutation,
} = eventApi;

export default eventApi;
export { eventApi };
