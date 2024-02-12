import { useParams } from "react-router-dom";

import useCabin from "../features/cabins/useCabin.js";
import { Hero } from "../ui/Hero.jsx";
import { RoomBookDetail } from "../ui/roomdetail/RoomBookDetail.jsx";

function RoomsDetail() {
  const { roomId } = useParams();

  const { cabin, isLoading } = useCabin(roomId);

  return (
    <>
      <div>{roomId}</div>
      <Hero cabin={cabin} isLoading={isLoading} />

      <RoomBookDetail cabin={cabin} />
    </>
  );
}

export default RoomsDetail;
