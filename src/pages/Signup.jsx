import { useForm } from "react-hook-form";
import styled from "styled-components";

import Form from "../ui/Form";
import FormRow from "../ui/FormRow";
import Input, { PwInputBox } from "../ui/Input";

import { useCountries } from "../hooks/useCountries";
import { getFlag } from "../services/apiCountries";
import { getFullName } from "../utils/helpers";
import Button from "../ui/Button";
import useSignup from "../features/authentication/useSignup";
import SpinnerMini from "../ui/SpinnerMini";

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

function Signup({ onCloseModal }) {
  const { isLoading: isLoadingCountries, countries } = useCountries();
  const { signup, isSigningUp } = useSignup();

  const {
    register,
    handleSubmit,
    setError,
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
    },
  });

  async function onSubmit(data) {
    const {
      firstName,
      lastName,
      email: rawEmail,
      nationality,
      nationalID: rawNationalID,
      password,
    } = data;

    try {
      const countryFlag = await getFlag(nationality);

      // 1. Prepare guest data
      const fullName = getFullName(firstName, lastName);
      const email = rawEmail.toLowerCase().trim();
      const nationalID = rawNationalID.trim();

      const guestData = {
        fullName,
        email,
        nationality,
        nationalID,
        countryFlag,
      };

      signup(
        { fullName, email, password, role: "user", guestData },
        {
          onSuccess: () => {
            reset();
            onCloseModal();
          },
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  }
  function onError(error) {}

  return (
    <Form $type="modal" onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="First Name" error={errors?.firstName?.message}>
        <Input
          type="text"
          id="firstName"
          disabled={isSigningUp}
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
          disabled={isSigningUp}
          {...register("lastName", {
            required: "This field is required",
            minLength: {
              value: 2,
              message: "Last name should be at least 2 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <StyledSelect
          id="nationality"
          disabled={isLoadingCountries || isSigningUp}
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
          disabled={isSigningUp}
          {...register("nationalID", {
            required: "This field is required",
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Please provide a valid national ID",
            },
          })}
        />
      </FormRow>
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isSigningUp}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <PwInputBox>
          <Input
            type="password"
            id="password"
            disabled={isSigningUp}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password needs a minimum of 8 characters",
              },
            })}
          />
        </PwInputBox>
      </FormRow>
      <FormRow
        label="Confirm Password"
        error={errors?.confirmPassword?.message}
      >
        <PwInputBox>
          <Input
            type="password"
            id="confirmPassword"
            disabled={isSigningUp}
            {...register("confirmPassword", {
              required: "This field is required",
              validate: (value) =>
                value === getValues("password") || "password does not match",
            })}
          />
        </PwInputBox>
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
        <Button disabled={isSigningUp} className="modal_btn">
          {!isSigningUp ? "Create a new user" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default Signup;
