export const getXY = (e: MouseEvent | TouchEvent) => {
  let x = 0,
    y = 0;
  if (e instanceof MouseEvent) {
    x = e.pageX;
    y = e.pageY;
  }
  if (window.TouchEvent && e instanceof TouchEvent) {
    var rect = (e.target as any).getBoundingClientRect();
    x = e.targetTouches[0].pageX - rect.left;
    y = e.targetTouches[0].pageY - rect.top;
  }
  return { x, y };
};
