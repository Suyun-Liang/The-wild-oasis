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
import { useMySearchParams } from "../hooks/useMySearchParams";

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

export function CheckinOutCard({ controlledDate }) {
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
          controlledDate={controlledDate}
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
    adults: stateAdults,
    children: stateChildren,
    pets: statePets,
  } = useSelector((state) => state.booking.guests);

  const {
    search: {
      adults: searchAdults,
      children: searchChildren,
      pets: searchPets,
    },
  } = useMySearchParams();

  let adults = searchAdults !== undefined ? searchAdults : stateAdults;
  let children = searchChildren !== undefined ? searchChildren : stateChildren;
  let pets = searchPets !== undefined ? searchPets : statePets;

  const guestNum = Number(adults) + Number(children);
  const guestLabel =
    `${guestNum} ${guestNum === 1 ? "guest" : "guests"} ` +
    `${Number(pets) > 0 ? `, ${pets} ${pets === 1 ? "pet" : "pets"}` : ""}`;

  return (
    <PopoverTrigger element={<MenuGuests />} type="button">
      <Select label={guestLabel} />
    </PopoverTrigger>
  );
}

export default SearchCard;
