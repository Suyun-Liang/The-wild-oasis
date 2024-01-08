import styled from "styled-components";

import { Slider } from "./Slider/Slider";

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 40dvh;
`;

function HomeSection({ name }) {
  return (
    <StyledSection className={name}>
      <Slider />
    </StyledSection>
  );
}

export default HomeSection;
