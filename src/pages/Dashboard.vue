<script setup lang="ts">
import Canvas from '../components/Canvas.vue';
import { useMoveCanvas } from '../hooks/useMoveCanvas';
import { onMounted, ref } from 'vue';
import { useZoomCanvas } from '../hooks/useZoomCanvas';
const dashboardRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  useMoveCanvas(dashboardRef);
  useZoomCanvas(dashboardRef);
});
</script>

<template>
  <div ref="dashboardRef" id="dashboard">
    <Canvas />
  </div>
</template>

<style>
#dashboard {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
