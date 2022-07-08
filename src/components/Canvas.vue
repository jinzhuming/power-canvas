<script setup lang="ts">
// 画布本身
import { computed, toRefs } from 'vue';
import {
  useCanvasID,
  useCanvasOffsetStore,
  useCanvasZoomStore
} from '../stores/dashboard';
import Panels from './Panels.vue';
import SelectedBox from './SelectedBox.vue';

const canvasID = useCanvasID();
const canvasOffsetStore = useCanvasOffsetStore();
const canvasZoomStore = useCanvasZoomStore();
const { zoom } = toRefs(canvasZoomStore);
const { x, y } = toRefs(canvasOffsetStore);
const canvasStyle = computed(() => {
  return {
    transform: `translate3d(${x.value}px, ${y.value}px, 0px) scale(${zoom.value})`
  };
});
</script>

<template>
  <div :id="canvasID" :style="canvasStyle">
    <SelectedBox />
    <Panels />
  </div>
</template>

<style>
#canvas {
  transform-origin: 0 0;
  width: 1200px;
  height: 800px;
  background-color: gray;
}
</style>
