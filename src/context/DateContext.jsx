import { createContext, useContext, useState } from "react";

import { parseDate } from "@internationalized/date";
import { useMySearchParams } from "../hooks/useMySearchParams";

const DateContext = createContext();

function DateProvider({ children }) {
  const { search } = useMySearchParams();

  let initialStart =
    search?.checkin === undefined ? undefined : JSON.stringify(search.checkin);
  let initialEnd =
    search?.checkout === undefined
      ? undefined
      : JSON.stringify(search?.checkout);

  // stringify Object and parse it back to Object
  if (initialStart && initialEnd) {
    initialStart = JSON.parse(initialStart);
    initialEnd = JSON.parse(initialEnd);
  }

  const [date, setDate] = useState(
    initialStart && initialEnd
      ? { start: parseDate(initialStart), end: parseDate(initialEnd) }
      : null
  );
  console.log(typeof date);
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
