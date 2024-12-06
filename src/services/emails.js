import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const emailsApi = createApi({
  reducerPath: "send-emails",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/send-email/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["SendEmails"],
  endpoints: (builder) => ({
    sendBookEventEmail: builder.mutation({
      query: ({ sendData }) => ({
        url: "book-event",
        method: "POST",
        body: { sendData },
      }),
    }),
    sendEventEmailWithAttachments: builder.mutation({
      query: ({
        clientEmail,
        clientName,
        includeInvoice,
        includeDeposit,
        customBodyText,
        eventId,
      }) => ({
        url: "send-event-email",
        method: "POST",
        body: {
          clientEmail,
          clientName,
          includeInvoice,
          includeDeposit,
          customBodyText,
          eventId,
        },
      }),
    }),
  }),
});

export const {
  useSendBookEventEmailMutation,
  useSendEventEmailWithAttachmentsMutation,
} = emailsApi;

export default emailsApi;
