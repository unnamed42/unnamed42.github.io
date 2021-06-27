import { useEffect, useState } from "preact/hooks";

export const useScrollTop = (): [scrollTop: number] => {
  const [top, setTop] = useState(0);
  useEffect(() => {
    const scrollHandler = () => {
      requestAnimationFrame(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        setTop(winScroll);
      });
    }
    window.addEventListener("scroll", scrollHandler);
    return () => { window.removeEventListener("scroll", scrollHandler); };
  });
  return [top];
};
