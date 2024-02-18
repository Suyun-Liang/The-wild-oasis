import styled from "styled-components";

import DateRangeCalendar from "../date_range_calendar/DateRangeCalender.jsx";
import { RoomSidebar } from "./RoomSidebar.jsx";

import { useDate } from "../../context/DateContext.jsx";

const BookDetails = styled.div`
  display: flex;

  gap: 30px;
`;

export function RoomBookDetail({ cabin }) {
  const value = useDate();

  return (
    <BookDetails>
      <DateRangeCalendar aria-label="date calendar" controlledDate={value} />
      <RoomSidebar cabin={cabin} controlledDate={value} />
    </BookDetails>
  );
}
