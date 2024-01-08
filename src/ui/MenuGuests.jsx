import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  decrementAdults,
  decrementChildren,
  decrementPets,
  incrementAdults,
  incrementChildren,
  incrementPets,
} from "../features/bookings/guests/bookingSlice";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";

const Table = styled.div``;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2.75rem;

  padding: 1.5rem 1.6rem;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-300);
  }
`;
const Section = styled.section``;
const TitleLable = styled.div``;
const TiltleDesc = styled.div`
  font-size: 1.2rem;
  color: var(--color-grey-500);
`;

const Stepper = styled.div`
  width: 8.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Button = styled.button`
  width: 3rem;
  height: 3rem;
  color: var(--color-grey-500);
  border: 1px solid var(--color-grey-500);
  border-radius: 50%;

  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const Value = styled.div``;

function Row({ titleLabel, value, incFn, decFn, max, min }) {
  const dispatch = useDispatch();

  function handleInc(incFn) {
    return () => dispatch(incFn());
  }
  function handleDec(decFn) {
    return () => dispatch(decFn());
  }

  let description;
  switch (titleLabel) {
    case "Adult":
      description = "Ages 13 or above";
      break;
    case "Children":
      description = "Age 2-12";
      break;
    default:
      description = "";
      break;
  }
  return (
    <StyledRow role="row">
      <Section>
        <TitleLable>{titleLabel}</TitleLable>
        <TiltleDesc>{description}</TiltleDesc>
      </Section>
      <Stepper>
        <Button onClick={handleDec(decFn)} disabled={value <= min}>
          <span>
            <HiOutlineMinus />
          </span>
        </Button>
        <Value>{value}</Value>
        <Button onClick={handleInc(incFn)} disabled={value >= max}>
          <span>
            <HiOutlinePlus />
          </span>
        </Button>
      </Stepper>
    </StyledRow>
  );
}

function MenuGuests() {
  const { adults, children, pets } = useSelector(
    (state) => state.booking.guests
  );

  return (
    <Table role="table">
      <Row
        titleLabel="Adult"
        value={adults}
        min={1}
        max={30}
        incFn={incrementAdults}
        decFn={decrementAdults}
      />
      <Row
        titleLabel="Children"
        value={children}
        min={0}
        max={10}
        incFn={incrementChildren}
        decFn={decrementChildren}
      />
      <Row
        titleLabel="Pets"
        value={pets}
        min={0}
        max={5}
        incFn={incrementPets}
        decFn={decrementPets}
      />
    </Table>
  );
}

export default MenuGuests;
