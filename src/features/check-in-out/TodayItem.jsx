import styled from "styled-components";
import { Link } from "react-router-dom";

import Tag from "../../ui/Tag";
import Button from "../../ui/Button";
import CheckoutButton from "./CheckoutButton";
import { Flag } from "../../ui/Flag";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({ activities }) {
  const { id, status, guests, numNights } = activities;
  return (
    <StyledTodayItem>
      {status === "unconfirmed" && <Tag $type="green">Arriving</Tag>}
      {status === "checked-in" && <Tag $type="blue">Departing</Tag>}
      <Flag src={guests.countryFlag} alt={`flag of ${guests.nationality}`} />
      <Guest>{guests.fullName}</Guest>
      <div>{numNights} nights</div>
      {status === "unconfirmed" && (
        <Button
          $variation="primary"
          $size="small"
          as={Link}
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {status === "checked-in" && <CheckoutButton bookingId={id} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
