<template>
<div class="game-over-container">

</div>
</template>

<script setup lang="ts">
import vueQr from 'vue-qr/src/packages/vue-qr.vue'

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
  .game-over-title {
    font-size: 2rem;
    color: #fff;
    margin-bottom: 1rem;
  }
  .game-over-qr {
    width: 10rem;
    height: 10rem;
    margin-bottom: 1rem;
  }
}
</style>
