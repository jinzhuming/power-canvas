<script setup lang="ts">
// 这个是选中元素出现的拖拽框，这里的设计是单独渲染，选中之后移动到指定的位置上层，和 panel 本身分离开，不做 dom 上的关联
import { computed, onMounted, ref, Ref, toRefs } from 'vue';
import { useSelectedPanelsRange } from '../hooks/useSelectedPanelsRange';
import { IPanel, useSelectedPanelsStore } from '../stores/panels';
import { useCanvasZoomStore } from '../stores/dashboard';
import { useZoomPanels } from '../hooks/useZoomPanels';
const rangeBoxRef = ref<HTMLDivElement | null>(null);
const selectedPanelsStore = useSelectedPanelsStore();

const { panels: selectedPanels }: { panels: Ref<IPanel[]> } =
  toRefs(selectedPanelsStore);
const canvasZoomStore = useCanvasZoomStore();
const { zoom } = toRefs(canvasZoomStore);

// 这里为了保证放大缩小，选择的线都尽可能保持一致，所以根据缩放计算一下显示的宽度
const lineWidth = computed(
  () => `${2 / zoom.value < 2 ? 2 : 2 / zoom.value}px`
);
const resizeWidth = computed(
  () => `${6 / zoom.value < 6 ? 6 : 6 / zoom.value}px`
);
const boxStyle = computed(() => {
  // 因为可以框选多个 panel， 所以计算一下多个 panel 的边界
  const box = useSelectedPanelsRange();

  return {
    left: `${box.value.minX - 2}px`,
    top: `${box.value.minY - 2}px`,
    width: `${box.value.maxX - box.value.minX + 4}px`,
    height: `${box.value.maxY - box.value.minY + 4}px`
  };
});

onMounted(() => {
  const rangeBoxDom = rangeBoxRef.value;
  if (!rangeBoxDom) {
    console.error('range dom 未找到');
    return;
  }
  useZoomPanels(rangeBoxDom);
});
</script>

<template>
  <div
    ref="rangeBoxRef"
    class="selected-box"
    :style="boxStyle"
    v-show="selectedPanels.length"
  >
    <div class="selected-box-border" data-rangeBoxType="resize-w" />
    <div class="selected-box-border" data-rangeBoxType="resize-n" />
    <div class="selected-box-border" data-rangeBoxType="resize-e" />
    <div class="selected-box-border" data-rangeBoxType="resize-s" />
    <div class="resize" data-rangeBoxType="resize-nw" />
    <div class="resize" data-rangeBoxType="resize-ne" />
    <div class="resize" data-rangeBoxType="resize-sw" />
    <div class="resize" data-rangeBoxType="resize-se" />
  </div>
</template>

<style lang="scss">
.selected-box {
  position: absolute;
  z-index: 9999;
  background-color: transparent;
  pointer-events: none;
  /* 这里利用pointer-events none 做一个点击穿透的效果，防止覆盖在别的元素的时候无法触发元素上的事件 */
}
.selected-box-border {
  position: absolute;
  background-color: black;
  pointer-events: initial;
}
.selected-box-border[data-rangeboxtype='resize-w'] {
  width: v-bind(lineWidth);
  left: 0;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}
.selected-box-border[data-rangeboxtype='resize-n'] {
  height: v-bind(lineWidth);
  left: 0;
  top: 0;
  right: 0;
  cursor: ns-resize;
}
.selected-box-border[data-rangeboxtype='resize-e'] {
  width: v-bind(lineWidth);
  right: 0;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
}
.selected-box-border[data-rangeboxtype='resize-s'] {
  height: v-bind(lineWidth);
  right: 0;
  left: 0;
  bottom: 0;
  cursor: ns-resize;
}

.resize {
  position: absolute;
  width: v-bind(resizeWidth);
  height: v-bind(resizeWidth);
  border: v-bind(lineWidth) solid cadetblue;
  pointer-events: initial;
  background-color: #fff;
  &[data-rangeboxtype='resize-nw'] {
    left: 0;
    top: 0;
    transform: translate3d(-40%, -40%, 0);
    cursor: nw-resize;
  }
  &[data-rangeboxtype='resize-ne'] {
    right: 0;
    top: 0;
    transform: translate3d(40%, -40%, 0);
    cursor: ne-resize;
  }
  &[data-rangeboxtype='resize-sw'] {
    left: 0;
    bottom: 0;
    transform: translate3d(-40%, 40%, 0);
    cursor: sw-resize;
  }
  &[data-rangeboxtype='resize-se'] {
    right: 0;
    bottom: 0;
    transform: translate3d(40%, 40%, 0);
    cursor: se-resize;
  }
}
</style>
