import styled from "styled-components";

import DateRangeCalendar from "../date_range_calendar/DateRangeCalender.jsx";
import { RoomSidebar } from "./RoomSidebar.jsx";

import { useDate } from "../../context/DateContext.jsx";

const BookDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

export function RoomBookDetail({ cabin }) {
  const value = useDate();

  return (
    <BookDetails>
      <DateRangeCalendar
        aria-label="date calendar"
        visibleDuration={{ months: 2 }}
        controlledDate={value}
        $noPadding={true}
      />

      <RoomSidebar cabin={cabin} controlledDate={value} />
    </BookDetails>
  );
}
