import styled from "styled-components";

import { CheckinOutCard, GuestCard } from "../SearchCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
`;

export function RoomSearchCard({
  isDateUnavailable,
  initialDate,
  controlledDate,
}) {
  return (
    <Container>
      <CheckinOutCard
        isDateUnavailable={isDateUnavailable}
        initialDate={initialDate}
        controlledDate={controlledDate}
      />
      <GuestCard />
    </Container>
  );
}
