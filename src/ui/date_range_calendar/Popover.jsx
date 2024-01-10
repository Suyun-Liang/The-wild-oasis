import styled from "styled-components";
import { useRef } from "react";
import { DismissButton, Overlay, usePopover } from "react-aria";

const StyledPopover = styled.div`
  padding: 1rem;
  background-color: var(--color-grey-100);
  border-radius: 1.25rem;
`;

export function Popover({ children, state, offset = 10, ...props }) {
  const popoverRef = useRef(null);
  const { popoverProps, underlayProps } = usePopover(
    { ...props, offset, popoverRef },
    state
  );

  return (
    <Overlay>
      <div {...underlayProps} className="underlay" />
      <StyledPopover {...popoverProps} ref={popoverRef} className="popover">
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </StyledPopover>
    </Overlay>
  );
}
