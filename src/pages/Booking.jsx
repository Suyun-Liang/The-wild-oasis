import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
import { isSameDay } from "date-fns";

import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import MenuGuests from "../ui/MenuGuests";
import DateRangeCalender from "../ui/date_range_calendar/DateRangeCalender";

import { StyledSelect } from "../features/bookings/CreateBookingForm";
import { useMySearchParams } from "../hooks/useMySearchParams";
import { useCountries } from "../hooks/useCountries";
import { formatDate, isDateUnavailable } from "../utils/helpers";
import { useUnavailableDatesIn } from "../features/bookings/useBooking";
import { useDate } from "../context/DateContext";

const Container = styled.div``;
const Title = styled.h1``;
const StyledEditButton = styled.button`
  background-color: unset;
  border: unset;
  font-weight: 500;
  width: fit-content;

  &:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
  }
`;

function Booking() {
  const { isLoading: isLoadingCountries, countries } = useCountries();
  let { roomId } = useParams();
  const value = useDate();
  const {
    search: { adults, children, pets, checkin, checkout },
  } = useMySearchParams();
  const { dates: disabledRange } = useUnavailableDatesIn(Number(roomId), {
    isDateInterval: true,
  });

  const guestNum = Number(adults) + Number(children);
  const guestLabel =
    `${guestNum} ${guestNum === 1 ? "guest" : "guests"} ` +
    `${Number(pets) > 0 ? `, ${pets} ${pets === 1 ? "pet" : "pets"}` : ""}`;

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      nationality: "",
      nationalID: "",
      observations: "",
      numGuests: 1,
      startDate: null,
      endDate: null,
      hasBreakfast: false,
      isPaid: false,
      cabinId: { roomId },
    },
  });

  return (
    <Container>
      <Title>Confirm your booking</Title>
      <Form>
        <FormRow label="cabin">
          {roomId}
          <Input
            id="cabinId"
            disabled={false}
            hidden={true}
            {...register("cabinId", {
              valueAsNumber: true,
              required: true,
            })}
            readOnly={true}
          ></Input>
        </FormRow>

        <FormRow
          label="Date"
          error={errors?.startDate?.message || errors?.endDate?.message}
        >
          <div>
            {formatDate(checkin, "MMM dd")} - {formatDate(checkout, "MMM dd")}
          </div>

          <Input
            id="startDate"
            disabled={false}
            hidden={true}
            {...register("startDate", {
              valueAsDate: true,
              required: "Please choose a check in date",
            })}
          />
          <Input
            id="endDate"
            disabled={false}
            hidden={true}
            {...register("endDate", {
              valueAsDate: true,
              required: "Please choose a check in date",
              validate: (value) =>
                !isSameDay(value, getValues("startDate")) ||
                "duration at least 1 day",
            })}
          />
          <EditButton
            opensWindow={
              <DateRangeCalender
                visibleDuration={{ months: 2 }}
                controlledDate={value}
                isDateUnavailable={isDateUnavailable(disabledRange)}
              />
            }
          />
        </FormRow>

        <FormRow label="Number of guests" error={errors?.numGuests?.message}>
          <div>{guestLabel}</div>
          <Input
            type="number"
            id="numGuests"
            disabled={false}
            hidden={true}
            {...register("numGuests", {
              valueAsNumber: true,
              required: "This field is required",
              min: { value: 1, message: "Guest should be at least 1" },
            })}
          />
          <EditButton opensWindow={<MenuGuests />} />
        </FormRow>

        <FormRow label="First Name" error={errors?.firstName?.message}>
          <Input
            type="text"
            id="firstName"
            disabled={false}
            {...register("firstName", {
              required: "This field is required",
              minLength: {
                value: 2,
                message: "First name should be at least 2 characters",
              },
            })}
          />
        </FormRow>

        <FormRow label="Last Name" error={errors?.lastName?.message}>
          <Input
            type="text"
            id="lastName"
            disabled={false}
            {...register("lastName", {
              required: "This field is required",
              minLength: {
                value: 2,
                message: "Last name should be at least 2 characters",
              },
            })}
          />
        </FormRow>

        <FormRow label="Email" error={errors?.email?.message}>
          <Input
            type="email"
            id="email"
            disabled={false}
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
          />
        </FormRow>
        <FormRow label="Nationality" error={errors?.nationality?.message}>
          <StyledSelect
            id="nationality"
            disabled={false}
            {...register("nationality", { required: "This field id requied" })}
          >
            {countries?.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </StyledSelect>
        </FormRow>
        <FormRow label="Nationality ID" error={errors?.nationalID?.message}>
          <Input
            type="text"
            id="nationalID"
            disabled={false}
            {...register("nationalID", {
              required: "This field is required",
            })}
          />
        </FormRow>

        <FormRow label="Add breakfast">
          <Checkbox
            type="checkbox"
            disabled={false}
            // {...register("hasBreakfast")}
          />
        </FormRow>
        <FormRow>
          <Button
            type="button"
            $variation="secondary"
            className="modal_btn"
            onClick={reset}
          >
            Reset
          </Button>
          <Button className="modal_btn">Submit</Button>
        </FormRow>
      </Form>
    </Container>
  );
}

function EditButton({ opensWindow }) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <Modal>
      <Modal.Open opens="editBook">
        <StyledEditButton>Edit</StyledEditButton>
      </Modal.Open>
      <Modal.Window name="editBook">{opensWindow}</Modal.Window>
    </Modal>
  );
}

export default Booking;
