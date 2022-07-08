<script setup lang="ts">
import Canvas from '../components/Canvas.vue';
import Thumb from '../components/thumb/index.vue';
import { useMoveCanvas } from '../hooks/useMoveCanvas';
import { onMounted, Ref, ref, toRefs } from 'vue';
import { useZoomCanvas } from '../hooks/useZoomCanvas';
import { usePanelsStore } from '../stores/panels';
import { v4 as uuid } from 'uuid';
import MultipleSelectPanels from '../components/MultipleSelectBox.vue';
import { useCanvasZoomStore, useDashboardID } from '../stores/dashboard';
const dashboardRef = ref<HTMLDivElement | null>(null);

const dashboardID = useDashboardID();
onMounted(() => {
  useMoveCanvas(dashboardRef);
  useZoomCanvas(dashboardRef);
});

function getRandom() {
  return Math.floor(Math.random() * 2000) * (Math.round(Math.random()) * 2 - 1);
}

const panelsStore = usePanelsStore();
const panelAdd = () => {
  panelsStore.set(
    panelsStore.panels.concat({
      id: uuid(),
      width: 200,
      height: 200,
      rotate: 0,
      x: getRandom(),
      y: getRandom()
    })
  );
};
const panelClear = () => {
  panelsStore.clear();
};

const canvasZoomStore = useCanvasZoomStore();
const { zoom }: { zoom: Ref<number> } = toRefs(canvasZoomStore);
</script>

<template>
  <div ref="dashboardRef" :id="dashboardID">
    <div class="tools">
      <button @click="panelAdd">添加一个图形</button
      ><button @click="panelClear">清空</button>
    </div>
    <Canvas />
    <MultipleSelectPanels />
    <Thumb />
    <div id="zoom">当前缩放：{{ zoom.toFixed(2) }}</div>
  </div>
</template>

<style>
#dashboard {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tools {
  position: fixed;
  top: 0;
  left: 0;
}

#zoom {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 14px;
}
</style>
