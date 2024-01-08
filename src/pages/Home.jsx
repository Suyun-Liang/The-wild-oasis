import styled from "styled-components";
import HomeHeader from "../ui/home/HomeHeader";
import HomeSection from "../ui/home/HomeSection";

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
`;

function Home() {
  return (
    <StyledHome>
      <HomeHeader />
      <HomeSection />
    </StyledHome>
  );
}

export default Home;
