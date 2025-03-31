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
      transformResponse: (response) => {
        return response.map((event) => {
          // If event has new format, use it
          if (event.startDateTime && event.endDateTime) {
            return {
              ...event,
              date: event.startDateTime,
              startTime: new Date(event.startDateTime).toLocaleTimeString(),
              endTime: new Date(event.endDateTime).toLocaleTimeString(),
            };
          }
          // Otherwise, use old format
          return event;
        });
      },
    }),
    getAllConfEvents: builder.query({
      query: () => "get-all-conf",
      providesTags: ["Event"],
      transformResponse: (response) => {
        return response.map((event) => {
          // If event has new format, use it
          if (event.startDateTime && event.endDateTime) {
            return {
              ...event,
              date: event.startDateTime,
              startTime: new Date(event.startDateTime).toLocaleTimeString(),
              endTime: new Date(event.endDateTime).toLocaleTimeString(),
            };
          }
          // Otherwise, use old format
          return event;
        });
      },
    }),
    addEvent: builder.mutation({
      query: (formData) => {
        // Convert date and time strings to ISO datetime strings
        const startDateTime = new Date(
          `${formData.date}T${formData.startTime}`
        );
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

        // If end time is earlier than start time, it means the event ends the next day
        if (endDateTime < startDateTime) {
          endDateTime.setDate(endDateTime.getDate() + 1);
        }

        const updatedFormData = new FormData();
        for (let [key, value] of formData.entries()) {
          if (key === "date" || key === "startTime" || key === "endTime") {
            continue; // Skip these fields as we'll add them as datetime
          }
          updatedFormData.append(key, value);
        }

        // Add both old and new format fields
        updatedFormData.append("date", formData.date);
        updatedFormData.append("startTime", formData.startTime);
        updatedFormData.append("endTime", formData.endTime);
        updatedFormData.append("startDateTime", startDateTime.toISOString());
        updatedFormData.append("endDateTime", endDateTime.toISOString());

        return {
          url: "create-one",
          method: "POST",
          body: updatedFormData,
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
      query: ({ eventId, sendEmail, includeReceiptAttachment }) => ({
        url: `final-payment-event`,
        method: "POST",
        body: { eventId, sendEmail, includeReceiptAttachment },
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
    uploadFinal: builder.mutation({
      query: ({ eventId, formData }) => ({
        url: `upload-final/${eventId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Event"],
    }),
    getFinal: builder.query({
      query: (eventId) => ({
        url: `final/${eventId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      skip: (eventId) => !eventId,
      providesTags: ["Event"],
    }),
    uploadReceipt: builder.mutation({
      query: ({ eventId, formData }) => ({
        url: `upload-receipt/${eventId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Event"],
    }),
    getReceipt: builder.query({
      query: (eventId) => ({
        url: `receipt/${eventId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      skip: (eventId) => !eventId,
      providesTags: ["Event"],
    }),
    sendFinalBillEmail: builder.mutation({
      query: ({ eventId, customNote }) => ({
        url: "send-final-bill",
        method: "POST",
        body: { eventId, customNote },
      }),
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
  useUploadFinalMutation,
  useGetFinalQuery,
  useLazyGetFinalQuery,
  useUploadReceiptMutation,
  useGetReceiptQuery,
  useLazyGetReceiptQuery,
  useSendFinalBillEmailMutation,
} = eventApi;

export default eventApi;
export { eventApi };
