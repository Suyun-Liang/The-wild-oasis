import { Link } from "react-router-dom";
import styled from "styled-components";
import { getParamsStr } from "../utils/helpers";

export const StyledCard = styled.figure`
  width: fit-content;
  text-align: center;

  flex: 1 1 500px;
  max-width: 660px;

  :hover {
    cursor: pointer;
  }

  & img {
    border-radius: 18px;
    width: 100%;
  }
`;

export function Card({ cabin, search = {} }) {
  return (
    <StyledCard>
      <Link
        to={{ pathname: `/rooms/${cabin.id}`, search: getParamsStr(search) }}
        target="_blank"
      >
        <img src={cabin.image} alt={`wooden cabin ${cabin.name}`} />
        <figcaption>{cabin.name}</figcaption>
      </Link>
    </StyledCard>
  );
}
