import styled from "styled-components";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

import useCabins from "../cabins/useCabins";
import useSettings from "../settings/useSettings";
import { getFlag, useCountries } from "../../hooks/useCountries";
import useCreateGuest from "./useCreateGuest";
import {
  getISOSNow,
  subtractDates,
  isLaterThanOrEqualToday,
  getFullName,
  isLaterThanStartDate,
  getISOStringWithHour,
} from "../../utils/helpers";
import { getCabin } from "../../services/apiCabins";
import useCreateBooking from "./useCreateBooking";
import useDeleteGuest from "./useDeleteGuest";

const StyledSelect = styled.select`
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
  const { createOrGetGuest, isCreatingGuest } = useCreateGuest();
  const { createBooking, isCreatingBooking } = useCreateBooking();
  const { deleteGuest, isDeletingGuest } = useDeleteGuest();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      nationalID: "",
      observations: "",
      numGuests: 1,
      startDate: getISOSNow({ withSecond: false }),
      hasBreakfast: false,
      isPaid: false,
    },
  });
  const isLoading =
    isLoadingSettings ||
    isCreatingGuest ||
    isCreatingBooking ||
    isDeletingGuest;

  //set default value to the nationality and cabin field when they arrived
  useEffect(() => {
    if (cabins && countries.length) {
      setValue("nationality", countries.at(0));
      setValue("cabinId", cabins.at(0).id);
    }
  }, [cabins, countries, setValue]);

  async function onSubmit(data) {
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
            created_at: getISOSNow(),
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
          {...register("nationality", { required: true })}
        >
          {countries.map((country) => (
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
          {...register("cabinId", { required: true })}
        >
          {cabins?.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isLoading}
          {...register("startDate", {
            valueAsDate: true,
            required: "This field is required",
            validate: (value) =>
              isLaterThanOrEqualToday(value, new Date()) ||
              "Date can not be past",
          })}
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isLoading}
          {...register("endDate", {
            valueAsDate: true,
            required: "This field is required",
            validate: (value) =>
              isLaterThanStartDate(value, getValues("startDate")) ||
              "End date should be after start date",
          })}
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
        <Button type="button" $variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button>Submit</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
