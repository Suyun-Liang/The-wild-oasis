import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  differenceInCalendarDays,
  format,
  formatDistance,
  isAfter,
  parseISO,
} from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (date1, date2) => {
  if (typeof date1 === "string" && typeof date2 == "string") {
    date1 = parseISO(date1);
    date2 = parseISO(date2);
  }
  return differenceInCalendarDays(date1, date2);
};

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

export const getISONow = ({ withTime = true } = {}) => {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const date = new Date(Date.now() - tzOffset);

  if (!withTime) date.setUTCHours(0, 0, 0, 0);

  return date.toISOString().slice(0, -1);
};

export const getFullName = (fn, ln) => {
  const firstName = fn.trim();
  const lastName = ln.trim();
  const capitalizedFirstN = capitalize(firstName);
  const capitalizedLastN = capitalize(lastName);
  return `${capitalizedFirstN} ${capitalizedLastN}`;
};

export const isLaterThanOrEqualToday = (date1, date2) => {
  const diff = differenceInCalendarDays(date1, date2);
  return diff >= 0;
};

export const isLaterThanStartDate = (date1, date2) => isAfter(date1, date2);

export function getISOStringWithHour(date, hour = 0) {
  if (!date) return;
  if (typeof date === "string") date = new Date(date);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString().slice(0, -1);
}

export function getDatesBetween(startDate, endDate, datesArr = []) {
  for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
    datesArr.push(new Date(date));
  }

  return datesArr;
}

export function formatDate(inputDate, formatStr) {
  if (!inputDate) return;
  const date = typeof inputDate === "string" ? new Date(inputDate) : inputDate;
  return format(date, formatStr);
}

export function chunckArr(arr, size) {
  if (size <= 0) return;

  const chunked = [];

  if (!arr) return chunked;

  for (let i = 0; i < arr.length; i += size) {
    chunked.push(arr.slice(i, i + size));
  }

  return chunked;
}

// only used for internationized date, since compare is the method of this class
export function isDateUnavailable(disabledRanges) {
  return (date) =>
    disabledRanges?.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) < 0
    );
}
// only used for internationized date, since compare is the method of this class
export function isDateInRange(date, disabledRanges) {
  if (typeof date === "string") date = parseDate(date);
  return isDateUnavailable(disabledRanges)(date);
}

//only used for internationized date, since compare is the method of this class
export function isEqualAfterToday(date) {
  if (typeof date === "string") date = parseDate(date);

  const result = date.compare(today(getLocalTimeZone())) >= 0;
  return result;
}

export function getParamsStr(filterObj) {
  if (typeof filterObj !== "object") return;

  const keysArr = Object.keys(filterObj);

  const result = keysArr.reduce((acc, key, i) => {
    if (!filterObj[key]) return acc;
    if (i === 0) return (acc += `${key}=${filterObj[key]}`);
    return (acc += `&${key}=${filterObj[key]}`);
  }, "");
  // {checkin, checkout, adults, children, pets }
  return result;
}

export function capitalize(str) {
  return str.at(0).toUpperCase() + str.slice(1).toLowerCase();
}
