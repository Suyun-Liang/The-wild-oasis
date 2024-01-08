import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOverlayTriggerState } from "react-stately";
import { useDispatch, useSelector } from "react-redux";
import {
  DismissButton,
  Overlay,
  useButton,
  useDialog,
  useOverlayTrigger,
  usePopover,
} from "react-aria";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { HiOutlineUser, HiCalendarDays } from "react-icons/hi2";

import Select from "./SelectSearchCard";
import DateRangeCalender from "./DateRangeCalender";
import MenuGuests from "./MenuGuests";

import { formatDate, getParamsStr } from "../utils/helpers";
import {
  checkinAt,
  checkoutAt,
} from "../features/bookings/guests/bookingSlice";

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

const StyledPopover = styled.div`
  padding: 1rem;
  background-color: var(--color-grey-100);
  border-radius: 1.25rem;
`;

const Trigger = styled.span`
  &.group {
    grid-area: dateSelect;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: inherit;
  }
`;

function Button(props) {
  let ref = props.buttonRef;
  let { buttonProps } = useButton(props, ref);
  return (
    <Trigger
      {...buttonProps}
      ref={ref}
      style={props.style}
      className={props.type}
    >
      {props.children}
    </Trigger>
  );
}

function Dialog({ children, ...props }) {
  const ref = useRef(null);
  const { dialogProps } = useDialog(props, ref);

  return (
    <div {...dialogProps} ref={ref}>
      {children}
    </div>
  );
}

function Popover({ children, state, offset = 10, ...props }) {
  const popoverRef = useRef(null);
  const { popoverProps, underlayProps } = usePopover(
    { ...props, offset, popoverRef },
    state
  );

  return (
    <Overlay>
      <div {...underlayProps} className="underlay" />
      <StyledPopover {...popoverProps} ref={popoverRef} className="popover">
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </StyledPopover>
    </Overlay>
  );
}

function PopoverTrigger({ children, element, type, ...props }) {
  const ref = useRef(null);
  const state = useOverlayTriggerState(props);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    {
      type: "dialog",
    },
    state,
    ref
  );

  return (
    <>
      <Button {...triggerProps} buttonRef={ref} type={type}>
        {children}
      </Button>
      {state.isOpen && (
        <Popover {...props} triggerRef={ref} state={state}>
          <Dialog {...overlayProps}>{element}</Dialog>
        </Popover>
      )}
    </>
  );
}

function SearchCard() {
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

  const todayObj = today(getLocalTimeZone());

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

        <PopoverTrigger
          element={
            <DateRangeCalender
              minValue={todayObj}
              visibleDuration={{ months: 2 }}
            />
          }
          type="group"
        >
          <Select label={checkinLabel} />
          <Select label={checkoutLabel} />
        </PopoverTrigger>

        <PopoverTrigger element={<MenuGuests />} type="button">
          <Select label={guestLabel} />
        </PopoverTrigger>

        <Select as="button" label="Search" onClick={handleSubmit} />
      </StyledSearchCard>
    </Container>
  );
}

export default SearchCard;
