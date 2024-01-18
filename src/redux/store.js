import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import emailsApi from "../services/emails";
import authApi from "../services/auth";
import videoApi from "../services/video";

const store = configureStore({
  reducer: {
    [emailsApi.reducerPath]: emailsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(emailsApi.middleware)
      .concat(authApi.middleware)
      .concat(videoApi.middleware),
});

setupListeners(store.dispatch);

export default store;
