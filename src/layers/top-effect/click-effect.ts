import { Application, Container, Graphics, Sprite, extensions } from "pixi.js";
import gsap from "gsap";
import { wait } from "@/utils";
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
        duration: baseDuration * 4,
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
        duration: baseDuration * 8,
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
        duration: baseDuration * 4,
      },
      ">"
    );
  setTimeout(() => {
    // 白色的border
    const ring = new Graphics();
    const borderWidth = 0.1 * appHeight;
    ring.lineStyle(borderWidth, 0xffffff, 1);
    ring.drawCircle(x, y, appHeight); // 设大一点, 避免锯齿
    ring.endFill();
    const ringTexture = app.renderer.generateTexture(ring as any);
    const ringSprite = new Sprite(ringTexture as any);
    app.stage.addChild(ringSprite);
    const curSize = maxCircleSize * 0.6 * 2;
    ringSprite.width = curSize;
    ringSprite.height = curSize;
    ringSprite.anchor.set(0.5);
    setTimeout(() => {
      // 中途变细, 体现出 border 的变化感
      const ring = new Graphics();
      ring.lineStyle(borderWidth * 0.6, 0xffffff, 1);
      ring.drawCircle(x, y, appHeight);
      ring.endFill();
      const ringTexture = app.renderer.generateTexture(ring as any);
      ringSprite.texture = ringTexture;
    }, 1000 * 10 * baseDuration);
    ringSprite.texture = ringTexture;
    ringSprite.alpha = 0.8;
    ringSprite.position.set(x, y);
    tl = gsap.timeline();
    tl.to(ringSprite, {
      pixi: {
        tint: 0xffffff,
        alpha: 1,
      },
      duration: baseDuration * 1,
    })
      .to(
        ringSprite,
        {
          pixi: {
            width: maxCircleSize * 0.9 * 2,
            height: maxCircleSize * 0.9 * 2,
          },
          duration: baseDuration * 12,
        },
        ">"
      )
      .to(ringSprite, {
        pixi: {
          width: maxCircleSize * 2,
          height: maxCircleSize * 2,
        },
        duration: baseDuration * 4,
      })
      .then(() => {
        app.stage.removeChild(ringSprite);
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
