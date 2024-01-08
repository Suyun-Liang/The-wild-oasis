import { useEffect, useState } from "react";
import { useRef } from "react";

export function useObserver({ onGrabData }) {
  const myRef = useRef(null);
  const [inView, setInview] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const { isIntersecting } = entries[0];
      if (!isIntersecting) return;
      setInview(true);
      onGrabData();
    });

    observer.observe(myRef.current);

    return () => {
      setInview(false);
      observer.disconnect();
    };
  }, [onGrabData]);

  return { myRef, inView };
}
