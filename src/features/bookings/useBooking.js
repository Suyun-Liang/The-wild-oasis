import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import {
  getBooking,
  getBookingFrom,
  getUnavailableDatesInCabin,
} from "../../services/apiBookings";

export function useBooking() {
  const { bookingId } = useParams();
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  return { booking, isLoading, error };
}

export function useUnavailableDatesIn(
  cabinId,
  { isDateInterval } = { isDateInterval: false }
) {
  const { data: dates, isLoading } = useQuery({
    queryKey: ["unavailable dates", cabinId],
    queryFn: () => getUnavailableDatesInCabin(cabinId, isDateInterval),
  });
  return { dates, isLoading };
}

export function useBookingFrom(guestId) {
  const { data, isLoading } = useQuery({
    queryKey: ["booking history", guestId],
    queryFn: () => getBookingFrom(guestId),
  });

  return { data, isLoading };
}
