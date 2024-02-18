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
  getFullName,
  getISONow,
  getISOStringWithHour,
  isDateInRange,
  isDateUnavailable,
  isEqualAfterToday,
  subtractDates,
} from "../utils/helpers";
import { useUnavailableDatesIn } from "../features/bookings/useBooking";
import { DateProvider, useDate } from "../context/DateContext";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getUnavailableDatesInCabin } from "../services/apiBookings";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { getCabin } from "../services/apiCabins";
import { getFlag } from "../services/apiCountries";
import useCreateGuest from "../features/bookings/useCreateGuest";
import useSettings from "../features/settings/useSettings";
import useDeleteGuest from "../features/bookings/useDeleteGuest";
import useCreateBooking from "../features/bookings/useCreateBooking";
import PriceDetail from "../ui/PriceDetail";

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
  return (
    <DateProvider>
      <Container>
        <Title>Confirm your booking</Title>
        <CreateBookingForm />
      </Container>
    </DateProvider>
  );
}

function CreateBookingForm() {
  const { isLoading: isLoadingCountries, countries } = useCountries();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { createOrGetGuest, isCreatingGuest } = useCreateGuest();
  const { createBooking, isCreatingBooking } = useCreateBooking();
  const { deleteGuest, isDeletingGuest } = useDeleteGuest();
  let { roomId } = useParams();
  roomId = Number(roomId);
  const value = useDate();

  // value of guests are from search params, if not exist, look at global state
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

  const { isLoading: isLoadingDisabledRange } = useUnavailableDatesIn(roomId, {
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

  async function onSubmit(data) {
    console.log(data);
    const {
      firstName,
      lastName,
      email: rawEmail,
      nationality,
      nationalID: rawNationalID,
      numGuests,
      cabinId,
      startDate: rawStartDate,
      endDate: rawEndDate,
      hasBreakfast,
      isPaid,
      observations,
    } = data;

    try {
      const cabin = await getCabin(Number(cabinId));
      const countryFlag = await getFlag(nationality);

      // 1. Prepare guest data
      const fullName = getFullName(firstName, lastName);
      const email = rawEmail.toLowerCase().trim();
      const nationalID = rawNationalID.trim();
      const startDate = getISOStringWithHour(rawStartDate);
      const endDate = getISOStringWithHour(rawEndDate);

      const guestData = {
        fullName,
        email,
        nationality,
        nationalID,
        countryFlag,
      };
      // 1.1 select or create a guest based on their nationalID
      createOrGetGuest(guestData, {
        onSuccess: ({ id: guestId }) => {
          //2. Prepare booking data
          const numNights = subtractDates(endDate, startDate);
          const cabinPrice =
            numNights * (cabin?.regularPrice - cabin?.discount);
          const extrasPrice = hasBreakfast
            ? numNights * numGuests * settings?.breakfastPrice
            : 0;
          const totalPrice = cabinPrice + extrasPrice;

          const bookingData = {
            created_at: getISONow(),
            startDate,
            endDate,
            numGuests,
            cabinId,
            guestId,
            hasBreakfast,
            isPaid,
            observations,
            status: "unconfirmed",
            numNights,
            cabinPrice,
            extrasPrice,
            totalPrice,
          };

          //2.2 create booking after guest created/selected successfully, or delete user
          // createBooking(bookingData, {
          //   onSuccess: () => {
          //     reset();
          //   },
          //   onError: () => {
          //     deleteGuest(guestId);
          //   },
          // });
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
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
                const disabledRange = await getUnavailableDatesInCabin(roomId, {
                  isDateInRange: true,
                });
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
                const disabledRange = await getUnavailableDatesInCabin(roomId, {
                  isDateInRange: true,
                });
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
            <FormRow label="Nationality ID" error={errors?.nationalID?.message}>
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

            <FormRow label="Note" error={errors?.observations?.message}>
              <Input
                type="text"
                id="observations"
                disabled={false}
                {...register("observations")}
              />
            </FormRow>

            <FormRow label="Add breakfast">
              <Checkbox
                type="checkbox"
                disabled={false}
                // {...register("hasBreakfast")}
              />
            </FormRow>

            <FormRow label="Price Detail">
              <PriceDetail />
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
  );
}

function EditButton({ opensWindow }) {
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
