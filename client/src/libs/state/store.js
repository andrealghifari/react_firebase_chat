import { configureStore } from "@reduxjs/toolkit";
import  authReducer  from "./userStore";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
