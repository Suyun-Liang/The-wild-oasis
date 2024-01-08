import styled from "styled-components";
import { HiOutlineChevronDown } from "react-icons/hi2";

const StyledSelect = styled.div`
  width: ${(props) => (props.$secondary ? "16.78rem" : "18.78rem")};
  height: 6.5rem;

  display: flex;
  justify-content: ${(props) =>
    props.$secondary ? "center" : "space-between"};
  align-items: center;

  padding: 0.8rem 1rem;
  border: none;
  border-radius: 0.75rem;

  font-size: 1.75rem;
  color: var(
    ${(props) => (props.$secondary ? "--color-grey-200" : "--color-grey-400")}
  );
  background-color: var(
    ${(props) => (props.$secondary ? "--color-grey-700" : "--color-grey-300")}
  );

  & svg {
    color: black;
    font-size: 2rem;
  }
`;

function Select({ label, onClick, as = "select" }) {
  if (as === "button") {
    return (
      <StyledSelect $secondary as="button" onClick={onClick}>
        <span>{label}</span>
      </StyledSelect>
    );
  }
  return (
    <StyledSelect>
      <span>{!label ? "Add date" : label}</span>
      <span>
        <HiOutlineChevronDown />
      </span>
    </StyledSelect>
  );
}

export default Select;
