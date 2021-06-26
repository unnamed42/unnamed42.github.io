import type { FunctionComponent } from "preact";
import { useText, Text } from "preact-i18n";
import { useRef, useCallback } from "preact/hooks";
import { useScroll } from "@/hooks";

export const ToTop: FunctionComponent = () => {
  const { toTopText } = useText({
    placeholder: <Text id="toTop">To Top</Text>
  });
  const toTop = useRef<HTMLDivElement>();
  const toTopPercent = useRef<HTMLDivElement>();
  const toTopCanvas = useRef<HTMLCanvasElement>();

  const drawCircle = useCallback((color: string, percent: number) => {
    const ctx = toTopCanvas.current.getContext("2d")!;
    const width = toTopCanvas.current.width;
    const center = width / 2, radius = Math.floor((width - 3) / 2);
    ctx.beginPath();
    ctx.arc(center, center, radius, -Math.PI / 2, Math.PI * 1.5 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, []);

  const [x,] = useScroll();

  return <div title={toTopText} ref={toTop}>
    <canvas width={48} height={48} ref={toTopCanvas} />
    <div ref={toTopPercent}>{x}</div>
  </div>
};
