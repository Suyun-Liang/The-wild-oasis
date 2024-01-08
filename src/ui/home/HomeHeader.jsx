import styled from "styled-components";
import HomeNav from "../HomeNav";
import SearchCard from "../SearchCard";

const StyledHomeHeader = styled.header`
  min-height: 45dvh;
  display: flex;

  gap: 1.75rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-image: url("/header-bg2.png");
  background-size: cover;
`;

const HomeTitle = styled.div`
  color: var(--color-grey-600);
  font-size: 3.27rem;
`;

function HomeHeader() {
  return (
    <StyledHomeHeader>
      <HomeNav />
      <HomeTitle>
        <h1>
          Your Tranquil Escape <br /> in the Heart of Europe
        </h1>
      </HomeTitle>
      <SearchCard />
    </StyledHomeHeader>
  );
}

export default HomeHeader;
