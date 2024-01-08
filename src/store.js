import { configureStore } from "@reduxjs/toolkit";

import bookingSlice from "./features/bookings/guests/bookingSlice";

export const store = configureStore({
  reducer: {
    booking: bookingSlice,
  },
});
