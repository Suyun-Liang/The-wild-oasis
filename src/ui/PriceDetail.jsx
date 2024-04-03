import { useParams } from "react-router-dom";
import useCabin from "../features/cabins/useCabin";
import { subtractDates } from "../utils/helpers";
import { useMySearchParams } from "../hooks/useMySearchParams";
import styled from "styled-components";
import useSettings from "../features/settings/useSettings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  gap: 8px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:last-child {
    font-weight: 500;
    justify-content: end;
  }
`;

export default function PriceDetail() {
  let { roomId } = useParams();
  roomId = Number(roomId);
  const { isLoading: isLoadingCabin, cabin } = useCabin(roomId);
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { search } = useMySearchParams();

  const numNights = subtractDates(search.checkout, search.checkin);
  const perNightPrice = cabin?.regularPrice - cabin?.discount;
  const cabinPrice = numNights * perNightPrice;
  const numGuests = search.adults === undefined ? 0 : JSON.parse(search.adults);
  const hasBreakfast =
    search.hasBreakfast === undefined ? false : JSON.parse(search.adults);
  const breakfastPrice = settings?.breakfastPrice;

  const extrasPrice = hasBreakfast ? numNights * numGuests * breakfastPrice : 0;
  return (
    numNights && (
      <Container>
        <Row>
          <span>
            €{perNightPrice} &times;
            {`${numNights} ${numNights > 1 ? "nights" : "night"}`}
          </span>
          <span>{String(cabinPrice)}</span>
        </Row>
        {hasBreakfast && (
          <Row>
            <span>
              €{breakfastPrice} &times;
              {`${numNights} ${numNights > 1 ? "nights" : "night"}`} &times;
              {`${numGuests} ${numGuests > 1 ? "adults" : "adult"}`}
            </span>
            <span>{String(extrasPrice)}</span>
          </Row>
        )}
        <Row>
          <div>Total: {cabinPrice + extrasPrice}</div>
        </Row>
      </Container>
    )
  );
}
