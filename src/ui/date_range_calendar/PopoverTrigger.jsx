import { useRef } from "react";
import { useOverlayTriggerState } from "react-stately";
import { useOverlayTrigger } from "react-aria";
import { PopoverButton } from "./PopoverButton";
import { Dialog } from "./Dialog";
import { Popover } from "./Popover";

export function PopoverTrigger({ children, element, type, ...props }) {
  const ref = useRef(null);
  const state = useOverlayTriggerState(props);
  const { triggerProps, overlayProps } = useOverlayTrigger(
    {
      type: "dialog",
    },
    state,
    ref
  );

  return (
    <>
      <PopoverButton {...triggerProps} buttonRef={ref} type={type}>
        {children}
      </PopoverButton>
      {state.isOpen && (
        <Popover {...props} triggerRef={ref} state={state}>
          <Dialog {...overlayProps}>{element}</Dialog>
        </Popover>
      )}
    </>
  );
}
