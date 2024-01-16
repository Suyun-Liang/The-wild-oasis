import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  checkinAt,
  checkoutAt,
} from "../features/bookings/guests/bookingSlice";

const DateContext = createContext();

function DateProvider({ children }) {
  const [date, setDate] = useState(null);
  const dispatch = useDispatch();

  const start = date?.start;
  const end = date?.end;

  useEffect(() => {
    let formStart = start?.toString();
    let formEnd = end?.toString();

    if (formStart == formEnd) {
      formEnd = end?.add({ days: 1 }).toString();
    }

    dispatch(checkinAt(formStart));
    dispatch(checkoutAt(formEnd));
  }, [start, end, dispatch]);

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
}

function useDate() {
  const value = useContext(DateContext);

  if (value === undefined)
    return new Error("DateContext was used outside of DateContextProvider");

  return value;
}

export { DateProvider, useDate };
