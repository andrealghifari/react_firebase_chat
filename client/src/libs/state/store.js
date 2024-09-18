import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./userStore";
import chatReducer from "./chatStore";
const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;
