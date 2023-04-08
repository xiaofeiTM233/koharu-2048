import App from "./App.vue";
import { createApp } from "vue";
import "@/assets/scss/index.scss";
import "pixi-spine";

String.prototype.computedCssToNumber = function () {
  return Number(this.replace("px", ""));
};

createApp(App).mount("#app");
