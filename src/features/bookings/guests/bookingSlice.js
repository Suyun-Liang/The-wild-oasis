import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkin: null,
  checkout: null,
  guests: { adults: 1, children: 0, pets: 0 },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    checkinAt(state, action) {
      state.checkin = action.payload;
    },
    checkoutAt(state, action) {
      state.checkout = action.payload;
    },

    incrementAdults(state) {
      state.guests.adults += 1;
    },
    decrementAdults(state) {
      if (state.guests.adults < 1) {
        state.guests.adults = 0;
      } else {
        state.guests.adults -= 1;
      }
    },
    incrementChildren(state) {
      state.guests.children += 1;
    },
    decrementChildren(state) {
      if (state.guests.children < 1) {
        state.guests.children = 0;
      } else {
        state.guests.children -= 1;
      }
    },
    incrementPets(state) {
      state.guests.pets += 1;
    },
    decrementPets(state) {
      if (state.guests.pets < 1) {
        state.guests.pets = 0;
      } else {
        state.guests.pets -= 1;
      }
    },
    updateAdults(state, action) {
      state.guests.adults = Number(action.payload);
    },
    updateChildren(state, action) {
      state.guests.children = Number(action.payload);
    },
    updatePets(state, action) {
      state.guests.pets = Number(action.payload);
    },
  },
});

export const {
  checkinAt,
  checkoutAt,
  incrementAdults,
  decrementAdults,
  incrementChildren,
  decrementChildren,
  incrementPets,
  decrementPets,
  updateAdults,
  updateChildren,
  updatePets,
} = bookingSlice.actions;

export default bookingSlice.reducer;
