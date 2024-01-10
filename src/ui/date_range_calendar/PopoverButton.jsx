import styled from "styled-components";
import { useButton } from "react-aria";

const Trigger = styled.span`
  &.group {
    grid-area: dateSelect;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: inherit;
  }
`;

export function PopoverButton(props) {
  let ref = props.buttonRef;
  let { buttonProps } = useButton(props, ref);
  return (
    <Trigger
      {...buttonProps}
      ref={ref}
      style={props.style}
      className={props.type}
    >
      {props.children}
    </Trigger>
  );
}
