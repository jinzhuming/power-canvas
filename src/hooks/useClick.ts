import { onUnmounted } from 'vue';

export const useClick = (
  dom: HTMLDivElement,
  callback: (e: MouseEvent) => void
) => {
  const mousePosition: { x: number | null; y: number | null } = {
    x: null,
    y: null
  };

  const onMouseDown = (e: MouseEvent) => {
    mousePosition.x = e.x;
    mousePosition.y = e.y;
  };

  const onMouseUp = (e: MouseEvent) => {
    if (mousePosition.x === null || mousePosition.y === null) return;

    // up 的时候判断一下和 down 的位置偏移，太大就不是点击是移动
    if (
      Math.abs(e.x - mousePosition.x) < 5 &&
      Math.abs(e.x - mousePosition.x) < 5
    ) {
      callback(e);
    }
  };

  dom.addEventListener('mousedown', onMouseDown);
  dom.addEventListener('mouseup', onMouseUp);
  onUnmounted(() => {
    dom.removeEventListener('mousedown', onMouseDown);
    dom.removeEventListener('mouseup', onMouseUp);
  });
};
