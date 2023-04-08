import { Application } from "pixi.js";
import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import { SoundLayer } from "@/layers/soundLayer";
let app: Application;
const KOHARU_ORIGIN_RATE = 3460 / (2568 - 88);
const KOHARU_PADDING_TOP = 88;
const KOHARU_PADDING_LEFT = 100;
const KOHARU_STANDARD_WIDTH = 3460;
const KOHARU_STANDARD_HEIGHT = 2568;
const KOHARU_PIVOT_X = -1732.1 + KOHARU_PADDING_LEFT;
const KOHARU_PIVOT_Y = -2255.4;
const KOHARU_MOUTH_OFFSET = 1412;
const KOHARU_BODY_SIZE = 0.38;
const DLSS = 1;
export const BackgroundLayer = {
  /**
   * 初始化背景
   * @param container 背景容器的html element
   */
  init(container?: HTMLElement) {
    if (!container) {
      const find = document.querySelector("#koharu-container");
      if (!find) {
        console.error("container not found");
        return Promise.reject("koharu container not found");
      }
      container = find as HTMLElement;
    }
    const style = getComputedStyle(container);
    const height = style.height.computedCssToNumber();
    const width = style.width.computedCssToNumber();
    return PIXI.Assets.load(
      "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/Koharu_home/Koharu_home-2x/Koharu_home.skel"
    ).then(koharuResource => {
      app = new Application({ width: width, height: height });
      window.__PIXI_APP__ = app;
      const koharu = new Spine(koharuResource.spineData);
      koharu.state.addAnimation(0, "Idle_01", true, 0);

      SoundLayer.init(
        koharu.spineData.events
          .map(event => {
            if (event.name.startsWith("Talk")) {
              return "";
            }
            return event.name.replace("sound/", "").replace(".wav", "");
          })
          .filter(it => it)
      );

      Reflect.set(koharu, "koharu", "true");
      app.stage.addChild(koharu);
      koharu.autoUpdate = true;
      this.resize(height, width);
      (app.view as unknown as HTMLElement).classList.add("koharu-canvas");
      container!.appendChild(app.view as unknown as HTMLElement);
      // 初始化完成,将其居中
      const viewStyle = getComputedStyle(app.view as unknown as HTMLElement);
      const viewActualWidth = viewStyle.width.computedCssToNumber() / DLSS;
      const offsetX = Math.abs(viewActualWidth - width) / 2;

      (
        app.view as unknown as HTMLElement
      ).style.transform = `scale(calc(1 / ${DLSS})) translateX(-${offsetX}px)`;
    });
  },
  /**
   * 字面意思
   * @param height 整个背景的高度
   * @param width 整个游戏界面的宽度(竖屏时为宽度, 横屏时为非模糊区域的宽度)
   */
  resize(height: number, width: number) {
    if (!app) {
      console.error("app not init");
    }
    const findList = app.stage.children.filter(it => Reflect.get(it, "koharu"));
    if (findList.length !== 1) {
      console.error("没找到小春");
      return;
    }
    const koharu = findList[0] as Spine;
    // 小春home的大小 3460*2568
    // 小春嘴巴的y:1412
    // 小春的头宽905
    // 小春的身子距离底部的padding 88px
    // 实际上小春的脸不在正中间 有那么些许偏移150px?
    // 计算逻辑 保证小春的嘴巴位于游戏面板上方50px处?
    const koharuWidth =
      koharu.width / koharu.scale.x -
      (koharu.width / koharu.scale.x / KOHARU_STANDARD_WIDTH) *
        KOHARU_PADDING_LEFT;
    const koharuHeight =
      koharu.height / koharu.scale.y -
      (koharu.height / koharu.scale.y / KOHARU_STANDARD_HEIGHT) *
        KOHARU_PADDING_TOP;
    let finalHeight, finalWidth;
    let scale;
    let mouthOffset = 0;
    const isVertical = width / height < KOHARU_ORIGIN_RATE;
    if (isVertical) {
      // 以高度优先
      // 加高保证嘴巴能被看到

      const screenBodyHeight = height * 0.5;
      const sourceBodyHeight = screenBodyHeight / KOHARU_BODY_SIZE;

      finalHeight = sourceBodyHeight * DLSS;

      finalHeight = finalHeight + mouthOffset;
      finalWidth = finalHeight * KOHARU_ORIGIN_RATE;

      scale = finalHeight / koharuHeight;

      mouthOffset = sourceBodyHeight - screenBodyHeight;
      console.log(mouthOffset);
    } else {
      // 横屏的时候尽量确保嘴巴在屏幕1/2处
      finalWidth = width * DLSS;
      finalHeight = finalWidth / KOHARU_ORIGIN_RATE;
      scale = finalWidth / koharuWidth;
      mouthOffset =
        (finalHeight / KOHARU_STANDARD_HEIGHT) * KOHARU_MOUTH_OFFSET;
      mouthOffset = mouthOffset - height / 4;
    }
    koharu.scale.set(scale);
    koharu.pivot.set(KOHARU_PIVOT_X, KOHARU_PIVOT_Y + mouthOffset);
    app.renderer.resize(finalWidth, finalHeight);
  },
};

export function useApplication() {}
