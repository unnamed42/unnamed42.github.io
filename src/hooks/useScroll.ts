import { useEffect, useRef, useState } from "preact/hooks";

type Coord = [x: number, y: number];

export const useScroll = (): Coord => {
  const requestID = useRef(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const scrollHandler = () => {
      cancelAnimationFrame(requestID.current);
      requestID.current = requestAnimationFrame(() => {
        setX(window.scrollX || document.documentElement.scrollLeft);
        setY(window.scrollY || document.documentElement.scrollTop);
      });
    };
    window.addEventListener("scroll", scrollHandler);
    return () => { window.removeEventListener("scroll", scrollHandler); }
  });

  return [x, y];
};
