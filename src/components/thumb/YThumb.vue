<script setup lang="ts">
import { useCanvasOffsetStore } from '../../stores/dashboard';
import { computed, onMounted, ref, toRefs, watchEffect } from 'vue';
import { CANVAS_OFFSET_HEIGHT } from '../../hooks/useMoveCanvas';
import { useDragYThumb } from '../../hooks/useDragYThumb';

const YThumbHeight = 20;
const canvasOffsetStore = useCanvasOffsetStore();
const { y } = toRefs(canvasOffsetStore);
const yThumbTransformY = ref(0);
const ratio = ref(0);
const active = ref(false);
const yThumbBarRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const dom = yThumbBarRef.value;
  if (!dom) return;

  watchEffect(() => {
    // 获取画布绝对的尺寸宽度
    const canvasMaxHeight = CANVAS_OFFSET_HEIGHT * 2;
    ratio.value = canvasMaxHeight / (dom.offsetHeight - YThumbHeight);

    yThumbTransformY.value = ratio.value ? -y.value / ratio.value : 0;
  });

  useDragYThumb(dom, ratio, yThumbTransformY, active);
});

const style = computed(() => {
  return {
    transform: `matrix(1, 0, 0, 1, 0, ${yThumbTransformY.value.toFixed()})`
  };
});
</script>

<template>
  <div ref="yThumbBarRef" id="y_thumb_bar">
    <div id="y_thumb" :style="style" />
  </div>
</template>

<style lang="scss">
#y_thumb_bar {
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  width: 18px;
}
#y_thumb {
  /*transform: matrix(1, 0, 0, 1, 0, ${transformY});*/
  background-color: rgb(219, 219, 219);
  height: 20px;
  width: 6px;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  right: 4px;
  top: calc(50% - 10px);
  transition: background 0.2s ease;
  &.active,
  &:hover {
    background-color: rgb(199, 199, 199);
    width: 8px;
    right: 3px;
  }
}
</style>
