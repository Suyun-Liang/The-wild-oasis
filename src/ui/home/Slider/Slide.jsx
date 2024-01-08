import styled from "styled-components";

import LoadingCards from "../../LoadingCards";
import { Card } from "../../Card";

const StyledSlide = styled.div`
  position: absolute;
  width: 110rem;
  height: 25rem;
  padding-left: 20px;
  padding-right: 20px;

  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 1s;
`;

export function Slide({
  data,
  index,
  style,
  isLoading = false,
  cardsPerSlide,
}) {
  return (
    <StyledSlide
      className={`slider-${index + 1}`}
      data-slide={index}
      style={style}
    >
      {isLoading &&
        Array.from(new Array(cardsPerSlide), (_, i) => (
          <LoadingCards key={i} size="small" imgSizes="small" />
        ))}
      {data?.map((e, i) => (
        <Card key={e.id} cabin={e} />
      ))}
    </StyledSlide>
  );
}
