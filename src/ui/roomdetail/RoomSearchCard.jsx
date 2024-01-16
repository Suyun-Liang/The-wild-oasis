import styled from "styled-components";
import { today, getLocalTimeZone } from "@internationalized/date";

import { PopoverTrigger } from "../date_range_calendar/PopoverTrigger";
import DateRangeCalender from "../date_range_calendar/DateRangeCalender";
import Select from "../SelectSearchCard";
import { SearchCard, CheckinOutCard, GuestCard } from "../SearchCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
`;

export function RoomSearchCard({
  isDateUnavailable,
  initialDate,
  controlledDate,
}) {
  return (
    <Container>
      {/* <PopoverTrigger
        element={
          <DateRangeCalender
            minValue={todayObj}
            visibleDuration={{ months: 2 }}
            initialDate={initialDate}
          />
        }
        type="group"
      >
        <div>
          <div>check-in</div>
          <div>mm/dd/yyyy</div>
        </div>
        <div>
          <div>check-out</div>
          <div>mm/dd/yyyy</div>
        </div>
      </PopoverTrigger>

      <PopoverTrigger>
        <Select label="guest" />
      </PopoverTrigger> */}
      <CheckinOutCard
        isDateUnavailable={isDateUnavailable}
        initialDate={initialDate}
        controlledDate={controlledDate}
      />
      <GuestCard />
    </Container>
  );
}
