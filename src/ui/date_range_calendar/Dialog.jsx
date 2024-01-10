import { useRef } from "react";
import { useDialog } from "react-aria";

export function Dialog({ children, ...props }) {
  const ref = useRef(null);
  const { dialogProps } = useDialog(props, ref);

  return (
    <div {...dialogProps} ref={ref}>
      {children}
    </div>
  );
}
