import { IPanel, useSelectedPanelsStore } from '../stores/panels';
import { Ref, toRefs } from 'vue';

export const useSelectedPanelsRange = () => {
  const selectedPanelsStore = useSelectedPanelsStore();

  // 因为可以框选多个 panel， 所以计算一下多个 panel 的边界
  const { panels: selectedPanels }: { panels: Ref<IPanel[]> } =
    toRefs(selectedPanelsStore);
  let minX: number | null = null;
  let minY: number | null = null;
  let maxX: number | null = null;
  let maxY: number | null = null;
  selectedPanels.value.forEach((item) => {
    if (!minX || item.x < minX) {
      minX = item.x;
    }
    if (!minY || item.y < minY) {
      minY = item.y;
    }
    if (!maxX || item.x + item.width > maxX) {
      maxX = item.x + item.width;
    }
    if (!maxY || item.y + item.height > maxY) {
      maxY = item.y + item.height;
    }
  });
  return {
    minX: minX || 0,
    minY: minY || 0,
    maxX: maxX || 0,
    maxY: maxY || 0
  };
};
