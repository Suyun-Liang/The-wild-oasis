import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { getLocalTimeZone, today } from "@internationalized/date";

import DateRangeCalendar from "../DateRangeCalender.jsx";
import { RoomSidebar } from "./RoomSidebar.jsx";

import { useUnavailableDatesIn } from "../../features/bookings/useBooking.js";
import { isDateUnavailable } from "../../utils/helpers.js";

const BookDetails = styled.div`
  display: flex;

  gap: 30px;
`;

export function RoomBookDetail({ cabin }) {
  const [searchParams] = useSearchParams();
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");

  const { dates: disabledRange } = useUnavailableDatesIn(cabin?.id, {
    isDateInterval: true,
  });
  return (
    <BookDetails>
      <DateRangeCalendar
        aria-label="date calendar"
        minValue={today(getLocalTimeZone())}
        isDateUnavailable={isDateUnavailable(disabledRange)}
        initialDate={{ checkin, checkout }}
      />
      <RoomSidebar cabin={cabin} />
    </BookDetails>
  );
}
