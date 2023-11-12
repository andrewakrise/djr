import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const emailsApi = createApi({
  reducerPath: "invitation",
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
  tagTypes: ["Invitation"],
  endpoints: (builder) => ({
    sendBookEventEmail: builder.mutation({
      query: ({ sendData }) => ({
        url: "book-event",
        method: "POST",
        body: { sendData },
      }),
    }),
  }),
});

export const { useSendBookEventEmailMutation } = emailsApi;

export default emailsApi;
