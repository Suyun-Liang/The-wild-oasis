import styled from "styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { addMonths, endOfMonth, isSameDay } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

import useCabins from "../cabins/useCabins";
import useSettings from "../settings/useSettings";
import { useCountries } from "../../hooks/useCountries";
import useCreateGuest from "./useCreateGuest";
import useCreateBooking from "./useCreateBooking";
import useDeleteGuest from "./useDeleteGuest";
import { useUnavailableDatesIn } from "./useBooking";
import { getCabin, getCabins } from "../../services/apiCabins";
import { getFlag } from "../../services/apiCountries";

import {
  getISONow,
  subtractDates,
  isLaterThanOrEqualToday,
  getFullName,
  isLaterThanStartDate,
  getISOStringWithHour,
  getDatesBetween,
} from "../../utils/helpers";

export const StyledSelect = styled.select`
  font-size: 1.4rem;
  font-weight: 500;
  max-width: 232px;
  padding: 0.8rem 0.9rem;
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
`;

const Checkbox = styled.input`
  height: 2.4rem;
  width: 2.4rem;
  outline-offset: 2px;
  transform-origin: 0;
  accent-color: var(--color-brand-600);

  &:disabled {
    accent-color: var(--color-brand-600);
  }
`;

function CreateBookingForm({ onCloseModal }) {
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  const { isLoading: isLoadingCountries, countries } = useCountries();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  // const { isLoading: isLoadingCabinBooking, cabinBooking } = useCabinBooking();
  const { createOrGetGuest, isCreatingGuest } = useCreateGuest();
  const { createBooking, isCreatingBooking } = useCreateBooking();
  const { deleteGuest, isDeletingGuest } = useDeleteGuest();
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const { cabins } = await getCabins();
      return {
        firstName: "",
        lastName: "",
        email: "",
        nationality: "",
        nationalID: "",
        observations: "",
        numGuests: 1,
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
        hasBreakfast: false,
        isPaid: false,
        cabinId: cabins?.at(0).id,
      };
    },
  });

  const watchCabinId = watch("cabinId");
  const { dates: unavailableDates, isLoading: isLoadingDates } =
    useUnavailableDatesIn(watchCabinId);

  const isLoading =
    isLoadingSettings ||
    isCreatingGuest ||
    isCreatingBooking ||
    isDeletingGuest;

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
          createBooking(bookingData, {
            onSuccess: () => {
              reset();
              onCloseModal();
            },
            onError: () => {
              deleteGuest(guestId);
            },
          });
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  function onError(error) {
    console.log(error);
  }

  return (
    <Form $type="modal" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="First Name" error={errors?.firstName?.message}>
        <Input
          type="text"
          id="firstName"
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoadingCountries || isLoading}
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
          disabled={isLoading}
          {...register("nationalID", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isLoading}
          {...register("numGuests", {
            valueAsNumber: true,
            required: "This field is required",
            min: { value: 1, message: "Guest should be at least 1" },
          })}
        />
      </FormRow>
      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <StyledSelect
          id="cabinId"
          disabled={isLoadingCabins || isLoading}
          {...register("cabinId", {
            valueAsNumber: true,
            required: true,
            onChange: () =>
              setDateRange([
                { startDate: null, endDate: null, key: "selection" },
              ]),
          })}
        >
          {cabins?.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>
      <Input
        type="hidden"
        id="startDate"
        disabled={isLoading}
        {...register("startDate", {
          valueAsDate: true,
          required: "Please choose a check in date",
        })}
      />

      <Input
        type="hidden"
        id="endDate"
        disabled={isLoading}
        {...register("endDate", {
          valueAsDate: true,
          required: "Please choose a check in date",
          validate: (value) =>
            !isSameDay(value, getValues("startDate")) ||
            "duration at least 1 day",
        })}
      />

      <FormRow
        label="Check in - Check out"
        error={errors?.startDate?.message || errors?.endDate?.message}
        type="calendar"
      >
        <DateRange
          editableDateInputs={false}
          onChange={(item) => {
            setDateRange([item.selection]);
            setValue("startDate", item.selection.startDate);
            setValue("endDate", item.selection.endDate);
          }}
          startDatePlaceholder="Check in"
          endDatePlaceholder="Check out"
          ranges={dateRange}
          rangeColors={["#4f46e5"]}
          minDate={new Date()}
          maxDate={endOfMonth(addMonths(new Date(), 6))}
          disabledDates={
            isLoadingDates || unavailableDates?.length === 0
              ? getDatesBetween(
                  new Date(),
                  endOfMonth(addMonths(new Date(), 6))
                )
              : unavailableDates
          }
        />
      </FormRow>

      <FormRow label="Note" error={errors?.observations?.message}>
        <Input
          type="text"
          id="observations"
          disabled={isLoading}
          {...register("observations")}
        />
      </FormRow>
      <FormRow label="Add breakfast">
        <Checkbox
          type="checkbox"
          disabled={isLoading}
          {...register("hasBreakfast")}
        />
      </FormRow>
      <FormRow label="Already paid">
        <Checkbox
          type="checkbox"
          disabled={isLoading}
          {...register("isPaid")}
        />
      </FormRow>
      <FormRow>
        <Button
          type="button"
          $variation="secondary"
          onClick={onCloseModal}
          className="modal_btn"
        >
          Cancel
        </Button>
        <Button className="modal_btn">Submit</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
