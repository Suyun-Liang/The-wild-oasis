import styled from "styled-components";
import { HiIdentification, HiBookOpen } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Container = styled.div`
  margin: 0 auto;
`;

const Header = styled.header`
  margin-top: 64px;
  margin-bottom: 56px;
  margin-left: 16px;
`;

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 1128px;
`;

function AccountSettings() {
  return (
    <Container>
      <Header>
        <h1>Account Settings</h1>
      </Header>
      <Main>
        <SettingCard
          label="Personal info"
          icon={<HiIdentification />}
          desc="Edit your personal information"
          routeName="personal-info"
        />
        <SettingCard
          label="Booking history"
          icon={<HiBookOpen />}
          desc="View your booking history"
          routeName="booking-history"
        />
      </Main>
    </Container>
  );
}

const Wrapper = styled.div`
  width: 33.333%;
  padding: 0 8px;
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 156px;
  margin: 8px 0;
  padding: 16px;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
`;

const Icon = styled.div`
  margin-bottom: 16px;

  & svg {
    height: 32px;
    width: 32px;
  }
`;

const Label = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;
const Desc = styled.div`
  color: var(--color-grey-500);
  font-size: 1.2rem;
  font-weight: 400;
`;

function SettingCard({ label, desc, icon, routeName }) {
  return (
    <Wrapper>
      <Link to={`/account-settings/${routeName}`}>
        <CardContainer>
          <Icon>{icon}</Icon>
          <Label>{label}</Label>
          <Desc>{desc}</Desc>
        </CardContainer>
      </Link>
    </Wrapper>
  );
}

export default AccountSettings;
