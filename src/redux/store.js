import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import emailsApi from "../services/emails";

const store = configureStore({
  reducer: {
    [emailsApi.reducerPath]: emailsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emailsApi.middleware),
});

setupListeners(store.dispatch);

export default store;
