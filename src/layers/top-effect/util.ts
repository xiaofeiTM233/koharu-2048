export const getXY = (e: MouseEvent | TouchEvent) => {
  let x = 0,
    y = 0;
  if (e instanceof MouseEvent) {
    x = e.pageX;
    y = e.pageY;
  }
  if (window.TouchEvent && e instanceof TouchEvent) {
    x = e.targetTouches[0].pageX;
    y = e.targetTouches[0].pageY;
  }
  return { x, y };
};
