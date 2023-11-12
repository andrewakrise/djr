// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const authApi = createApi({
//   reducerPath: "auth",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${process.env.REACT_APP_BACKEND_URL}/auth/`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ["Auth"],
//   endpoints: (builder) => ({
//     loginUser: builder.mutation({
//       query: (credentials) => ({
//         url: "login",
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     clientLogin: builder.mutation({
//       query: ({ email, password, groupUrlName }) => ({
//         url: `client-login/${groupUrlName}`,
//         method: "POST",
//         body: { email, password },
//       }),
//     }),
//     signupUser: builder.mutation({
//       query: (userDetails) => ({
//         url: "realtyadmin-signup",
//         method: "POST",
//         body: userDetails,
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginUserMutation,
//   useClientLoginMutation,
//   useSignupUserMutation,
//   useFetchUserQuery,
//   endpoints: { loginUser },
// } = authApi;

// export default authApi;
