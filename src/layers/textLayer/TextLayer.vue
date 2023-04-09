<template>
  <div class="container">
    <div class="player-info">
      <div class="player-level">Lv. {{ playerLevel }}</div>
      <div class="player-rank">Rank. {{ playerRank }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const playerLevel = ref(114);
const playerRank = ref(514);
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  .player-info {
    left: 0;
    top: 0;
  }
}
</style>
