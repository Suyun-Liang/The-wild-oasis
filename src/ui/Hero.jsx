import styled from "styled-components";
import LoadingCards from "./LoadingCards.jsx";

const ImgContainer = styled.div`
  max-width: 130rem;
  margin: 0 auto;
  padding-top: 24px;
  padding-left: 12px;
  padding-right: 12px;
`;

const Img = styled.img`
  border-radius: 18px;
`;

const Desc = styled.div`
  font-size: 1.75rem;
  line-height: 2.7rem;
`;

export function Hero({ cabin, isLoading }) {
  if (isLoading) {
    return (
      <LoadingCards
        numOfCards={1}
        size="large"
        imgSizes="large"
        descSizes="large"
      />
    );
  }
  return (
    <ImgContainer>
      <Img src={cabin?.image} alt="cabin" />
      <Desc>{cabin?.description}</Desc>
    </ImgContainer>
  );
}
