import { useEffect, useState } from "react";
import {
  RangeCalendar,
  Button,
  CalendarGrid,
  CalendarCell,
  Heading,
} from "react-aria-components";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  checkinAt,
  checkoutAt,
} from "../../features/bookings/guests/bookingSlice";
import { parseDate } from "@internationalized/date";
import { useDate } from "../../context/DateContext";

const StyledRangeCalendar = styled(RangeCalendar)`
  width: fit-content;
  max-width: 100%;
  padding: 1.25rem 2.25rem;

  & > header {
    display: flex;
    align-items: center;
    margin: 0 4px 1.75rem 4px;
  }

  & > div {
    display: flex;
    gap: 3.5rem;
  }

  & table {
    border-collapse: collapse;

    & td {
      padding: 2px 0;
    }
  }
`;

const StyledHeading = styled(Heading)`
  flex: 1;
  text-align: center;
  font-size: 1.975rem;
`;

const StyledButton = styled(Button)`
  width: 3rem;
  height: 3rem;
  color: var(--color-grey-800);
  background-color: var(--color-grey-200);
  border: 1px solid var(--color-grey-800);
  border-radius: 0.5rem;

  &:focus {
    outline: 2px solid var(--color-grey-800);
  }
`;

const StyledCalendarCell = styled(CalendarCell)`
  width: 3.786rem;
  line-height: 3.686rem;
  text-align: center;
  border-radius: 6px;
  font-size: 1.75rem;

  &:focus-visible {
    outline: none;
  }

  &[data-outside-month] {
    display: none;
  }

  &[data-pressed] {
    background: var(--color-red-700);
  }

  &[data-focus-visible] {
    box-shadow: inset 0 0 0 2px var(--color-red-800);
  }

  &[data-selected] {
    background: var(--color-grey-400);
    color: var(--color-grey-800);
    border-radius: 0;

    &[data-focus-visible] {
      box-shadow: inset 0 0 0 1px var(--color-grey-900),
        inset 0 0 0 3px var(--color-grey-600);
    }
  }

  &[data-selection-start] {
    border-start-start-radius: 6px;
    border-end-start-radius: 6px;
  }
  &[data-selection-end] {
    border-start-end-radius: 6px;
    border-end-end-radius: 6px;
  }
  &[data-disabled] {
    color: var(--color-grey-300);
  }

  &[data-unavailable] {
    text-decoration: line-through;
    color: var(--color-grey-300);
  }
`;

function DateRangeCalender(props) {
  const [date, setDate] = useState(
    props.initialDate?.checkin && props.initialDate?.checkout
      ? {
          start: parseDate(props.initialDate.checkin),
          end: parseDate(props.initialDate.checkout),
        }
      : null
  );

  const dispatch = useDispatch();

  const start = date?.start;
  const end = date?.end;

  useEffect(() => {}, []);

  useEffect(() => {
    let formStart = start?.toString();
    let formEnd = end?.toString();

    if (formStart == formEnd) {
      formEnd = end?.add({ days: 1 }).toString();
    }
    dispatch(checkinAt(formStart));
    dispatch(checkoutAt(formEnd));
  }, [start, end, dispatch]);

  return (
    <StyledRangeCalendar
      value={props.controlledDate?.date || date}
      onChange={props.controlledDate?.setDate || setDate}
      {...props}
    >
      <header>
        <StyledButton slot="previous">◀</StyledButton>
        <StyledHeading />
        <StyledButton slot="next">▶</StyledButton>
      </header>
      <div>
        <CalendarGrid>
          {(date) => <StyledCalendarCell date={date} />}
        </CalendarGrid>
        {props.visibleDuration?.months === 2 && (
          <CalendarGrid offset={{ months: 1 }}>
            {(date) => <StyledCalendarCell date={date} />}
          </CalendarGrid>
        )}

        {/* {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>} */}
      </div>
    </StyledRangeCalendar>
  );
}

export default DateRangeCalender;
