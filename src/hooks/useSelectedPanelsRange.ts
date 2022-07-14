import { IPanel, useSelectedPanelsStore } from '../stores/panels';
import { computed, Ref, toRefs, watchEffect } from 'vue';
import { watch } from 'vite/types/chokidar';

export const useSelectedPanelsRange = () => {
  const selectedPanelsStore = useSelectedPanelsStore();

  // 因为可以框选多个 panel， 所以计算一下多个 panel 的边界
  const { panels: selectedPanels }: { panels: Ref<IPanel[]> } =
    toRefs(selectedPanelsStore);
  return computed(() => {
    let minX: number = 0;
    let minY: number = 0;
    let maxX: number = 0;
    let maxY: number = 0;
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
    return { minX, minY, maxX, maxY };
  });
};
