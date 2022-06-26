<script setup lang="ts">
import Canvas from '../components/Canvas.vue';
import { useMoveCanvas } from '../hooks/useMoveCanvas';
import { onMounted, ref } from 'vue';
import { useZoomCanvas } from '../hooks/useZoomCanvas';
import { usePanelsStore } from '../stores/panels';
import { v4 as uuid } from 'uuid';
const dashboardRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  useMoveCanvas(dashboardRef);
  useZoomCanvas(dashboardRef);
});

const panelsStore = usePanelsStore();
const panelAdd = () => {
  panelsStore.set(
    panelsStore.panels.concat({
      id: uuid(),
      width: 200,
      height: 200,
      rotate: 0,
      x: 0,
      y: 0
    })
  );
};
</script>

<template>
  <div ref="dashboardRef" id="dashboard">
    <div class="tools"><button @click="panelAdd">添加一个图形</button></div>
    <Canvas />
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
</style>
