import styled from "styled-components";
import HomeNav from "./HomeNav";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const StyledAppLayout = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

function AppLayoutClient() {
  return (
    <StyledAppLayout>
      <HomeNav notFromHomePage={true} />
      <Outlet />
      <Footer />
    </StyledAppLayout>
  );
}

export default AppLayoutClient;
