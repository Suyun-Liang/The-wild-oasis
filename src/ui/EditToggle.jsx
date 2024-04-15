import { createContext, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Input from "./Input";
import { useForm, useFormContext } from "react-hook-form";
import { StyledSelect } from "../features/bookings/CreateBookingForm";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const EditButton = styled.button`
  // unset all the default style
  background: none;
  outline: inherit;
  border: none;
  color: inherit;
  width: 70px;
  height: 35px;

  &:hover,
  &:focus {
    background-color: var(--color-grey-200);
    border-radius: 8px;
  }

  &:disabled {
    background: none;
    outline: inherit;
    border: none;
    color: inherit;
  }
`;

const SubmitButton = styled.button`
  background: none;
  outline: inherit;
  background-color: var(--color-grey-400);
  color: var(--color-grey-100);
  border: none;
  border-radius: 8px;
  width: 70px;
  height: 35px;

  position: absolute;
  left: calc(100% - 65px);
  top: 170%;
`;

const EditContext = createContext();

function EditToggle({ children }) {
  const [openName, setOpenName] = useState("");

  const open = setOpenName;
  const close = () => setOpenName("");
  return (
    <EditContext.Provider value={{ openName, open, close }}>
      {children}
    </EditContext.Provider>
  );
}

function Toogle({
  id,
  data,
  disabled,
  registerName,
  options,
  selectData,
  isSelect = false,
}) {
  const { openName, open, close } = useContext(EditContext);
  const isOpen = openName === id;
  const {
    register,
    resetField,
    setValue,
    watch,
    formState: { defaultValues },
  } = useFormContext();

  function handleEdit(e) {
    const box = e.target.closest("div[form=setting-form]");
    const text = box.querySelector(".data-content");
    const input = box.querySelector("input");

    if (isOpen) {
      close();
      resetField(registerName);
    } else {
      open(id);
    }
  }

  return (
    <>
      <Container style={{ width: isOpen ? "100%" : "auto" }}>
        {!isSelect ? (
          <Input
            style={{ display: isOpen ? "block" : "none", width: "50%" }}
            {...register(registerName, options)}
          />
        ) : (
          <Select
            id={id}
            data={selectData}
            registerName={registerName}
            options={options}
          />
        )}
        <EditButton
          type="button"
          onClick={handleEdit}
          disabled={disabled || (openName && !isOpen)}
        >
          {isOpen ? "Cancel" : "Edit"}
        </EditButton>
        <SubmitButton
          form="personal-info"
          type="submit"
          className="submit-button"
          style={{ display: isOpen ? "block" : "none" }}
        >
          save
        </SubmitButton>
      </Container>
    </>
  );
}

function Select({ id, data, registerName, options }) {
  const { openName } = useContext(EditContext);
  const isOpen = openName === id;
  const {
    register,
    setValue,
    formState: { defaultValues },
  } = useFormContext();

  useEffect(() => {
    if (data) {
      setValue("nationality", defaultValues.nationality);
    }
  }, [setValue, data, defaultValues]);

  return (
    <StyledSelect
      style={{ display: isOpen ? "block" : "none", width: "50%" }}
      {...register(registerName, options)}
    >
      {data?.map((data) => (
        <option key={data} value={data}>
          {data}
        </option>
      ))}
    </StyledSelect>
  );
}

export function useEditToggle() {
  const value = useContext(EditContext);

  if (value === undefined)
    return new Error("EditContext was used outside of EditContextProvider");

  return value;
}

EditToggle.Toggle = Toogle;

export default EditToggle;
