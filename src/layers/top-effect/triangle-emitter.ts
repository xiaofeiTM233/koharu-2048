import { Particle, Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { Application, Texture } from "pixi.js";
/**
 * emitter工具函数, 会自动启动emitter并返回一个终止函数
 * @param emitter
 * @param stopCallback 终止函数中调用的函数
 * @returns 终止函数, 功能是停止当前emitter并回收
 */
export function emitterStarter(
  emitter: Emitter,
  stopCallback?: () => void
): () => Promise<void> {
  let elapsed = Date.now();
  let stopFlag = false;
  // Update function every frame
  let update = function () {
    if (stopFlag) {
      return;
    }
    // Update the next frame
    requestAnimationFrame(update);

    var now = Date.now();
    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;
  };

  let stop = async function () {
    stopFlag = true;
    emitter.emit = false;
    emitter.destroy();
    if (stopCallback) {
      stopCallback();
    }
  };

  // Start emitting
  emitter.emit = true;

  // Start the update
  update();

  return stop;
}
const triangle = Texture.from(
  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/effectTexture/FX_TEX_Triangle_02_a.png"
);
export function triangleEmitter({
  app,
  x,
  y,
  baseDuration = 0.02,
  maxCircleSize,
}: {
  x: number;
  y: number;
  app: Application;
  baseDuration?: number;
  maxCircleSize: number;
}) {
  class ClickTriangle {
    public static type = "ClickTriangle";
    public order = 5; // 代表延迟执行, 可能是 emitter 包的问题, 引入定义报错
    public rotationedNum = 0; // 两个向上两个向下
    public topNum = 1;
    initParticles(first: Particle): void {
      let next = first;
      const spawnWidth = maxCircleSize * 0.9;
      while (next) {
        let temX,
          temY = 0;
        if (this.rotationedNum < 2) {
          next.angle = 180;
          this.rotationedNum++;
        }
        temX = Math.random();
        const randomDirection = Math.random() > 0.5 ? 1 : -1;
        temX = temX * spawnWidth * randomDirection;
        temY = Math.sqrt(spawnWidth ** 2 - Math.abs(temX) ** 2);
        this.topNum++;
        if (this.topNum % 2 === 0) {
          temY = -temY;
        }
        next.position.x = temX + x;
        next.position.y = temY + y;
        next = next.next;
      }
    }
    updateParticle(particle: Particle, deltaSec: number): void {
      const oldVX = particle.x;
      const oldVY = particle.y;
      const moveDistance = (0.3 * maxCircleSize) / (13 * baseDuration);
      const xDirection = oldVX - x > 0 ? 1 : -1;
      const yDirection = oldVY - y > 0 ? 1 : -1;
      const yDistance = Math.abs(oldVY - y);
      const xDistance = Math.abs(oldVX - x);
      particle.x += xDirection * moveDistance * deltaSec;
      particle.y +=
        yDirection *
        Math.min((yDistance / xDistance) * moveDistance, moveDistance) *
        deltaSec;
    }
  }
  Emitter.registerBehavior(ClickTriangle);
  // 相比整个播放器高度的大小
  const triangleScaleBase = app.view.height / 2 / 128; // 不知道为啥第一次点击拿不到宽度
  let emitterConfig = {
    frequency: 0.001,
    maxParticles: 4,
    lifetime: {
      min: baseDuration * 18,
      max: baseDuration * 18,
    },
    behaviors: [
      {
        type: "textureSingle",
        config: {
          texture: triangle,
        },
      },
      {
        type: "ClickTriangle",
      },
      {
        type: "alpha",
        config: {
          alpha: {
            list: [
              { value: 1, time: 0 },
              { value: 0.9, time: 4 / 13 },
              { value: 0.4, time: 5 / 13 },
              { value: 0.9, time: 7 / 13 },
              { value: 0.9, time: 1 },
            ],
          },
        },
      },
      {
        type: "scale",
        config: {
          scale: {
            list: [
              {
                value: 0,
                time: 0,
              },
              {
                value: triangleScaleBase * 0.024,
                time: 0.2,
              },
              {
                value: triangleScaleBase * 0.015,
                time: 0.6,
              },
              {
                value: 0,
                time: 1,
              },
            ],
          },
          minMult: 0.5,
        },
      },
      {
        type: "color",
        config: {
          color: {
            list: [
              { value: "#ffffff", time: 0 },
              { value: "#ffffff", time: 3 / 13 },
              { value: "#02d5fa", time: 4 / 13 },
              { value: "#b8e1fe", time: 1 },
            ],
          },
        },
      },
    ],
  } as EmitterConfigV3;
  const triangleEmitter = new Emitter(app.stage, emitterConfig);
  return emitterStarter(triangleEmitter);
}
