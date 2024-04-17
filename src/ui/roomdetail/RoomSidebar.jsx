import styled from "styled-components";
import Button from "../Button";
import { RoomSearchCard } from "./RoomSearchCard";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PriceDetail from "../PriceDetail";
import { useMySearchParams } from "../../hooks/useMySearchParams";
import AddBreakFast from "../AddBreakFast";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: max-content;
  padding-right: 15px;
`;

const PriceTitle = styled.div`
  span {
    font-size: 1.3rem;
  }
`;

const ReserveButton = styled(Button)`
  background-color: var(--color-grey-600);

  &:hover {
    background-color: var(--color-grey-700);
  }
`;

export function RoomSidebar({ cabin, controlledDate }) {
  const navigate = useNavigate();
  const { search } = useMySearchParams();
  const guests = useSelector((state) => state.booking.guests);

  function handleClick() {
    navigate({
      pathname: `/book/${cabin.id}`,
      search: createSearchParams({ ...guests, ...search }).toString(),
    });
  }

  return (
    <Container>
      <PriceTitle>
        €{cabin?.regularPrice} <span>night</span>
      </PriceTitle>
      <RoomSearchCard controlledDate={controlledDate} />
      <ReserveButton onClick={handleClick}>Reserve</ReserveButton>
      <AddBreakFast />
      <PriceDetail />
    </Container>
  );
}
