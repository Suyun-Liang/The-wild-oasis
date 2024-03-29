import styled from "styled-components";
import Button from "../Button";
import { RoomSearchCard } from "./RoomSearchCard";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import PriceDetail from "../PriceDetail";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriceTitle = styled.div`
  span {
    font-size: 1.3rem;
  }
`;

const ReserveButton = styled(Button)`
  background-color: var(--color-grey-600);

  &:hover {
    background-color: var(--color-grey-700);
  }
`;

export function RoomSidebar({ cabin, controlledDate }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const guests = useSelector((state) => state.booking.guests);
  let searchObj = {};

  for (let param of searchParams) {
    const [key, value] = [param[0], param[1]];
    searchObj[key] = value;
  }

  function handleClick() {
    navigate({
      pathname: `/book/${cabin.id}`,
      search: createSearchParams({ ...guests, ...searchObj }).toString(),
    });
  }

  return (
    <Container>
      <PriceTitle>
        €{cabin?.regularPrice} <span>night</span>
      </PriceTitle>
      <RoomSearchCard controlledDate={controlledDate} />
      <ReserveButton onClick={handleClick}>Reserve</ReserveButton>
      <PriceDetail />
    </Container>
  );
}
