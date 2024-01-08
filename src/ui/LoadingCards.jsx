import styled, { css } from "styled-components";

const sizes = {
  regular: css`
    width: 500px;
    max-width: 660px;
    flex-grow: 1;
  `,

  small: css`
    width: 260px;
  `,

  large: css`
    width: 1100px;
    max-width: 1300px;
    margin: 0 auto;
    padding-top: 24px;
    padding-left: 12px;
    padding-right: 12px;
  `,
};

const imgSizes = {
  regular: css`
    height: 325px;
  `,

  small: css`
    height: 170px;
  `,

  large: css`
    height: 736px;
  `,
};

const descSizes = {
  regular: css`
    width: 60%;

    align-self: center;
  `,

  large: css`
    &:last-child {
      width: 80%;
    }
  `,
};

export const StyledCard = styled.div`
  ${(props) => sizes[props.$size]}

  display: flex;
  flex-direction: column;

  & > * {
    background-color: lightgrey;
    border-radius: 18px;

    animation: skeleton-loading 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }

  & > div {
    ${(props) => imgSizes[props.$imgSizes]}
  }

  & > p {
    height: 25px;
    margin-top: 7px;
    ${(props) => descSizes[props.$descSizes]}
  }
`;

StyledCard.defaultProps = {
  $size: "regular",
  $imgSizes: "regular",
  $descSizes: "regular",
};

function LoadingCards({ numOfCards, size, imgSizes, descSizes }) {
  return Array.from(new Array(numOfCards), (_, i) => (
    <StyledCard
      key={i}
      $size={size}
      $imgSizes={imgSizes}
      $descSizes={descSizes}
    >
      <div></div>
      <p></p>
      {descSizes === "large" &&
        Array.from(new Array(3), (_, i) => <p key={i}></p>)}
    </StyledCard>
  ));
}

export default LoadingCards;
