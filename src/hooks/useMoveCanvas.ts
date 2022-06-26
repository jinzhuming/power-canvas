import { toRefs, watchEffect, Ref } from 'vue';
import { ICanvasOffset, useCanvasOffsetStore } from '../stores/dashboard';
// max limit
const CANVAS_OFFSET_WIDTH = 2000;
const CANVAS_OFFSET_HEIGHT = 2000;

/*
 * must be called in onMounted
 * */
export const useMoveCanvas = (dashboardRef: Ref<HTMLDivElement | null>) => {
  const canvasOffsetStore = useCanvasOffsetStore();
  const { x, y } = toRefs(canvasOffsetStore);
  const dom = dashboardRef.value;

  if (!dom) return;
  let prevOffset: ICanvasOffset | null = null;
  let timer: NodeJS.Timeout | null = null;

  watchEffect((onCleanup) => {
    const onWheel = (e: WheelEvent) => {
      // 不处理按下 ctrl 和 cmd 的情况
      if (e.ctrlKey || e.metaKey) return;

      if (prevOffset === null) {
        prevOffset = { x: x.value, y: y.value };
      }
      e.preventDefault();
      const deltaX = e.deltaX || (e as any).wheelDeltaX;
      const deltaY = e.deltaY || (e as any).wheelDeltaY;

      const offset = { x: prevOffset.x, y: prevOffset.y };
      offset.x -= deltaX;
      offset.y -= deltaY;

      // limit
      if (offset.x < -CANVAS_OFFSET_WIDTH) {
        offset.x = -CANVAS_OFFSET_WIDTH;
      }
      if (offset.x > CANVAS_OFFSET_WIDTH) {
        offset.x = CANVAS_OFFSET_WIDTH;
      }
      if (offset.y < -CANVAS_OFFSET_HEIGHT) {
        offset.y = -CANVAS_OFFSET_HEIGHT;
      }
      if (offset.y > CANVAS_OFFSET_HEIGHT) {
        offset.y = CANVAS_OFFSET_HEIGHT;
      }
      prevOffset = { ...offset };

      if (timer) {
        clearTimeout(timer);
      }

      canvasOffsetStore.set(offset);

      // because wheel event not have "wheelEnd" event,so simulate it
      timer = setTimeout(() => {
        prevOffset = null;
      }, 200);
    };

    dom.addEventListener('wheel', onWheel);

    onCleanup(() => {
      dom.removeEventListener('wheel', onWheel);
    });
  });
};
