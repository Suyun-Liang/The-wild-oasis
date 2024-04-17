import { useParams } from "react-router-dom";
import styled from "styled-components";

import useCabin from "../features/cabins/useCabin.js";
import { Hero } from "../ui/Hero.jsx";
import { RoomBookDetail } from "../ui/roomdetail/RoomBookDetail.jsx";
import { DateProvider } from "../context/DateContext.jsx";

const Container = styled.div`
  margin: 12px 32px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

function RoomsDetail() {
  const { roomId } = useParams();

  const { cabin, isLoading } = useCabin(roomId);

  return (
    <Container>
      <DateProvider>
        <h1>Room: {roomId}</h1>
        <Hero cabin={cabin} isLoading={isLoading} />
        <RoomBookDetail cabin={cabin} />
      </DateProvider>
    </Container>
  );
}

export default RoomsDetail;
