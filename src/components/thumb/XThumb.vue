<script setup lang="ts">
import { useCanvasOffsetStore } from '../../stores/dashboard';
import { computed, onMounted, ref, toRefs, watchEffect } from 'vue';
import { CANVAS_OFFSET_WIDTH } from '../../hooks/useMoveCanvas';
import { useDragXThumb } from '../../hooks/useDragXThumb';

const XThumbWidth = 20;
const canvasOffsetStore = useCanvasOffsetStore();
const { x } = toRefs(canvasOffsetStore);
const thumbTransformX = ref(0);
const ratio = ref(0);
const active = ref(false);
const xThumbBarRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const dom = xThumbBarRef.value;
  if (!dom) return;

  watchEffect(() => {
    // 获取画布绝对的尺寸宽度
    const canvasMaxWidth = CANVAS_OFFSET_WIDTH * 2;
    ratio.value = canvasMaxWidth / (dom.offsetWidth - XThumbWidth);

    thumbTransformX.value = ratio.value ? -x.value / ratio.value : 0;
  });

  useDragXThumb(dom, ratio, thumbTransformX, active);
});

const style = computed(() => {
  return {
    transform: `matrix(1, 0, 0, 1, ${thumbTransformX.value.toFixed()}, 0)`
  };
});
</script>

<template>
  <div id="x_thumb_bar" ref="xThumbBarRef">
    <div :class="active ? 'active' : ''" id="x_thumb" :style="style" />
  </div>
</template>

<style lang="scss">
#x_thumb_bar {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 18px;
}
#x_thumb {
  background-color: rgb(219, 219, 219);
  width: 20px;
  height: 6px;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  left: calc(50% - 10px);
  transition: background 0.2s ease;
  bottom: 4px;
  &.active,
  &:hover {
    background-color: rgb(199, 199, 199);
    height: 8px;
    bottom: 3px;
  }
}
</style>
