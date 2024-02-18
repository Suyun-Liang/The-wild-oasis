import { createContext, useContext, useState } from "react";

import { parseDate } from "@internationalized/date";
import { useMySearchParams } from "../hooks/useMySearchParams";

const DateContext = createContext();

function DateProvider({ children }) {
  const { search } = useMySearchParams();
  const initialStart = search?.checkin;
  const initialEnd = search?.checkout;

  const [date, setDate] = useState(
    initialStart && initialEnd
      ? { start: parseDate(initialStart), end: parseDate(initialEnd) }
      : null
  );

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
