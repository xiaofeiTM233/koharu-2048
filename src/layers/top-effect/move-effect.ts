import {
  Application,
  FederatedPointerEvent,
  Graphics,
  Point,
  SimpleRope,
  Texture,
} from "pixi.js";
import { throttle } from "lodash-es";
import { GlowFilter } from "@pixi/filter-glow";
import { triangleEmitter } from "./triangle-emitter";
import { getXY } from "./util";

const rectangle = new Graphics();
rectangle.lineStyle(2, 0xffffff, 1);
rectangle.beginFill(0xffffff);
rectangle.drawEllipse(0, 0, 48, 1);
rectangle.endFill();

let mouseDown = false;
export function moveEffect(app: Application) {
  if (!app) return;
  // Get the texture for rope.
  let historyX = [] as number[];
  let historyY = [] as number[];
  const trailTexture = app.renderer.generateTexture(rectangle);

  // historySize determines how long the trail will be.
  const historySize = 20;
  // ropeSize determines how smooth the trail will be.
  const ropeSize = 50;
  const points = [] as Point[];

  // Create rope points.
  for (let i = 0; i < ropeSize; i++) {
    points.push(new Point(0, 0));
  }
  function initHistory({ x, y }: { x: number; y: number }) {
    historyX = [];
    historyY = [];
    // Create history array.
    for (let i = 0; i < historySize; i++) {
      historyX.push(x);
      historyY.push(y);
    }
  }
  initHistory({ x: 0, y: 0 });
  // Create the rope
  const rope = new SimpleRope(trailTexture, points);
  // 辉光效果
  rope.filters = [
    new GlowFilter({ distance: 7, outerStrength: 1, color: 0x02d5fa }),
  ];
  // rope.filters = [new AdvancedBloomFilter()];
  // Set the blendmode
  // rope.blendMode = BLEND_MODES.ADD;

  app.stage.addChild(rope);

  let mouseposition = null as unknown as { x: number; y: number };
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;
  const actionDown = (e: MouseEvent | TouchEvent) => {
    const xy = getXY(e);
    initHistory({ ...xy });
    mouseposition = xy;
    // 延迟一点, 不一拖动就显示
    setTimeout(() => {
      mouseDown = true;
    }, 40);
  };
  const actionUp = () => {
    rope.alpha = 0;
    mouseDown = false;
  };
  window.addEventListener("mousedown", actionDown);
  window.addEventListener("mouseup", actionUp);
  window.addEventListener("touchstart", actionDown);
  window.addEventListener("touchend", actionUp);
  const triangle = throttle(() => {
    const baseDuration = 0.02;
    const triangleRemove = triangleEmitter({
      app,
      ...mouseposition,
      maxCircleSize: 12,
    });
    setTimeout(() => {
      triangleRemove();
    }, 1000 * baseDuration * 18);
  }, 80);
  const moveEvent = (e: MouseEvent | TouchEvent) => {
    if (!mouseDown) return;
    const xy = getXY(e);
    rope.alpha = 1;
    mouseposition = mouseposition || { x: 0, y: 0 };
    mouseposition = xy;
    Math.random() > 0.8 && triangle();
  };
  window.addEventListener("mousemove", moveEvent);
  window.addEventListener("touchmove", moveEvent);
  function updateHistory(mouseposition: { x: number; y: number }): void {
    // Update the mouse values to history
    historyX.pop();
    historyX.unshift(mouseposition.x);
    historyY.pop();
    historyY.unshift(mouseposition.y);
  }
  // Listen for animate update
  app.ticker.add(() => {
    if (!mouseposition || !mouseDown) return;

    updateHistory(mouseposition);
    // Update the points to correspond with history.
    for (let i = 0; i < ropeSize; i++) {
      const p = points[i];

      // Smooth the curve with cubic interpolation to prevent sharp edges.
      const ix = cubicInterpolation(historyX, (i / ropeSize) * historySize);
      const iy = cubicInterpolation(historyY, (i / ropeSize) * historySize);

      p.x = ix;
      p.y = iy;
    }
  });

  /**
   * Cubic interpolation based on https://github.com/osuushi/Smooth.js
   */
  function clipInput(k: number, arr: number[]) {
    if (k < 0) k = 0;
    if (k > arr.length - 1) k = arr.length - 1;
    return arr[k];
  }

  function getTangent(k: number, factor: number, array: number[]) {
    return (factor * (clipInput(k + 1, array) - clipInput(k - 1, array))) / 2;
  }

  function cubicInterpolation(
    array: number[],
    t: number,
    tangentFactor?: number
  ) {
    if (tangentFactor === undefined) tangentFactor = 1;

    const k = Math.floor(t);
    const m = [
      getTangent(k, tangentFactor, array),
      getTangent(k + 1, tangentFactor, array),
    ];
    const p = [clipInput(k, array), clipInput(k + 1, array)];
    t -= k;
    const t2 = t * t;
    const t3 = t * t2;
    return (
      (2 * t3 - 3 * t2 + 1) * p[0] +
      (t3 - 2 * t2 + t) * m[0] +
      (-2 * t3 + 3 * t2) * p[1] +
      (t3 - t2) * m[1]
    );
  }
  return { actionDown, actionUp, moveEvent };
}
