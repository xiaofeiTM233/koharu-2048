<template>
  <div class="game-over-container">
    <div class="game-over-contents">
      <img class="game-over-title" src="./win.webp" v-if="gameSucceed" />
      <img class="game-over-title" src="./defeat.webp" v-else />
      <div class="game-over-text">
        <div class="victory" v-if="gameSucceed">
          <p>
            经过老师<span class="game-duration-text">{{
              secondsToHms(gameDuration)
            }}</span
            >的不懈努力，小春终于吃上了蛋糕，可喜可贺可喜可贺。
          </p>
          <p>
            普拉娜<span v-if="0 !== planaHelpCount"
              >一共帮助了老师
              <span class="plana-help-text">{{ planaHelpCount }}</span> 次。</span
            ><span v-else
              ><span class="plana-help-text">没有帮助老师</span
              >，不愧是sensei！</span
            >
          </p>
        </div>
        <div class="lose" v-else>
          <p>
            经过老师<span class="game-duration-text">{{
              secondsToHms(gameDuration)
            }}</span
            >的努力，小春最终还是没能吃上蛋糕。
            <span style="font-size: 0.5rem"
              >像极了加班赶这个小游戏然而核心功能还没实现完的我们</span
            >
          </p>
          <p>
            普拉娜<span v-if="0 !== planaHelpCount"
              >一共帮助了老师
              <span class="plana-help-text">{{ planaHelpCount }}</span> 次。</span
            ><span v-else
              ><span class="plana-help-text">没有帮助老师</span
              >，不愧是sensei！</span
            >
          </p>
        </div>
        <div>截图分享给其他Sensei，大家一起帮小春做蛋糕吧！</div>
      </div>
      <div class="action-button restart-action-button" @click="handleRestart">重新开始</div>
      <vue-qr class="game-over-qr" text="https://koharu.blue-archive.io" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VueQr from "vue-qr/src/packages/vue-qr.vue";
import eventBus from "@/event";

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

  const hDisplay = h > 0 ? h + "小时" : "";
  const mDisplay = m > 0 ? m + "分" : "";
  const sDisplay = s > 0 ? s + "秒" : "";
  return " " + hDisplay + mDisplay + sDisplay + " ";
}

function handleRestart() {
  eventBus.emit('gameStart');
}
</script>

<style scoped lang="scss">
.game-over-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
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
      width: 200px;
    }

    .game-over-text {
      font-size: 1rem;
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .victory, .lose {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    .game-over-qr {
      width: 150px;
      height: 150px;
      border-radius: 0.5rem;
    }

    .game-duration-text {
      color: var(--color-arona-blue);
    }

    .plana-help-text {
      color: var(--color-plana-red);
    }
  }
}
</style>
