import { styled } from "styled-components";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { cloneElement, useEffect, useState } from "react";

const Input = styled.input`
  border: 2px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  padding: 0.8rem 1.2rem;
`;

const Container = styled.div`
  position: relative;
`;

const ToggleButton = styled.div`
  position: absolute;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: var(--color-grey-100);
  top: 4px;
  right: 8px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  & svg {
    display: block;
    width: 60%;
    height: 100%;
  }
`;

export function PwInputBox({ children }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Container id="input-box">
      {cloneElement(children, {
        style: { position: "relative", width: "100%", userSelect: "none" },
        type: showPassword ? "text" : "password",
      })}
      <ToggleButton>
        {showPassword ? (
          <HiEye onClick={() => setShowPassword(false)} />
        ) : (
          <HiEyeOff onClick={() => setShowPassword(true)} />
        )}
      </ToggleButton>
    </Container>
  );
}

export default Input;
