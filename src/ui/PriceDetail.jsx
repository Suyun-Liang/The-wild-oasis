import { useParams } from "react-router-dom";
import useCabin from "../features/cabins/useCabin";
import { subtractDates } from "../utils/helpers";
import { useMySearchParams } from "../hooks/useMySearchParams";
import styled from "styled-components";

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
  const { search } = useMySearchParams();

  const numNights = subtractDates(search.checkout, search.checkin);
  const perNightPrice = cabin?.regularPrice - cabin?.discount;
  const cabinPrice = numNights * perNightPrice;

  return (
    <Container>
      <Row>
        <span>
          €{perNightPrice} &times; {numNights}
        </span>
        <span>{cabinPrice}</span>
      </Row>
      <Row>
        <div>Total: {cabinPrice}</div>
      </Row>
    </Container>
  );
}
