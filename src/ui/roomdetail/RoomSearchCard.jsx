import styled from "styled-components";

import { CheckinOutCard, GuestCard } from "../SearchCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  gap: 3px;
`;

export function RoomSearchCard({ controlledDate }) {
  return (
    <Container>
      <CheckinOutCard controlledDate={controlledDate} />
      <GuestCard doubleWidth={true} />
    </Container>
  );
}
