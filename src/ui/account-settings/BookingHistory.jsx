import styled from "styled-components";
import Spinner from "../Spinner";
import { useBookingFrom } from "../../features/bookings/useBooking";
import useUser from "../../features/authentication/useUser";
import { formatDate } from "../../utils/helpers";
const Title = styled.h1``;
const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Text = styled.div``;

function BookingHistory() {
  const { user, isLoading: isLoadingUser } = useUser();
  const { data, isLoading: isLoadingBooking } = useBookingFrom(user?.id);
  const isLoading = isLoadingUser || isLoadingBooking;

  return (
    <div>
      <Title>Booking History</Title>
      <Main>
        {isLoading ? (
          <Spinner />
        ) : (
          data?.map((booking) => (
            <HistoryCard key={booking.id} data={booking} />
          ))
        )}
      </Main>
    </div>
  );
}

const CardContainer = styled.div`
  display: flex;
  padding-bottom: 20px;
  gap: 40px;

  &:not(:last-child) {
    border-bottom: 1px dotted var(--color-grey-400);
  }
`;

const ImgBox = styled.div`
  width: 300px;
  height: 200px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`;

const Label = styled.div`
  font-size: 1.25rem;
`;

function HistoryCard({ data }) {
  const {
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    hasBreakfast,
    observations,
    cabins,
  } = data;
  return (
    <CardContainer>
      <ImgBox>
        <Img
          className="Image"
          src={cabins.image}
          alt={`image of cabin ${cabins.name}`}
        />
      </ImgBox>
      <InfoBox>
        <Label>Check-in: </Label>
        <div>{formatDate(startDate, "MMM-dd-yyyy")}</div>
        <Label>Check-out: </Label>
        <div>{formatDate(endDate, "MMM-dd-yyyy")}</div>
        <Label>Guest Number:</Label>
        <div> {numGuests}</div>
      </InfoBox>
    </CardContainer>
  );
}

export default BookingHistory;
