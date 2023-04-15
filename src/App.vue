<template>
  <div class="gameApp">
    <TopEffect />
    <div class="gameApp__afterLoading" v-if="!loading">
      <BoardView />
    </div>
  </div>
  <TextLayer />
  <GameOverScreen v-if="showGameOverScreen" />
</template>

<script lang="ts" setup>
import BoardView from "./layers/2048Layer/BoardView.vue";
import init from ".";
import { computed, onMounted, ref } from "vue";
import eventBus from "./event";
import TextLayer from "@/layers/textLayer/TextLayer.vue";
import TopEffect from "./layers/top-effect/index.vue";
import GameOverScreen from "@/layers/textLayer/assets/GameOverScreen.vue";

const showGameOverScreen = ref(true);

if (import.meta.env.DEV) {
  Reflect.set(window, "eventBus", eventBus);
  eventBus.on("*", (e, args) => console.log("events:", e, "args:", args));
}
eventBus.on("gameFail", () => {
  showGameOverScreen.value = true;
});

eventBus.on("gameSucceed", () => {
  showGameOverScreen.value = true;
});

const playerHeight = ref(0);
const playerWidth = ref(0);
const loading = ref(true);
onMounted(() => {
  init().then(() => {
    loading.value = false;
  });
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
  justify-content: flex-end;
}
</style>
