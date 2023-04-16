<template>
  <div class="game-over-container">
    <div class="game-over-contents">
      <img class="game-over-title" src="./win.png" v-if="gameSucceed" />
      <img class="game-over-title" src="./defeat.png" v-else />
      <div class="game-over-text">
        <p>通过老师<span class="game-duration-text">{{ secondsToHms(gameDuration) }}</span>的不懈努力，小春终于吃上了蛋糕，可喜可贺，可喜可贺。</p>
        <p>普拉娜一共帮助了老师</p>
      </div>
      <vue-qr class="game-over-qr" text="https://koharu.blue-archive.io" />
    </div>
  </div>
</template>

<script setup lang="ts">
import vueQr from "vue-qr/src/packages/vue-qr.vue";
withDefaults(
  defineProps<{
    gameSucceed: boolean;
    planaHelpCount: number;
    gameDuration: number;
  }>(),
  {
    gameSucceed: false,
    planaHelpCount: 0,
    gameDuration: 0,
  }
);

function secondsToHms(d: number) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? h + '小时' : "";
  const mDisplay = m > 0 ? m + '分' : "";
  const sDisplay = s > 0 ? s + '秒' : "";
  return hDisplay + mDisplay + sDisplay;
}
</script>

<style scoped lang="scss">
.game-over-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .game-over-contents {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
    gap: 1rem;

    @media screen and (min-width: 768px) {
      width: 30rem;
    }

    .game-over-title {
      font-size: 2rem;
      color: #fff;
      margin-bottom: 1rem;
    }

    .game-over-text {
      font-size: 1.25rem;
      color: #fff;
      text-align: center;
      margin-bottom: 1rem;
    }

    .game-over-qr {
      width: 10rem;
      height: 10rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
