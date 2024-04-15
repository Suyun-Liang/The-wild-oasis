import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { HiIdentification, HiBookOpen } from "react-icons/hi2";

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 24px 0;
  max-width: 1140px;
  width: 100%;
`;

const StyledSeetingLayout = styled.div`
  display: flex;
`;

const Sidebar = styled.nav`
  min-width: 308px;
  min-height: 108px;
  height: fit-content;
  margin-inline-end: 24px;
  border: 1px solid var(--color-grey-300);
  border-radius: 8px;
`;

const SettingMenu = styled.ul``;

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;

  & svg {
    width: 24px;
    height: 24px;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-grey-700);
  }
`;

const MenuItem = styled.li`
  padding: 16px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Main = styled.div`
  flex-grow: 1;
`;

function SettingsLayout() {
  return (
    <Wrapper>
      <StyledSeetingLayout>
        <Sidebar>
          <SettingMenu>
            <MenuItem>
              <StyledLink to="/account-settings/personal-info">
                <HiIdentification />
                <span>Personal info</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink to="/account-settings/booking-history">
                <HiBookOpen />
                <span>Booking History</span>
              </StyledLink>
            </MenuItem>
          </SettingMenu>
        </Sidebar>
        <Main>
          <Outlet />
        </Main>
      </StyledSeetingLayout>
    </Wrapper>
  );
}

export default SettingsLayout;
