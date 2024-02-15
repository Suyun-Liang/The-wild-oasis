import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";

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
import {
  formatDate,
  isDateInRange,
  isDateUnavailable,
  isEqualAfterToday,
} from "../utils/helpers";
import { useUnavailableDatesIn } from "../features/bookings/useBooking";
import { useDate } from "../context/DateContext";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getUnavailableDatesInCabin } from "../services/apiBookings";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

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
  roomId = Number(roomId);
  const value = useDate();

  // value of guests are from , if not exist, look at global state
  const {
    adults: stateAdults,
    children: stateChildren,
    pets: statePets,
  } = useSelector((state) => state.booking.guests);
  const {
    search: {
      adults: searchAdults,
      children: searchChildren,
      pets: searchPets,
      checkin,
      checkout,
    },
  } = useMySearchParams();

  let adults = searchAdults !== undefined ? searchAdults : stateAdults;
  let children = searchChildren !== undefined ? searchChildren : stateChildren;
  let pets = searchPets !== undefined ? searchPets : statePets;

  const guestNum = Number(adults) + Number(children);
  const guestLabel =
    `${guestNum} ${guestNum === 1 ? "guest" : "guests"} ` +
    `${Number(pets) > 0 ? `, ${pets} ${pets === 1 ? "pet" : "pets"}` : ""}`;

  const { dates: disabledRange, isLoading: isLoadingDisabledRange } =
    useUnavailableDatesIn(roomId, {
      isDateInterval: true,
    });

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      nationality: "",
      nationalID: "",
      observations: "",
      numGuests: guestNum,
      startDate: checkin,
      endDate: checkout,
      hasBreakfast: false,
      isPaid: false,
      cabinId: roomId,
    },
    mode: "onChange",
  });

  useEffect(() => {
    trigger(["startDate", "endDate", "numGuests"]);
    setValue("numGuests", guestNum);
    if (checkin && checkout) {
      setValue("startDate", checkin);
      setValue("endDate", checkout);
    }
  }, [checkin, checkout, guestNum, setValue, trigger]);

  function onSubmit(data) {
    console.log(data);
  }

  const isSelectedRangeUnavailable = disabledRange?.some(
    (interval) =>
      parseDate(checkin).compare(interval[1]) < 0 &&
      parseDate(checkout).compare(interval[0]) >= 0
  );
  const isSelectedRangeInpast =
    parseDate(checkin).compare(today(getLocalTimeZone())) < 0;
  let isInvalid = isSelectedRangeInpast || isSelectedRangeUnavailable;

  return (
    <Container>
      <Title>Confirm your booking</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="cabin">
          {roomId}
          <Input
            id="cabinId"
            disabled={false}
            hidden={true}
            {...register("cabinId", {
              value: roomId,
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
              required: "Please choose a date",
              validate: {
                isNotInDisabledRange: async (value) => {
                  const disabledRange = await getUnavailableDatesInCabin(
                    roomId,
                    {
                      isDateInRange: true,
                    }
                  );
                  return (
                    // return error if date is within the unavailable
                    !isDateInRange(value, disabledRange) || "Invalid checkin"
                  );
                },
                isLaterOrEqualToday: (value) => {
                  // return error if date is not after today
                  return (
                    isEqualAfterToday(value) ||
                    "Invalid checkin (checkin should be later than today)"
                  );
                },
              },
            })}
          />
          <Input
            id="endDate"
            disabled={false}
            hidden={true}
            {...register("endDate", {
              required: "Please choose a date",
              validate: {
                isNotInDisabledRange: async (value) => {
                  const disabledRange = await getUnavailableDatesInCabin(
                    roomId,
                    {
                      isDateInRange: true,
                    }
                  );
                  return (
                    // return error if date is within the unavailable
                    !isDateInRange(value, disabledRange) || "Invalid checkout"
                  );
                },
              },
            })}
          />
          <EditButton
            opensWindow={
              <DateRangeCalender
                visibleDuration={{ months: 2 }}
                controlledDate={value}
                isDateUnavailable={isDateUnavailable(disabledRange)}
                isInvalid={isInvalid}
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

        {!isLoadingDisabledRange &&
          !(errors?.startDate || errors?.endDate || errors.numGuests) && (
            <>
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
                  {...register("nationality", {
                    required: "This field id requied",
                  })}
                >
                  {countries?.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </StyledSelect>
              </FormRow>
              <FormRow
                label="Nationality ID"
                error={errors?.nationalID?.message}
              >
                <Input
                  type="text"
                  id="nationalID"
                  disabled={false}
                  {...register("nationalID", {
                    required: "This field is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Please provide a valid national ID",
                    },
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
            </>
          )}
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
