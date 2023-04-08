import { Application } from "pixi.js";
import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
let app: Application;
const KOHARU_ORIGIN_RATE = 3460 / (2568 - 88);
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
      globalThis.__PIXI_APP__ = app;
      const koharu = new Spine(koharuResource.spineData);
      Reflect.set(koharu, "koharu", "true");
      app.stage.addChild(koharu);
      koharu.autoUpdate = true;
      this.resize(height, width);
      (app.view as unknown as HTMLElement).classList.add("koharu-canvas");
      container!.appendChild(app.view as unknown as HTMLElement);
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
    // 计算逻辑 保证小春的嘴巴位于游戏面板上方50px处? 且头占宽度的80%
    const koharuWidth = koharu.width / koharu.scale.x;
    const koharuHeight =
      koharu.height / koharu.scale.y -
      (koharu.height / koharu.scale.y / 2568) * 88;
    let finalHeight, finalWidth;
    let scale;
    if (width / height < KOHARU_ORIGIN_RATE) {
      // 以高度优先
      finalHeight = height * 1.5;
      finalWidth = finalHeight * KOHARU_ORIGIN_RATE;
      scale = finalHeight / koharuHeight;
    } else {
      finalWidth = width * 1.5;
      finalHeight = finalWidth / KOHARU_ORIGIN_RATE;
      scale = finalWidth / koharuWidth;
    }
    koharu.scale.set(scale);
    koharu.pivot.set(-1732.1, -2255.4);
    app.renderer.resize(finalWidth, finalHeight);
  },
};

export function useApplication() {}
