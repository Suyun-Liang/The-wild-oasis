import { useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import useCabin from "../features/cabins/useCabin.js";
import LoadingCards from "../ui/LoadingCards.jsx";
import DateRangeCalendar from "../ui/DateRangeCalender.jsx";
import { useUnavailableDatesIn } from "../features/bookings/useBooking.js";
import { getLocalTimeZone, today } from "@internationalized/date";
import { isDateUnavailable } from "../utils/helpers.js";
import { useState } from "react";

const ImgContainer = styled.div`
  max-width: 130rem;
  margin: 0 auto;
  padding-top: 24px;
  padding-left: 12px;
  padding-right: 12px;
`;

const Img = styled.img`
  border-radius: 18px;
`;

const Desc = styled.div`
  font-size: 1.75rem;
  line-height: 2.7rem;
`;

function RoomsDetail() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");

  const { cabin, isLoading } = useCabin(roomId);
  const { dates: disabledRange } = useUnavailableDatesIn(roomId, {
    isDateInterval: true,
  });

  return (
    <>
      <div>{roomId}</div>
      <Hero cabin={cabin} isLoading={isLoading} />
      <DateRangeCalendar
        aria-label="date calendar"
        minValue={today(getLocalTimeZone())}
        isDateUnavailable={isDateUnavailable(disabledRange)}
        initialDate={{ checkin, checkout }}
      />
    </>
  );
}

function Hero({ cabin, isLoading }) {
  if (isLoading) {
    return (
      <LoadingCards
        numOfCards={1}
        size="large"
        imgSizes="large"
        descSizes="large"
      />
    );
  }
  return (
    <ImgContainer>
      <Img src={cabin?.image} alt="cabin" />
      <Desc>{cabin?.description}</Desc>
    </ImgContainer>
  );
}

export default RoomsDetail;
