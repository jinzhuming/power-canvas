/*
 * must be called in onMounted
 * */
import { onUnmounted, toRefs } from 'vue';
import { usePanelsStore } from '../stores/panels';
import { useCanvasZoomStore } from '../stores/dashboard';

export const useMovePanel = (panelID: string, panelDom: HTMLDivElement) => {
  const panelsStore = usePanelsStore();
  const canvasZoomStore = useCanvasZoomStore();

  const { panels } = toRefs(panelsStore);
  const { zoom } = toRefs(canvasZoomStore);

  // 这个是用来判断是否是点击导致的误操作
  const initMousePosition = {
    x: 0,
    y: 0
  };

  // 这个是实际计算每次的移动距离
  const prevMousePosition = {
    x: 0,
    y: 0
  };

  const onMouseMove = (e: MouseEvent) => {
    const currentX = e.x;
    const currentY = e.y;

    // 如果和初始距离偏移量在5以内，代表可能是点击导致的抖动，不做操作
    if (
      Math.abs(currentX - initMousePosition.x) < 5 &&
      Math.abs(currentY - initMousePosition.y) < 5
    )
      return;

    // 这里需要考虑到缩放，缩放后实际移动的坐标和记录的坐标是有一个倍数差距的，把这个消除掉
    const movedX = (currentX - prevMousePosition.x) / zoom.value;
    const movedY = (currentY - prevMousePosition.y) / zoom.value;

    // 记录一下当前状态
    prevMousePosition.x = currentX;
    prevMousePosition.y = currentY;

    panelsStore.set(
      panels.value.map((panel) => {
        if (panel.id === panelID) {
          return {
            ...panel,
            x: panel.x + movedX,
            y: panel.y + movedY
          };
        }
        return panel;
      })
    );
  };
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
  };

  const onMouseDown = (e: MouseEvent) => {
    // 不处理按下 ctrl 和 cmd 的情况
    if (e.ctrlKey || e.metaKey) return;
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    prevMousePosition.x = e.x;
    prevMousePosition.y = e.y;

    initMousePosition.x = e.x;
    initMousePosition.y = e.y;
  };
  panelDom.addEventListener('mousedown', onMouseDown);

  onUnmounted(() => {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    panelDom.removeEventListener('mousedown', onMouseDown);
  });
};
