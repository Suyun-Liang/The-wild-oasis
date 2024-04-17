import styled from "styled-components";
import * as Avatar from "@radix-ui/react-avatar";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import FormRow from "../FormRow";
import Spinner from "../Spinner";
import useUser from "../../features/authentication/useUser";
import EditToggle, { useEditToggle } from "../EditToggle";

import { useCountries } from "../../hooks/useCountries";
import useUpdateUser from "../../features/authentication/useUpdateUser";
import { getFlag } from "../../services/apiCountries";
import { HiUserCircle } from "react-icons/hi2";
import Modal, { useModal } from "../Modal";
import FileInput from "../FileInput";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Hearder = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-grey-300);
`;
const PageTitle = styled.div`
  flex-grow: 1;
`;

const Title = styled.h1``;
const Desc = styled.div``;
const Main = styled.main``;
const Text = styled.div``;
const MyForm = styled.form``;

const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function PersonalInfo() {
  // const [editOpen, setEditOpen] = useState(null);
  const { user, isLoading } = useUser();
  const userData = user.user_metadata;

  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: userData.fullName,
      email: userData.email,
      nationality: userData?.guestData?.nationality,
      nationalID: userData?.guestData?.nationalID,
      avatar: userData?.avatar,
    },
  });

  return (
    <Container>
      <FormProvider {...methods}>
        <Modal>
          <Hearder>
            <PageTitle>
              <Title>Personal details</Title>
              <Desc>Update your information </Desc>
            </PageTitle>
            <SettingAvatar />
          </Hearder>
          <Main>
            {isLoading ? (
              <Spinner />
            ) : (
              <EditToggle>
                <CreatePersonalInfoForm data={userData} />
              </EditToggle>
            )}
          </Main>
        </Modal>
      </FormProvider>
    </Container>
  );
}

function CreatePersonalInfoForm({ data }) {
  const methods = useFormContext();
  const { close } = useEditToggle();
  const { dirtyFields } = methods.formState;
  const { isLoading: isLoadingCountries, countries } = useCountries();
  const { updateUser, isUpdating } = useUpdateUser();
  const { close: closeModal } = useModal();

  async function onSubmit(data) {
    let { fullName, email, nationality, nationalID, avatar } = data;

    try {
      // update fullName
      if (dirtyFields?.fullName) {
        updateUser(
          { fullName },
          {
            onSuccess: () => {
              methods.resetField("fullName", {
                defaultValue: fullName,
              });
              close();
            },
          }
        );
      }
      // update nationality
      if (dirtyFields?.nationality) {
        const countryFlag = await getFlag(nationality);
        const guestData = {
          ...data,
          countryFlag,
        };
        // console.log(guestData);
        updateUser(
          { guestData },
          {
            onSuccess: () => {
              methods.resetField("nationality", {
                defaultValue: nationality,
              });
              close();
            },
          }
        );
      }
      // update nationalID
      if (dirtyFields?.nationalID) {
        const guestData = {
          ...data,
        };
        updateUser(
          { guestData },
          {
            onSuccess: () => {
              methods.resetField("nationalID", {
                defaultValue: nationalID,
              });
              close();
            },
          }
        );
      }
      // update avatar
      if (dirtyFields?.avatar) {
        avatar = avatar[0];
        updateUser(
          { fullName, avatar },
          {
            onSuccess: ({ user }) => {
              methods.resetField("avatar", {
                defaultValue: user.user_metadata.avatar,
              });
              console.log(user);
              closeModal();
            },
          }
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <MyForm id="personal-info" onSubmit={methods.handleSubmit(onSubmit)}>
      <SettingRow
        label="Name"
        name="fullName"
        data={data.fullName}
        editButton={
          <EditToggle.Toggle
            id="Name"
            disabled={isUpdating}
            data={data.fullName}
            registerName="fullName"
            options={{
              required: "This field is required",
              pattern: {
                value: /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/,
                message: "Please enter valid full name",
              },
            }}
          />
        }
      />
      <SettingRow
        label="Email"
        data={data.email}
        name="email"
        editButton={
          <EditToggle.Toggle
            id="Email"
            disabled={true}
            data={data.email}
            registerName="email"
            options={{
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            }}
          />
        }
      />
      <SettingRow
        label="Nationality"
        data={data?.guestData?.nationality}
        name="nationality"
        editButton={
          <EditToggle.Toggle
            id="Nationality"
            disabled={isUpdating}
            isSelect={true}
            selectData={countries}
            data={data?.guestData?.nationality}
            registerName="nationality"
            options={{ required: "This field is required" }}
          />
        }
      />
      <SettingRow
        label="National Id"
        data={data?.guestData?.nationalID}
        name="nationalID"
        editButton={
          <EditToggle.Toggle
            id="National Id"
            disabled={isUpdating}
            data={data?.guestData?.nationalID}
            registerName="nationalID"
            options={{
              required: "This field is required",
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Please provide a valid national ID",
              },
            }}
          />
        }
      />
    </MyForm>
  );
}

function SettingRow({ label, data, editButton, name }) {
  const { openName } = useEditToggle();
  const isOpen = openName === label;
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <FormRow
      label={label}
      formType="setting-form"
      isExpand={isOpen}
      error={errors?.[name]?.message}
    >
      <EditWrapper>
        <Text
          className="data-content"
          style={{ display: isOpen ? "none" : "block" }}
        >
          {data}
        </Text>
        {editButton}
      </EditWrapper>
    </FormRow>
  );
}

const StyledsettingAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 64px;
  height: 86px;
  padding: 6px 3px;

  & > div {
    line-height: 1.2;
  }

  &:hover,
  &:focus {
    background-color: var(--color-grey-200);
    border-radius: 8px;
  }
`;

const AvatarRoot = styled(Avatar.Root)`
  display: block;
  width: 56px;
  height: 56px;
  border-radius: 100%;
  & svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  & img {
    display: block;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
`;

function SettingAvatar() {
  const {
    formState: { defaultValues },
  } = useFormContext();
  return (
    <>
      <Modal.Open opens="avatarSetting">
        <StyledsettingAvatar>
          <AvatarRoot>
            <Avatar.Image
              src={defaultValues.avatar}
              alt={`avatar of user ${defaultValues.fullName}`}
            />
            <Avatar.Fallback delayMs={600}>
              <HiUserCircle />
            </Avatar.Fallback>
          </AvatarRoot>
          <div>Edit</div>
        </StyledsettingAvatar>
      </Modal.Open>

      <Modal.Window name="avatarSetting">
        <AvatarSetting />
      </Modal.Window>
    </>
  );
}

const SubmitButton = styled.button`
  background: none;
  outline: inherit;
  background-color: var(--color-grey-400);
  color: var(--color-grey-100);
  border: none;
  border-radius: 8px;
  width: 70px;
  height: 35px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

function AvatarSetting() {
  const { register } = useFormContext();
  return (
    <div>
      <h2>Select an image to upload</h2>
      <FormRow label="Avatar" formType="setting-form">
        <FileInput {...register("avatar")} accept="image/*" />
      </FormRow>
      <ButtonWrapper>
        <SubmitButton
          form="personal-info"
          type="submit"
          className="submit-button"
        >
          save
        </SubmitButton>
      </ButtonWrapper>
    </div>
  );
}

export default PersonalInfo;
