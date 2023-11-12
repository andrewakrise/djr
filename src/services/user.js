// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const userApi = createApi({
//   reducerPath: "user",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${process.env.REACT_APP_BACKEND_URL}/user/`,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       headers.set("accept", "application/json");
//       return headers;
//     },
//   }),
//   tagTypes: ["User"],
//   endpoints: (builder) => ({
//     createUser: builder.mutation({
//       query: (newUserData) => ({
//         url: "create",
//         method: "POST",
//         body: newUserData,
//       }),
//       invalidatesTags: [{ type: "User", id: "ACTIVE_LIST" }],
//     }),
//     fetchAllUsers: builder.query({
//       query: () => ({
//         url: "all",
//         method: "GET",
//       }),
//       providesTags: [
//         { type: "User", id: "LIST" },
//         { type: "User", id: "ACTIVE_LIST" },
//       ],
//     }),
//     fetchAllArchivedUsers: builder.query({
//       query: () => ({
//         url: "all-archived",
//         method: "GET",
//       }),
//       providesTags: [{ type: "User", id: "ARCHIVED_LIST" }],
//     }),
//     fetchAllClients: builder.query({
//       query: () => ({
//         url: "clients",
//         method: "GET",
//       }),
//     }),
//     fetchUserDetails: builder.query({
//       query: (userId) => ({
//         url: `details/${userId}`,
//         method: "GET",
//       }),
//     }),
//     updateUserDetails: builder.mutation({
//       query: (userDetails) => ({
//         url: "update",
//         method: "PUT",
//         body: userDetails,
//       }),
//       invalidatesTags: [
//         { type: "User", id: "ACTIVE_LIST" },
//         { type: "Client", id: "LIST" },
//         { type: "RealtorGroup", id: "LIST" },
//       ],
//     }),
//     deleteUser: builder.mutation({
//       query: (userId) => ({
//         url: `delete/${userId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: [{ type: "User", id: "ACTIVE_LIST" }],
//     }),
//     archiveUser: builder.mutation({
//       query: (userId) => ({
//         url: `archive/${userId}`,
//         method: "POST",
//       }),
//       invalidatesTags: [
//         { type: "User", id: "ACTIVE_LIST" },
//         { type: "User", id: "ARCHIVED_LIST" },
//         { type: "Client", id: "LIST" },
//         { type: "RealtorGroup", id: "LIST" },
//       ],
//     }),
//     restoreUser: builder.mutation({
//       query: (userId) => ({
//         url: `restore/${userId}`,
//         method: "POST",
//       }),
//       invalidatesTags: [
//         { type: "User", id: "ACTIVE_LIST" },
//         { type: "User", id: "ARCHIVED_LIST" },
//         { type: "Client", id: "LIST" },
//         { type: "RealtorGroup", id: "LIST" },
//       ],
//     }),
//     updateEmail: builder.mutation({
//       query: ({ id, newEmail }) => ({
//         url: `update-email/${id}`,
//         method: "PUT",
//         body: { newEmail },
//       }),
//     }),
//     updateImage: builder.mutation({
//       query: ({ userId, file }) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         return {
//           url: `update-image/${userId}`,
//           method: "PUT",
//           body: formData,
//         };
//       },
//     }),
//   }),
// });

// export const {
//   useFetchAllUsersQuery,
//   useFetchAllClientsQuery,
//   useFetchAllArchivedUsersQuery,
//   useFetchUserDetailsQuery,
//   useUpdateUserDetailsMutation,
//   useDeleteUserMutation,
//   useUpdateEmailMutation,
//   useUpdateImageMutation,
//   useCreateUserMutation,
//   useArchiveUserMutation,
//   useRestoreUserMutation,
// } = userApi;

// export default userApi;
