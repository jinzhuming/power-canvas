import { isInteger, throttle } from 'lodash';
import { Matrix } from '../utils/matrix';
import { Ref, toRefs } from 'vue';
import { useCanvasOffsetStore, useCanvasZoomStore } from '../stores/dashboard';

/*
 * must be called in onMounted
 * */
export const useZoomCanvas = (dashboardRef: Ref<HTMLDivElement | null>) => {
  const dom = dashboardRef.value;

  if (!dom) return;

  const canvasOffsetStore = useCanvasOffsetStore();
  const canvasZoomStore = useCanvasZoomStore();

  const onWheel = throttle((e: WheelEvent) => {
    const zoomSpeed = 2;
    // must press ctrl or meta
    if (!e.ctrlKey && !e.metaKey) return;

    /*
     * 计算缩放点，比较麻烦，因为可能鼠标会移动到其他元素，clientX 参照系就变了
     * 所以用相对于左上角的 xy，减去 content 的 left top，得到实际相对于 content 的值
     * */
    const ox = e.x - dom.getBoundingClientRect().left;
    const oy = e.y - dom.getBoundingClientRect().top;

    /*
     * 这么处理比较奇怪，是因为在滑动的时候（滚轮包括触摸板），delta 是一个整数，在双指缩放的时候，他是一个浮点数
     * 那么利用这一点，当为浮点数的时候加大系数调整缩放的速度，可以缓解双指捏合缩放速度过慢的问题
     * */
    const delta =
      -(isInteger(e.deltaY) ? e.deltaY / 1000 : e.deltaY / 100) * zoomSpeed;
    const newZoom = canvasZoomStore.zoom * (1 + delta);
    if (newZoom < 0.2 || newZoom > 5) return;

    // Matrix calculation
    const v = new Matrix(1, 3, [[canvasOffsetStore.x, canvasOffsetStore.y, 1]]);
    const tf = new Matrix(3, 3, [
      [1, 0, 0],
      [0, 1, 0],
      [-ox, -oy, 1]
    ]);
    const sc = new Matrix(3, 3, [
      [1 + delta, 0, 0],
      [0, 1 + delta, 0],
      [0, 0, 1]
    ]);
    const tb = new Matrix(3, 3, [
      [1, 0, 0],
      [0, 1, 0],
      [ox, oy, 1]
    ]);
    const r = v.multiplyD(tf).multiplyD(sc).multiplyD(tb);

    const x: number = r[0][0];
    const y: number = r[0][1];

    canvasZoomStore.set(newZoom);
    canvasOffsetStore.set({ x, y });
  }, 20);

  dom.addEventListener('wheel', onWheel);
};
