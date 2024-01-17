import styled from "styled-components";
import Form from "../ui/Form";
import { useForm } from "react-hook-form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import { StyledSelect } from "../features/bookings/CreateBookingForm";
import { useCountries } from "../hooks/useCountries";
import { isSameDay } from "date-fns";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";

const Container = styled.div``;
const Title = styled.h1``;
function Booking() {
  const { isLoading: isLoadingCountries, countries } = useCountries();

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
      cabinId: "",
    },
  });

  return (
    <Container>
      <Title>Confirm your booking</Title>
      <Form>
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

        <FormRow label="Cabin" error={errors?.cabinId?.message}>
          <Input
            id="cabinId"
            disabled={false}
            {...register("cabinId", {
              valueAsNumber: true,
              required: true,
            })}
            readOnly={true}
            value="001"
          ></Input>
        </FormRow>
        <FormRow label="startDate" error={errors?.startDate?.message}>
          <Input
            id="startDate"
            disabled={false}
            {...register("startDate", {
              valueAsDate: true,
              required: "Please choose a check in date",
            })}
          />
        </FormRow>
        <FormRow label="endDate" error={errors?.startDate?.message}>
          <Input
            id="endDate"
            disabled={false}
            {...register("endDate", {
              valueAsDate: true,
              required: "Please choose a check in date",
              validate: (value) =>
                !isSameDay(value, getValues("startDate")) ||
                "duration at least 1 day",
            })}
          />
        </FormRow>
        <FormRow label="Number of guests" error={errors?.numGuests?.message}>
          <Input
            type="number"
            id="numGuests"
            disabled={false}
            {...register("numGuests", {
              valueAsNumber: true,
              required: "This field is required",
              min: { value: 1, message: "Guest should be at least 1" },
            })}
          />
        </FormRow>
        <FormRow label="Add breakfast">
          <Checkbox
            type="checkbox"
            disabled={false}
            {...register("hasBreakfast")}
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

export default Booking;
