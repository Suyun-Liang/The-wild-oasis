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
import { useSearchParams } from "react-router-dom";
import { useMySearchParams } from "../hooks/useMySearchParams";

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

function Row({
  titleLabel,
  value,
  isValueFromSearchParam,
  incFn,
  decFn,
  max,
  min,
}) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleClick(fn) {
    return () => {
      dispatch(fn());
      // searchParams.set({ [titleLabel.toLowerCase()]: value });
      // setSearchParams(searchParams);
    };
  }

  function incrementSearchParam() {
    searchParams.set(titleLabel.toLowerCase(), (value += 1));
    setSearchParams(searchParams);
  }
  function decrementSearchParam() {
    searchParams.set(titleLabel.toLowerCase(), (value -= 1));
    setSearchParams(searchParams);
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
        <Button
          onClick={
            !isValueFromSearchParam ? handleClick(decFn) : decrementSearchParam
          }
          disabled={value <= min}
        >
          <span>
            <HiOutlineMinus />
          </span>
        </Button>
        <Value>{value}</Value>
        <Button
          onClick={
            !isValueFromSearchParam ? handleClick(incFn) : incrementSearchParam
          }
          disabled={value >= max}
        >
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

  const { search } = useMySearchParams();

  const action = {
    adults: { incrementAdults, decrementAdults },
    children: { incrementChildren, decrementChildren },
    pets: { incrementPets, decrementPets },
  };

  return (
    <Table role="table">
      <Row
        titleLabel="Adults"
        value={
          search?.adults
            ? !(Number(search.adults) > 0)
              ? 1
              : Number(search.adults)
            : adults
        }
        isValueFromSearchParam={search?.adults !== undefined}
        min={1}
        max={30}
        incFn={action.adults.incrementAdults}
        decFn={action.adults.decrementAdults}
      />
      <Row
        titleLabel="Children"
        value={
          search?.children
            ? !(Number(search.children) >= 0)
              ? 0
              : Number(search.children)
            : children
        }
        isValueFromSearchParam={search?.children !== undefined}
        min={0}
        max={10}
        incFn={action.children.incrementChildren}
        decFn={action.children.decrementChildren}
      />
      <Row
        titleLabel="Pets"
        value={
          search?.pets
            ? !(Number(search.pets) >= 0)
              ? 0
              : Number(search.pets)
            : pets
        }
        isValueFromSearchParam={search?.pets !== undefined}
        min={0}
        max={5}
        incFn={action.pets.incrementPets}
        decFn={action.pets.decrementPets}
      />
    </Table>
  );
}

export default MenuGuests;
