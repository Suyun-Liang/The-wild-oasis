import {
  differenceInCalendarDays,
  differenceInMinutes,
  formatDistance,
  isAfter,
  parseISO,
} from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInCalendarDays(
    parseISO(String(dateStr1)),
    parseISO(String(dateStr2))
  );

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

export const getISOSNow = ({ withSecond } = { withSecond: true }) => {
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzOffset)
    .toISOString()
    .slice(0, withSecond ? -1 : 16);
};

export const getFullName = (fn, ln) => {
  const firstName = fn.trim();
  const lastName = ln.trim();
  const capitalizedFirstN =
    firstName.at(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const capitalizedLastN =
    lastName.at(0).toUpperCase() + lastName.slice(1).toLowerCase();
  return `${capitalizedFirstN} ${capitalizedLastN}`;
};

export const isLaterThanNow = (str1, str2) => {
  const diff = differenceInMinutes(
    parseISO(String(str1)),
    parseISO(String(str2))
  );
  return diff >= 0;
};

export const isLaterThanStartDate = (str1, str2) =>
  isAfter(parseISO(String(str1)), parseISO(String(str2)));
