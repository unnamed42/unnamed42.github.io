import type { FunctionComponent } from "preact";
import { useRef, useEffect } from "preact/hooks";
import { useText, Text } from "preact-i18n";
import { classNames } from "@/utils";
import { useScrollTop } from "@/hooks/useScrollTop";
import style from "./ToTop.mod.sass";

const drawCircle = (ctx: CanvasRenderingContext2D, width: number, color: string, percent: number) => {
  const center = width / 2, radius = Math.floor((width - 3) / 2);
  ctx.beginPath();
  ctx.arc(center, center, radius, -Math.PI / 2, Math.PI * 1.5 * percent, false);
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.stroke();
};

export const ToTop: FunctionComponent = () => {
  const { toTopText } = useText({
    placeholder: <Text id="toTop">To Top</Text>
  });
  const toTop = useRef<HTMLDivElement>();
  const toTopPercent = useRef<HTMLDivElement>();
  const toTopCanvas = useRef<HTMLCanvasElement>();

  const [top] = useScrollTop();
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = Math.round(top / height * 100);

  useEffect(() => {
    if (!toTopCanvas.current) return;
    const canvasWidth = toTopCanvas.current.width, canvasHeight = toTopCanvas.current.height;
    const ctx = toTopCanvas.current.getContext("2d")!;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawCircle(ctx, canvasWidth, "#efefef", 1);
    drawCircle(ctx, canvasWidth, "#555555", percent / 100);
  }, [percent]);

  return <div title={toTopText} ref={toTop} className={classNames({
    [style.totop]: true,
    [style.display]: top >= 200
  })} >
    <canvas width={48} height={48} ref={toTopCanvas} />
    <div ref={toTopPercent} className={style.totopPercent} data-percent={percent} />
  </div>
};
