import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import { useCabinsIn } from "../features/cabins/useCabins";
import { useObserver } from "../hooks/useObserver";

import { Card } from "../ui/Card";
import LoadingCards from "../ui/LoadingCards";
import { getISOStringWithHour } from "../utils/helpers";
import { ROOM_PAGE_SIZE } from "../utils/constants";
import { useMySearchParams } from "../hooks/useMySearchParams";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 20px;

  align-items: center;
`;

const Container = styled.div`
  display: ${(props) => (props.$visible ? "flex" : "none")};
  justify-content: space-around;
  flex-wrap: wrap;

  gap: 10px;
`;

Container.defaultProps = { $visible: true };

function RoomsContent() {
  const { search } = useMySearchParams();

  const checkin = getISOStringWithHour(search?.checkin);
  const checkout = getISOStringWithHour(search?.checkout);

  const {
    cabins,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingCabins,
  } = useCabinsIn({
    checkin,
    checkout,
  });

  const { myRef } = useObserver({ onGrabData: fetchNextPage });

  return (
    <Wrapper>
      <Container>
        {cabins?.map((cabin) => (
          <Card key={cabin.id} cabin={cabin} search={search} />
        ))}
      </Container>
      <Container ref={myRef} $visible={isLoadingCabins || hasNextPage}>
        <LoadingCards numOfCards={ROOM_PAGE_SIZE} />
      </Container>
    </Wrapper>
  );
}

function Rooms() {
  return (
    <>
      <RoomsContent />
    </>
  );
}

export default Rooms;
