import { Application, BLEND_MODES, Point, SimpleRope, Texture } from "pixi.js";
import { throttle } from "lodash-es";
import { triangleEmitter } from "./triangle-emitter";
const trailTexture = Texture.from(
  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/effectTexture/trail-256x16.png"
);
let mouseDown = false;
export function moveEffect(app: Application) {
  if (!app) return;
  // Get the texture for rope.
  let historyX = [] as number[];
  let historyY = [] as number[];

  // historySize determines how long the trail will be.
  const historySize = 20;
  // ropeSize determines how smooth the trail will be.
  const ropeSize = 200;
  const points = [] as Point[];

  // Create rope points.
  for (let i = 0; i < ropeSize; i++) {
    points.push(new Point(0, 0));
  }
  function initHistory() {
    historyX = [];
    historyY = [];
    // Create history array.
    for (let i = 0; i < historySize; i++) {
      historyX.push(0);
      historyY.push(0);
    }
  }
  initHistory();
  // Create the rope
  const rope = new SimpleRope(trailTexture, points);

  // Set the blendmode
  // rope.blendMode = BLEND_MODES.ADD;

  app.stage.addChild(rope);

  let mouseposition = null as unknown as { x: number; y: number };
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;
  app.stage.on("mousedown", event => {
    mouseDown = true;
  });
  app.stage.on("mouseup", () => {
    mouseDown = false;
  });
  const triangle = throttle(() => {
    const baseDuration = 0.02;
    const triangleRemove = triangleEmitter({
      app,
      ...mouseposition,
      maxCircleSize: Math.min((app.view.height / 2) * 0.03, 20) * Math.random(),
    });
    setTimeout(() => {
      triangleRemove();
    }, 1000 * baseDuration * 18);
  }, 80);
  app.stage.on("mousemove", event => {
    rope.alpha = mouseDown ? 1 : 0;
    mouseposition = mouseposition || { x: 0, y: 0 };
    mouseposition.x = event.global.x;
    mouseposition.y = event.global.y;
    mouseDown && Math.random() > 0.8 && triangle();
  });
  function updateHistory(mouseposition: { x: number; y: number }): void {
    // Update the mouse values to history
    historyX.pop();
    historyX.unshift(mouseposition.x);
    historyY.pop();
    historyY.unshift(mouseposition.y);
  }
  // Listen for animate update
  app.ticker.add(() => {
    if (!mouseposition) return;

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
}
