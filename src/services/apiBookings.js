import supabase from "./supabase";

import { getDatesBetween, getISONow, getToday } from "../utils/helpers";
import { PAGE_SIZE } from "../utils/constants";
import { parseISO } from "date-fns";
import { parseDate } from "@internationalized/date";

export async function getBookings({ filter, sortBy, page }) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, status, cabins(name), guests(fullName, email)",
      { count: "exact" }
    );

  //Filter
  if (filter) {
    query = query[filter.method || "eq"](filter.field, filter.value);
  }
  //Sort
  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  }

  //Pagination
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("bookings could not be loaded");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

export async function getCabinBooking(cabinId, { isAfterToday = false } = {}) {
  if (!cabinId) return;

  let query = supabase.from("bookings").select("*").eq("cabinId", cabinId);

  if (isAfterToday) {
    const today = getISONow({ withTime: false });
    query = query.or(`startDate.gte.${today}, endDate.gte.${today}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

export async function getUnavailableDatesInCabin(
  cabinId,
  isDateInterval = false
) {
  if (!cabinId) return [];
  cabinId = Number(cabinId);
  let datesArr = [];
  try {
    const cabinBookingData = await getCabinBooking(cabinId, {
      isAfterToday: true,
    });

    if (isDateInterval) {
      // get disableRange in internationlized formate
      datesArr = cabinBookingData.map((booking) => [
        parseDate(booking.startDate.slice(0, 10)),
        parseDate(booking.endDate.slice(0, 10)),
      ]);
    } else {
      // get flatten disable dates in one array
      for (let index = 0; index < cabinBookingData.length; index++) {
        getDatesBetween(
          parseISO(cabinBookingData[index].startDate),
          parseISO(cabinBookingData[index].endDate),
          datesArr
        );
      }
    }

    return datesArr;
  } catch (error) {
    console.error(error.message);
    throw new Error("Unable to get unavailable dates");
  }
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.gte.${getToday()},startDate.lt.${getToday(
        { end: true }
      )}),and(status.eq.checked-in,endDate.gte.${getToday()},endDate.lt.${getToday(
        { end: true }
      )})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function createBooking(newBookingObj) {
  const {
    cabinId: newCabinId,
    startDate: newStartDate,
    endDate: newEndDate,
  } = newBookingObj;
  let query = supabase.from("bookings");

  // find if cabin is occupied at selected duration
  const { count, error } = await query
    .select("*", { count: "exact", head: true })
    .eq("cabinId", newCabinId)
    .lt("startDate", newEndDate)
    .gt("endDate", newStartDate);

  if (error) throw new Error(error.message);

  // if occupied, throw an error else create a booking
  if (count > 0) throw new Error("date occupied, please choose other date");

  const { data, error: bookingError } = await query
    .insert(newBookingObj)
    .select()
    .single();

  if (bookingError) throw new Error(bookingError.message);

  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
