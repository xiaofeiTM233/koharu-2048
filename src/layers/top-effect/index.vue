<template>
  <div id="top_effect" ref="uiElement"></div>
</template>

<script lang="ts" setup>
import { Application } from "pixi.js";
import { clickEffect } from "./click-effect";
import { moveEffect } from "./move-effect";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import Hammer from "hammerjs";
import eventBus from "@/event";
import { getXY } from "./util";
const topEffectApp = ref();
const uiElement = ref<HTMLDivElement | null>(null);
setTimeout(() => {
  const height = document.body.clientHeight;
  const width = document.body.clientWidth;
  const elem = document.querySelector(`#top_effect`);
  topEffectApp.value = new Application({
    height,
    width,
    antialias: true,
    autoDensity: true,
    resolution: 2,
    backgroundAlpha: 0,
    eventMode: "none",
  });
  window.addEventListener("mousedown", trigger);
  window.addEventListener("touchstart", trigger);
  elem?.appendChild(topEffectApp.value.view as any);
  moveEffect(topEffectApp.value);
  // (globalThis as any).__PIXI_APP__ = topEffectApp.value;
}, 40);

const trigger = (e: MouseEvent | TouchEvent) => {
  const { x, y } = getXY(e);
  clickEffect(topEffectApp.value, x, y);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    const direction = event.key.replace("Arrow", "").toLowerCase() as
      | "up"
      | "down"
      | "left"
      | "right";
    eventBus.emit("move", direction);
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  const swipeHandler = new Hammer(uiElement.value!);
  swipeHandler.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
  swipeHandler.on("swipe", e => {
    console.log(e);
    for (const direction of ["left", "right", "up", "down"] as const) {
      if (
        e.direction ===
        Reflect.get(Hammer, `DIRECTION_${direction.toUpperCase()}`)
      ) {
        eventBus.emit("move", direction);
        break;
      }
    }
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
<style lang="scss">
#top_effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none;
}
</style>
