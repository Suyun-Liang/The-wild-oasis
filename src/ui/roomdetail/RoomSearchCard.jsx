import styled from "styled-components";

import { CheckinOutCard, GuestCard } from "../SearchCard";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
`;

export function RoomSearchCard({ isDateUnavailable, controlledDate }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    guests: { adults, children, pets },
  } = useSelector((state) => state.booking);

  useEffect(() => {
    if (adults > 0) {
      searchParams.set("adults", adults);
    }
    if (children >= 0) {
      searchParams.set("children", children);
    }
    if (pets >= 0) {
      searchParams.set("pets", pets);
    }

    setSearchParams(searchParams);
  }, [adults, children, pets, searchParams, setSearchParams]);
  return (
    <Container>
      <CheckinOutCard
        isDateUnavailable={isDateUnavailable}
        controlledDate={controlledDate}
      />
      <GuestCard />
    </Container>
  );
}
