import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getLocalTimeZone, today } from "@internationalized/date";

import DateRangeCalendar from "../date_range_calendar/DateRangeCalender.jsx";
import { RoomSidebar } from "./RoomSidebar.jsx";

import { useUnavailableDatesIn } from "../../features/bookings/useBooking.js";
import { isDateUnavailable } from "../../utils/helpers.js";
import { useDate } from "../../context/DateContext.jsx";
import {
  checkinAt,
  checkoutAt,
  updateAdults,
  updateChildren,
  updatePets,
} from "../../features/bookings/guests/bookingSlice.js";

const BookDetails = styled.div`
  display: flex;

  gap: 30px;
`;

export function RoomBookDetail({ cabin }) {
  const value = useDate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  //initialize global states with params
  useEffect(() => {
    searchParams.forEach((val, param) => {
      switch (param) {
        case "checkin":
          dispatch(checkinAt(val));
          break;
        case "checkout":
          dispatch(checkoutAt(val));
          break;
        case "adults":
          dispatch(updateAdults(val));
          break;
        case "children":
          dispatch(updateChildren(val));
          break;
        case "pets":
          dispatch(updatePets(val));
          break;
        default:
          break;
      }
    });
  }, [searchParams, dispatch]);

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
        controlledDate={value}
      />
      <RoomSidebar
        cabin={cabin}
        initialDate={{ checkin, checkout }}
        isDateUnavailable={isDateUnavailable(disabledRange)}
        controlledDate={value}
      />
    </BookDetails>
  );
}
