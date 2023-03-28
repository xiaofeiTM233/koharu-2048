<template>
  <span class="cell">{{ "" }}</span>
</template>

<script>
export default {
  setup() {
    return {};
  },
  components: {},
};
</script>

<style scoped>
.cell {
  user-select: none;
  cursor: default;
}

.cell {
  width: 100px;
  height: 100px;
  margin: 5px;
  line-height: 90px;
  display: inline-block;
  font-size: 55px;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  border-radius: 7px;
  font-family: "Clear Sans";
  color: #766;
  background-color: #dcb;
}
</style>
