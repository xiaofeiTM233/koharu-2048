<template>
  <div class="gameApp">
    <TopEffect />
    <div class="gameApp__afterLoading" v-if="!loading">
      <BoardView />
    </div>
  </div>
  <TextLayer />
</template>

<script lang="ts" setup>
import BoardView from "./layers/2048Layer/BoardView.vue";
import Hammer from "hammerjs";
import init from ".";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import eventBus from "./event";
import TextLayer from "@/layers/textLayer/TextLayer.vue";
import TopEffect from "./layers/top-effect/index.vue";




if (import.meta.env.DEV) {
  Reflect.set(window, "eventBus", eventBus);
  eventBus.on("*", (e, args) => console.log("events:", e, "args:", args));
}

const playerHeight = ref(0);
const playerWidth = ref(0);
const loading = ref(true);
onMounted(() => {
  init().then(() => {
    loading.value = false;
  });
});
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
  const swipeHandler = new Hammer(document.body);
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
const getHeight = () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
getHeight();
window.addEventListener("resize", getHeight);
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style>
.gameApp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-family: "Clear Sans", sans-serif;
  font-size: 21px;
}

.board {
  width: 80vmin;
  max-width: 440px;
  aspect-ratio: 1;
}

.gameApp__afterLoading {
  position: absolute;
  bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 3rem);
  height: calc(100dvh - 3rem);
  height: calc(var(--vh, 1vh) * 100 - 3rem);
  height: calc(var(--vh, 1dvh) * 100 - 3rem);
  justify-content: flex-end;
}
</style>
