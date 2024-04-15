import styled from "styled-components";
import FormRow from "../FormRow";
import useUser from "../../features/authentication/useUser";
import EditToggle, { useEditToggle } from "../EditToggle";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useCountries } from "../../hooks/useCountries";
import useUpdateUser from "../../features/authentication/useUpdateUser";
import { getFlag } from "../../services/apiCountries";
import Spinner from "../Spinner";

const Title = styled.h1``;
const Main = styled.main``;
const Text = styled.div``;
const MyForm = styled.form``;

const EditWrapper = styled.div`
  width: 95%;
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
    },
  });

  return (
    <div>
      <Title>Personal details</Title>
      <Main>
        {isLoading ? (
          <Spinner />
        ) : (
          <FormProvider {...methods}>
            <EditToggle>
              <CreatePersonalInfoForm data={userData} />
            </EditToggle>
          </FormProvider>
        )}
      </Main>
    </div>
  );
}

function CreatePersonalInfoForm({ data }) {
  const methods = useFormContext();
  const { close } = useEditToggle();
  const { dirtyFields } = methods.formState;
  const { isLoading: isLoadingCountries, countries } = useCountries();
  const { updateUser, isUpdating } = useUpdateUser();

  async function onSubmit(data) {
    const { fullName, email, nationality, nationalID } = data;
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

export default PersonalInfo;
