<template>
  <div id="top_effect" ref="uiElement"></div>
</template>

<script lang="ts" setup>
import { Application } from "pixi.js";
import { clickEffect } from "./click-effect";
import { moveEffect } from "./move-effect";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

import { getXY } from "./util";
import { throttle } from "lodash-es";
import { clientIsMobile } from "@/utils";
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

const trigger = throttle(
  (e: MouseEvent | TouchEvent) => {
    const { x, y } = getXY(e);
    clickEffect(topEffectApp.value, x, y);
  },
  clientIsMobile() ? 40 : 0
);
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
