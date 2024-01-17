import styled from "styled-components";
import Button from "../Button";
import { RoomSearchCard } from "./RoomSearchCard";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  function handleClick() {
    navigate("/book");
  }

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
      <ReserveButton onClick={handleClick}>Reserve</ReserveButton>
      <div>Price detail</div>
    </Container>
  );
}
