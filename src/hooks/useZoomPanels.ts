import { computed, onUnmounted, reactive, ref, Ref, toRefs } from 'vue';
import { useCanvasZoomStore } from '../stores/dashboard';
import { useSelectedPanelsRange } from './useSelectedPanelsRange';

import {
  IPanel,
  usePanelsStore,
  useSelectedPanelsStore
} from '../stores/panels';
type TLabel =
  | 'resize-nw'
  | null
  | 'resize-ne'
  | 'resize-sw'
  | 'resize-se'
  | 'resize-e'
  | 'resize-w'
  | 'resize-s'
  | 'resize-n'
  | 'rotate';

export const useZoomPanels = (rangeBox: HTMLDivElement) => {
  const box = useSelectedPanelsRange();
  const rangeWidth = computed(() => Math.abs(box.value.maxX - box.value.minX));
  const rangeHeight = computed(() => Math.abs(box.value.maxY - box.value.minY));
  const canvasZoomStore = useCanvasZoomStore();
  const { zoom } = toRefs(canvasZoomStore);

  // 方便操作更新选中的 panels
  const panelsStore = usePanelsStore();
  const { panels }: { panels: Ref<IPanel[]> } = toRefs(panelsStore);
  const selectedPanelsStore = useSelectedPanelsStore();
  const { panels: selectedPanels }: { panels: Ref<IPanel[]> } =
    toRefs(selectedPanelsStore);
  const selectedPanelsID = computed(() =>
    selectedPanels.value.map((panel) => panel.id)
  );

  //记录鼠标上次的位置
  const prevMousePosition = reactive({
    x: 0,
    y: 0
  });
  //旋转角度
  const rotate = ref(0);
  // const prevRatio = ref(0);
  //旋转吸附自动矫正的角度
  const ROTATION_SNAPS = [0, 90, 180, -90, -180];
  //旋转吸附自动矫正需要触发的差值
  const ROTATION_SNAPS_THRESHOD = 3;
  const rangeBoxCenter = reactive({
    x: 0,
    y: 0
  });
  const label = ref<TLabel>(null);

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    const currentX = e.x;
    const currentY = e.y;
    // 判断本次移动相对于第一次按下的偏移(以scrren为原点
    const movedX = (currentX - prevMousePosition.x) / zoom.value;
    const movedY = (currentY - prevMousePosition.y) / zoom.value;

    if (!movedY && !movedX) return;

    // 这是计算旋转角度用的
    const rx = rangeBoxCenter.x;
    const ry = rangeBoxCenter.y;

    // 只有旋转再赋值，如果是 null 最后不会更新，依旧使用之前的角度
    let angle: number | null = null;

    // 判断要给元素添加多少偏移量
    let movedLeft = 0;
    let movedTop = 0;
    let movedBottom = 0;
    let movedRight = 0;

    // 因为原点在左上角，所以移动右边下边的时候直接+就可以了，但是移动左边上边，不但要改变原点，还要改变高度（不然就是拖动的效果了）
    switch (label.value) {
      case 'resize-w':
        movedLeft = movedX;
        movedRight = -movedX;
        break;
      case 'resize-e':
        movedRight = movedX;
        break;
      case 'resize-n':
        movedTop = movedY;
        movedBottom = -movedY;
        break;
      case 'resize-s':
        movedBottom = movedY;
        break;
      case 'resize-nw':
        movedLeft = movedX;
        movedRight = -movedX;
        movedTop = movedY;
        movedBottom = -movedY;
        break;
      case 'resize-sw':
        movedLeft = movedX;
        movedRight = -movedX;
        movedBottom = movedY;
        break;
      case 'resize-se':
        movedRight = movedX;
        movedBottom = movedY;
        break;
      case 'resize-ne':
        movedRight = movedX;
        movedTop = movedY;
        movedBottom = -movedY;
        break;
      case 'rotate':
        angle = Math.atan2(ry - currentY, rx - currentX) * (180 / Math.PI) - 90;
        //检查有没有在门槛下可以吸附的角度
        ROTATION_SNAPS.some((snap) => {
          if (
            angle !== null &&
            Math.abs(snap - angle) < ROTATION_SNAPS_THRESHOD
          ) {
            angle = snap;
          }
        });
        rotate.value = angle;
        break;
    }

    prevMousePosition.x = e.clientX;
    prevMousePosition.y = e.clientY;

    if (label.value !== 'rotate') {
      //计算当前相对于上一次尺寸变化的 size 比率
      const currentRangeWidth = movedRight + rangeWidth.value;
      const currentRangeHeight = movedBottom + rangeHeight.value;
      const wTimes = currentRangeWidth / rangeWidth.value;
      const hTimes = currentRangeHeight / rangeHeight.value;

      panelsStore.set(
        panels.value.map((panel) => {
          if (selectedPanelsID.value.includes(panel.id)) {
            // 计算出相对于原来的 x y 移动了多少（因为可以框选多个图形，无法直接添加移动变量，不然就会导致单独缩放，而不是整体缩放）
            const relativeX = (panel.x - box.value.minX) * wTimes;
            const relativeY = (panel.y - box.value.minY) * hTimes;

            return {
              ...panel,
              x: box.value.minX + movedLeft + relativeX,
              y: box.value.minY + movedTop + relativeY,
              width: panel.width * wTimes,
              height: panel.height * hTimes
            };
          }
          return panel;
        })
      );
    }
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseDown = (e: MouseEvent) => {
    // 只识别左键按下
    if (e.button !== 0) return;

    // 阻止冒泡，防止被视为多选
    e.preventDefault();
    e.stopPropagation();

    label.value = (e.target as HTMLDivElement).getAttribute(
      'data-rangeBoxType'
    ) as TLabel;

    prevMousePosition.x = e.x;
    prevMousePosition.y = e.y;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  rangeBox.addEventListener('mousedown', onMouseDown);
  window.addEventListener('blur', onMouseUp);
  onUnmounted(() => {
    onMouseUp();
    rangeBox.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('blur', onMouseUp);
  });
};
