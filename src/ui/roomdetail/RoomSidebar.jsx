import styled from "styled-components";
import Button from "../Button";
import { RoomSearchCard } from "./RoomSearchCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

export function RoomSidebar({
  cabin,
  isDateUnavailable,
  initialDate,
  controlledDate,
}) {
  return (
    <Container>
      <PriceTitle>
        €{cabin?.regularPrice} <span>night</span>
      </PriceTitle>
      <RoomSearchCard
        isDateUnavailable={isDateUnavailable}
        initialDate={initialDate}
        controlledDate={controlledDate}
      />
      <ReserveButton>Reserve</ReserveButton>
      <div>Price detail</div>
    </Container>
  );
}
