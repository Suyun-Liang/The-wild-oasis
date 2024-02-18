import { useEffect, useState } from "react";
import {
  RangeCalendar,
  Button,
  CalendarGrid,
  CalendarCell,
  Heading,
  Text,
} from "react-aria-components";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  checkinAt,
  checkoutAt,
} from "../../features/bookings/guests/bookingSlice";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useUnavailableDatesIn } from "../../features/bookings/useBooking";
import { useParams, useSearchParams } from "react-router-dom";
import { isDateUnavailable } from "../../utils/helpers";
import useSettings from "../../features/settings/useSettings";

const StyledRangeCalendar = styled(RangeCalendar)`
  width: fit-content;
  max-width: 100%;
  padding: 1.25rem 2.25rem;

  & > header {
    display: flex;
    align-items: center;
    margin: 0 4px 1.75rem 4px;
  }

  & table {
    border-collapse: collapse;

    & td {
      padding: 2px 0;
    }
  }

  [slot="errorMessage"] {
    font-size: 1.4rem;
    color: var(--color-red-700);
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

  &[data-invalid] {
    background-color: var(--color-red-700);
    color: var(--color-grey-100);
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;

  gap: 20px;

  & > div {
    display: flex;
    gap: 35px;
  }
`;

function DateRangeCalender(props) {
  const [date, setDate] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  let { roomId } = useParams();
  roomId = Number(roomId);
  const { dates: disabledRange } = useUnavailableDatesIn(roomId, {
    isDateInterval: true,
  });
  const {
    isLoading: isLoadingSettings,
    settings: { minBookingLength, maxBookingLength } = {},
  } = useSettings();

  const value = props.controlledDate?.date || date;
  const onChangeValue = props.controlledDate?.setDate || setDate;
  const isDateFromProps = props.controlledDate !== undefined;

  function handleChange(date) {
    const start = date?.start;
    const end = date?.end;
    let formStart = start?.toString();
    let formEnd = end?.toString();

    if (formStart == formEnd) {
      formEnd = end?.add({ days: 1 }).toString();
    }

    if (isDateFromProps) {
      searchParams.set("checkin", formStart);
      searchParams.set("checkout", formEnd);
      setSearchParams(searchParams);
    } else {
      dispatch(checkinAt(formStart));
      dispatch(checkoutAt(formEnd));
    }
    onChangeValue(date);
  }
  const isSelectedRangeUnavailable = disabledRange?.some(
    (interval) =>
      value?.start?.compare(interval[1]) < 0 &&
      value?.end?.compare(interval[0]) >= 0
  );
  const isSelectedRangeInpast =
    value?.start?.compare(today(getLocalTimeZone())) < 0;
  let isInvalid = isSelectedRangeInpast || isSelectedRangeUnavailable;
  let isLessThanMinLength =
    minBookingLength && value?.end?.compare(value?.start) < minBookingLength;
  let isLongerThanMaxLength =
    maxBookingLength && value?.end?.compare(value?.start) > maxBookingLength;

  const errorMessage = isInvalid
    ? "Invalid date, please choose again"
    : isLessThanMinLength
    ? `duration stay should be at least ${minBookingLength} day`
    : isLongerThanMaxLength
    ? `duration stay should be at most ${maxBookingLength} day`
    : undefined;

  return (
    <StyledRangeCalendar
      minValue={today(getLocalTimeZone())}
      value={value}
      onChange={handleChange}
      isDateUnavailable={
        roomId !== undefined ? isDateUnavailable(disabledRange) : () => false
      }
      isInvalid={isLessThanMinLength || isLongerThanMaxLength}
      errorMessage={errorMessage}
      {...props}
    >
      <header>
        <StyledButton slot="previous">◀</StyledButton>
        <StyledHeading />
        <StyledButton slot="next">▶</StyledButton>
      </header>
      <Body>
        <div>
          <CalendarGrid>
            {(date) => <StyledCalendarCell date={date} />}
          </CalendarGrid>
          {props.visibleDuration?.months === 2 && (
            <CalendarGrid offset={{ months: 1 }}>
              {(date) => <StyledCalendarCell date={date} />}
            </CalendarGrid>
          )}
        </div>
        {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
      </Body>
    </StyledRangeCalendar>
  );
}

export default DateRangeCalender;
