<template>
  <div class="overlay" v-show="show">
    <p class="message">{{ contents }}</p>
    <button class="tryAgain" @click="restart">Try again</button>
  </div>
</template>

<script>
import { toRefs, ref, computed } from "vue";
export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
    onrestart: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { board } = toRefs(props);
    const show = computed(() => {
      return board.value.hasWon() || board.value.hasLost();
    });
    const contents = computed(() => {
      if (board.value.hasWon()) {
        return "Good Job!";
      } else if (board.value.hasLost()) {
        return "Game Over";
      } else {
        return "";
      }
    });
    const restart = () => {
      props.onrestart && props.onrestart();
    };
    return {
      show,
      contents,
      restart,
    };
  },
};
</script>

<style scoped>
.overlay {
  position: absolute;
  top: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  left: 0px;
  right: 0px;
  font-size: 55px;
  font-weight: bolder;
  background-color: rgba(221, 221, 221, 0.5);
  border-radius: 7px;
}

.tryAgain {
  background-color: #876;
  color: #fff;
  height: 40px;
  width: 200px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.overlay .message {
  color: #666;
}

.overlay {
  animation-duration: 0.2s;
  animation-name: newTile;
  animation-fill-mode: forwards;
  animation-delay: 0.15s;
  transform: scale(0);
}
</style>
