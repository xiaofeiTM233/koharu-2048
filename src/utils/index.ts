import isMobile from "ismobilejs";
/*
 * wait in promise
 */
export function wait(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
export function clientIsMobile() {
  return isMobile(window.navigator).any;
}
