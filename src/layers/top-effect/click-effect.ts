import {
  Application,
  Container,
  Graphics,
  Sprite,
  Ticker,
  extensions,
} from "pixi.js";
import gsap from "gsap";
import { wait } from "@/utils";
import { GlowFilter } from "@pixi/filter-glow";
import { emitterStarter, triangleEmitter } from "./triangle-emitter";

export async function clickEffect(app: Application, x: number, y: number) {
  // 原理是线条 emitter
  const appWidth = app.view.width;
  const appHeight = app.view.height / 2; // 通过 resolution 抗锯齿后需要重新算一下高度, 如果直接用图片不用 graphics 生成就没那锯齿这问题了
  let tl = gsap.timeline();
  const circleSize = Math.min(appHeight * 0.03, 20);
  const graphics = new Graphics();
  graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
  graphics.beginFill(0xffffff, 1); // 0xb8e1fe
  graphics.drawCircle(x, y, appHeight); // 设大一点, 避免锯齿
  graphics.endFill();
  const texture = app.renderer.generateTexture(graphics as any);
  const circle = new Sprite(texture as any);
  app.stage.addChild(circle);
  circle.width = circleSize;
  circle.height = circleSize;
  circle.anchor.set(0.5);
  circle.position.set(x, y);
  const maxCircleSize = 1.5 * circleSize;
  const baseDuration = 0.02;
  tl.to(circle, {
    pixi: {
      width: maxCircleSize * 2,
      height: maxCircleSize * 2,
    },
    duration: baseDuration * 14,
  })
    .to(
      circle,
      {
        pixi: {
          tint: 0xb8e1fe,
        },
        duration: baseDuration * 3,
      },
      "<"
    )
    .to(
      circle,
      {
        pixi: {
          tint: 0xb8e1fe,
          alpha: 0.4,
        },
        duration: baseDuration * 5,
      },
      "<"
    )
    .to(
      circle,
      {
        pixi: {
          tint: 0x01d4fb,
          alpha: 0,
        },
        duration: baseDuration * 3,
      },
      ">"
    );
  setTimeout(() => {
    renderSpinner({
      app,
      x,
      y,
      appHeight,
      maxCircleSize: maxCircleSize,
      baseDuration,
    });
  }, baseDuration * 1);
  // 中心的那个点
  const point = new Graphics();
  point.lineStyle(0);
  point.beginFill(0xffffff, 0.4);
  point.drawCircle(x, y, 1);
  point.endFill();
  app.stage.addChild(point);
  setTimeout(() => {
    app.stage.removeChild(point);
  }, baseDuration * 10 * 1000);
  let ringRemover: any;
  setTimeout(() => {
    ringRemover = triangleEmitter({ app, x, y, baseDuration, maxCircleSize });
  }, 1000 * baseDuration);
  await wait(1000 * baseDuration * 18);
  app.stage.removeChild(point);
  app.stage.removeChild(circle);
  ringRemover();
}
// 转圈的 border
function renderSpinner({
  app,
  x,
  y,
  maxCircleSize,
  baseDuration,
}: {
  app: Application;
  x: number;
  y: number;
  maxCircleSize: number;
  appHeight: number;
  baseDuration: number;
}) {
  let radius = maxCircleSize / 2;
  function circleAnimate({ initStartAngle = 0 }) {
    const halfCircle = new Graphics();
    halfCircle.filters = [
      new GlowFilter({ distance: 7, outerStrength: 1, color: 0x02d5fa }),
    ];
    app.stage.addChild(halfCircle);
    const ticker = new Ticker();
    let startAngle = initStartAngle;
    let endAngle = initStartAngle;
    const tl = gsap.timeline();
    const temVal = { radius };
    tl.to(
      temVal,
      {
        radius: radius * 0.9 * 2,
        duration: baseDuration * 12,
      },
      ">"
    ).to(temVal, {
      radius: radius * 2,
      duration: baseDuration * 4,
    });
    const stop = () => {
      app.stage.removeChild(halfCircle);
      ticker.stop();
    };
    let hasReduce = false;
    let times = 0;
    const getRuntimes = (duration: number) =>
      Math.round((duration * 1000) / ticker.deltaMS);
    const toCircleTimes = getRuntimes(baseDuration * 12);
    const waitCircleTimes = getRuntimes(baseDuration * 28);
    const toHideTimes = getRuntimes(baseDuration * 150);
    const toCircleSpeed = Math.PI / toCircleTimes;
    const toHideSpeed = Math.PI / (toHideTimes - waitCircleTimes);
    ticker.add(() => {
      times++;
      if (times >= waitCircleTimes) {
        if (!hasReduce) {
          startAngle = endAngle - Math.PI / 6;
          hasReduce = true;
        }
        startAngle += Math.PI / 360 + toHideSpeed;
        endAngle += Math.PI / 360;
      }
      if (times <= waitCircleTimes) {
        startAngle += Math.PI / 180;
        endAngle += Math.PI / 180 + toCircleSpeed;
      }
      if (startAngle > endAngle || times > toHideTimes) {
        stop();
      }
      drawArc(halfCircle, x, y, temVal.radius, startAngle, endAngle);
    });
    ticker.start();
    return;
  }
  circleAnimate({ initStartAngle: 0 });
  circleAnimate({ initStartAngle: Math.PI });
}

// https://codepen.io/jasonsturges/pen/zYqGEzZ
function drawArc(
  halfCircle: Graphics,
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle = 0,
  yRadius = 0
) {
  halfCircle.clear();
  halfCircle.lineStyle(2, 0xffffff);
  halfCircle.arc(x, y, radius, startAngle, endAngle);
  halfCircle.endFill();
}
