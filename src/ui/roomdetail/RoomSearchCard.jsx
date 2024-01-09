import styled from "styled-components";

const Container = styled.div`
  display: grid;
  min-width: 300px;

  grid-template-columns: 1fr 1fr;
`;

const PersonArea = styled.div`
  grid-column: 1 / -1;
`;

export function RoomSearchCard() {
  return (
    <Container>
      <div>
        <div>check-in</div>
        <div>mm/dd/yyyy</div>
      </div>
      <div>
        <div>check-out</div>
        <div>mm/dd/yyyy</div>
      </div>
      <PersonArea>Person</PersonArea>
    </Container>
  );
}
