import { onMounted, onUnmounted, reactive, Ref, toRefs } from 'vue';
import {
  IPanel,
  usePanelsStore,
  useSelectedPanelsStore
} from '../stores/panels';
import {
  useCanvasID,
  useCanvasZoomStore,
  useDashboardID
} from '../stores/dashboard';

interface IBox {
  x: number;
  y: number;
  x1: number;
  y1: number;
  visibility: boolean;
}

export const useMultipleSelectBox = () => {
  const canvasID = useCanvasID();
  const dashboardID = useDashboardID();
  const box: IBox = reactive({
    x: 0,
    y: 0,
    x1: 0,
    y1: 0,
    visibility: false
  });
  const panelsStore = usePanelsStore();
  const { panels } = toRefs(panelsStore);
  const canvasZoomStore = useCanvasZoomStore();
  const { zoom } = toRefs(canvasZoomStore);

  const selectedPanelsStore = useSelectedPanelsStore();
  const onMouseMove = (e: MouseEvent) => {
    const currentX = e.x;
    const currentY = e.y;

    // 如果和初始距离偏移量在5以内，代表可能是点击导致的抖动，不做操作
    if (Math.abs(currentX - box.x) < 5 && Math.abs(currentY - box.y) < 5) {
      box.visibility = false;
      return;
    }
    box.visibility = true;

    // 这里需要注意，因为挂载在 dashbaord 下，所以不需要考虑缩放
    box.x = Math.min(box.x, currentX);
    box.y = Math.min(box.y, currentY);
    box.x1 = Math.max(box.x, currentX);
    box.y1 = Math.max(box.y, currentY);
  };
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);

    //  抬起的时候如果确实触发了框选，则读取一下所有的框内的 panels 选中
    if (box.visibility) {
      box.visibility = false;
      const canvasDom = document.querySelector(`#${canvasID}`);
      if (!canvasDom) {
        console.error('缺少 canvas dom');
        return;
      }
      const rect = canvasDom.getBoundingClientRect();
      selectedPanelsStore.set(
        panels.value.filter((panel) => inBox(box, panel, rect, zoom.value))
      );
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    // 不处理按下 ctrl 和 cmd 的情况
    if (e.ctrlKey || e.metaKey) return;
    // 只识别左键按下
    if (e.button !== 0) return;
    const canvasDom = document.querySelector(`#${canvasID}`);
    const dashboardDom = document.querySelector(`#${dashboardID}`);
    // 只允许指定的几个 dom 可以做框选，点击在其他dom不做处理
    if (e.target !== dashboardDom && e.target !== canvasDom) return;
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    box.x = e.x;
    box.y = e.y;
  };

  onMounted(() => {
    window.addEventListener('mousedown', onMouseDown);
  });

  onUnmounted(() => {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousedown', onMouseDown);
  });

  return box;
};

function inBox(box: IBox, panel: IPanel, rect: DOMRect, zoom: number) {
  // 这里需要注意一下，rect 和 x 取的是一个坐标，相对于可视区域左上角的，不需要考虑缩放，但是 box 里记录的是一个逻辑坐标，所以要考虑缩放
  return (
    panel.x * zoom + rect.x >= box.x &&
    panel.y * zoom + rect.y >= box.y &&
    panel.x * zoom + panel.width * zoom + rect.x <= box.x1 &&
    panel.y * zoom + panel.height * zoom + rect.y <= box.y1
  );
}
