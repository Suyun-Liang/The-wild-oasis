import styled from "styled-components";
import HomeNav from "./HomeNav";
import { Outlet } from "react-router-dom";

const StyledAppLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

/* const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 120rem;
  margin: 0 auto;
  gap: 3.2rem;
`; */

function AppLayoutClient() {
  return (
    <StyledAppLayout>
      <HomeNav />
      <Outlet />
    </StyledAppLayout>
  );
}

export default AppLayoutClient;
