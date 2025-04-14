import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import emailsApi from "../services/emails";
import authApi from "../services/auth";
import videoApi from "../services/video";
import eventApi from "../services/event";
import reviewApi from "../services/review";
import galleryApi from "../services/gallery";
import fileApi from "../services/file";

const store = configureStore({
  reducer: {
    [emailsApi.reducerPath]: emailsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [videoApi.reducerPath]: videoApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [fileApi.reducerPath]: fileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(emailsApi.middleware)
      .concat(authApi.middleware)
      .concat(videoApi.middleware)
      .concat(eventApi.middleware)
      .concat(reviewApi.middleware)
      .concat(galleryApi.middleware)
      .concat(fileApi.middleware),
});

setupListeners(store.dispatch);

export default store;
