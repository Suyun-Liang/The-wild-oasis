import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { today, getLocalTimeZone } from "@internationalized/date";
import { HiOutlineUser, HiCalendarDays } from "react-icons/hi2";

import Select from "./SelectSearchCard";
import DateRangeCalender from "./date_range_calendar/DateRangeCalender";
import MenuGuests from "./MenuGuests";

import { formatDate, getParamsStr } from "../utils/helpers";
import { PopoverTrigger } from "./date_range_calendar/PopoverTrigger";

const Container = styled.div`
  padding-bottom: 15px;
  min-width: min-content;
`;

const StyledSearchCard = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "check-in check-out person ."
    "dateSelect dateSelect personSelect button";
  row-gap: 6px;
  column-gap: 15px;

  width: 100%;
  height: 12rem;
  border-radius: 1.25rem;
  padding: 1rem 2.5rem;
  box-shadow: var(--shadow-lg);
  background-color: var(--color-grey-200);
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

export function SearchCard() {
  const navigate = useNavigate();

  const {
    checkin,
    checkout,
    guests: { adults, children, pets },
  } = useSelector((state) => state.booking);

  const checkinLabel = formatDate(checkin, "MMM d");
  const checkoutLabel = formatDate(checkout, "MMM d");
  const guestNum = adults + children;
  const guestLabel =
    `${guestNum} ${guestNum === 1 ? "guest" : "guests"} ` +
    `${pets > 0 ? `, ${pets} ${pets === 1 ? "pet" : "pets"}` : ""}`;

  function handleSubmit() {
    navigate({
      pathname: "/rooms",
      search: getParamsStr({ checkin, checkout, adults, children, pets }),
    });
  }

  return (
    <Container>
      <StyledSearchCard>
        <Label>
          <HiCalendarDays />
          <span>Check-in</span>
        </Label>
        <Label>
          <HiCalendarDays />
          <span>Check-out</span>
        </Label>
        <Label>
          <HiOutlineUser />
          <span>Person</span>
        </Label>
        <div></div>

        <CheckinOutCard />
        <GuestCard />
        <Select as="button" label="Search" onClick={handleSubmit} />
      </StyledSearchCard>
    </Container>
  );
}

export function CheckinOutCard({ isDateUnavailable }) {
  const { checkin, checkout } = useSelector((state) => state.booking);

  const checkinLabel = formatDate(checkin, "MMM d");
  const checkoutLabel = formatDate(checkout, "MMM d");

  const todayObj = today(getLocalTimeZone());

  return (
    <PopoverTrigger
      element={
        <DateRangeCalender
          minValue={todayObj}
          visibleDuration={{ months: 2 }}
          isDateUnavailable={isDateUnavailable}
        />
      }
      type="group"
    >
      <Select label={checkinLabel} />
      <Select label={checkoutLabel} />
    </PopoverTrigger>
  );
}

export function GuestCard() {
  const {
    guests: { adults, children, pets },
  } = useSelector((state) => state.booking);

  const guestNum = adults + children;
  const guestLabel =
    `${guestNum} ${guestNum === 1 ? "guest" : "guests"} ` +
    `${pets > 0 ? `, ${pets} ${pets === 1 ? "pet" : "pets"}` : ""}`;

  return (
    <PopoverTrigger element={<MenuGuests />} type="button">
      <Select label={guestLabel} />
    </PopoverTrigger>
  );
}

export default SearchCard;
