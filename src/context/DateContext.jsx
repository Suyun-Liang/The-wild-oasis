import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  checkinAt,
  checkoutAt,
} from "../features/bookings/guests/bookingSlice";
import { parseDate } from "@internationalized/date";

const DateContext = createContext();

function DateProvider({ children }) {
  const [date, setDate] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const initialStart = searchParams.get("checkin");
  const initialEnd = searchParams.get("checkout");

  useEffect(() => {
    if (initialStart && initialEnd) {
      setDate(() => {
        return { start: parseDate(initialStart), end: parseDate(initialEnd) };
      });
    }
  }, [initialStart, initialEnd]);

  const start = date?.start;
  const end = date?.end;

  useEffect(() => {
    let formStart = start?.toString();
    let formEnd = end?.toString();

    if (formStart == formEnd) {
      formEnd = end?.add({ days: 1 }).toString();
    }
    if (formStart && formEnd) {
      searchParams.set("checkin", formStart);
      searchParams.set("checkout", formEnd);
      setSearchParams(searchParams);
    }
    dispatch(checkinAt(formStart));
    dispatch(checkoutAt(formEnd));
  }, [start, end, dispatch, setSearchParams, searchParams]);

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
