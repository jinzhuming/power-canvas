<script setup lang="ts">
// 画布本身
import { computed, toRefs } from 'vue';
import { useCanvasOffsetStore, useCanvasZoomStore } from '../stores/dashboard';
import Panels from './Panels.vue';
import SelectedBox from './SelectedBox.vue';

const canvasOffsetStore = useCanvasOffsetStore();
const canvasZoomStore = useCanvasZoomStore();
const { x, y } = toRefs(canvasOffsetStore);
const canvasStyle = computed(() => {
  return {
    transform: `translate3d(${x.value}px, ${y.value}px, 0px) scale(${canvasZoomStore.zoom})`
  };
});
</script>

<template>
  <div id="canvas" :style="canvasStyle">
    <Panels />
    <SelectedBox />
  </div>
</template>

<style>
#canvas {
  transform-origin: 0px 0px;
  width: 1200px;
  height: 800px;
  background-color: gray;
}
</style>
