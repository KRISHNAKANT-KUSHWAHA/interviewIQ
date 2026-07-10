// how redux work
// first create shop in redux

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export default configureStore({
  reducer: {
    user: userSlice,
  },
});
