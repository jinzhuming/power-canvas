<script setup lang="ts">
// 这里主要是存放在画布中的各个元素，比如地图、可视化图表、图片、视频等等
import { IPanel, useSelectedPanelsStore } from '../stores/panels';
import { onMounted, watch, ref, Ref, toRefs, watchEffect } from 'vue';
import { useMovePanel } from '../hooks/useMovePanel';
import { debounce } from 'lodash';
import { useChart } from '../hooks/useChart';
import { useClick } from '../hooks/useClick';

const props = defineProps<{ panel: IPanel }>();
const { panel } = toRefs(props);
const panelDomRef = ref<HTMLDivElement | null>(null);

const selectedPanelsStore = useSelectedPanelsStore();
const { panels: selectedPanels }: { panels: Ref<IPanel[]> } =
  toRefs(selectedPanelsStore);

const selectPanel = (e: MouseEvent) => {
  // 选中这里有个逻辑，大概就是要判断是多选还是单选，通过是否 按 ctrl/cmd 判断，如果按下就是多选状态，否则是单选
  if (e.ctrlKey || e.metaKey) {
    // 多选状态比较简单，点击的是未选中的就选中，否则反过来取消他的选中即可
    if (
      selectedPanels.value.map((panel) => panel.id).includes(panel.value.id)
    ) {
      selectedPanelsStore.set(
        selectedPanels.value.filter((item) => item.id !== panel.value.id)
      );
    } else {
      selectedPanelsStore.set(selectedPanels.value.concat(panel.value));
    }
  } else {
    /*
     * 单选有两种情况
     * 1 如果选中的panel有且只有当前一个 panel，视为取消选中，否则都只单选当前 panel
     * */
    if (
      selectedPanels.value.length === 1 &&
      selectedPanels.value[0].id === panel.value.id
    ) {
      selectedPanelsStore.set([]);
    } else {
      selectedPanelsStore.set([panel.value]);
    }
  }
};

onMounted(() => {
  const dom = panelDomRef.value;
  if (!dom) return;
  useMovePanel(panel.value.id, dom);
});

onMounted(() => {
  const dom = panelDomRef.value;
  if (!dom) return;
  useClick(dom, (e) => {
    selectPanel(e);
  });

  const chartRef = useChart(dom);
  const reRender = debounce(() => {
    chartRef.value?.forceFit();
  }, 200);

  watch(
    () => [panel.value.width, panel.value.height],
    () => {
      reRender();
    }
  );
});
</script>

<template>
  <div
    ref="panelDomRef"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    class="panel"
    :style="{
      width: `${panel.width}px`,
      height: `${panel.height}px`,
      left: `${panel.x}px`,
      top: `${panel.y}px`,
      overflow: 'hidden',
      background: '#F8F9FC'
    }"
  ></div>
</template>

<style>
.panel {
  position: absolute;
  z-index: 1;
}
</style>
