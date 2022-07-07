<script setup lang="ts">
// 这个是选中元素出现的拖拽框，这里的设计是单独渲染，选中之后移动到指定的位置上层，和 panel 本身分离开，不做 dom 上的关联
import { computed, Ref, toRefs } from 'vue';
import { useSelectedPanelsRange } from '../hooks/useSelectedPanelsRange';
import { IPanel, useSelectedPanelsStore } from '../stores/panels';

const selectedPanelsStore = useSelectedPanelsStore();

const { panels: selectedPanels }: { panels: Ref<IPanel[]> } =
  toRefs(selectedPanelsStore);

const boxStyle = computed(() => {
  // 因为可以框选多个 panel， 所以计算一下多个 panel 的边界
  const { minX, minY, maxX, maxY } = useSelectedPanelsRange();

  return {
    left: `${minX - 2}px`,
    top: `${minY - 2}px`,
    width: `${maxX - minX + 4}px`,
    height: `${maxY - minY + 4}px`
  };
});
</script>

<template>
  <div class="selected-box" :style="boxStyle" v-if="selectedPanels.length">
    <div class="selected-box-border selected-box-border-left" />
    <div class="selected-box-border selected-box-border-top" />
    <div class="selected-box-border selected-box-border-right" />
    <div class="selected-box-border selected-box-border-bottom" />
  </div>
</template>

<style>
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
}
.selected-box-border-left {
  width: 2px;
  left: 0;
  top: 0;
  bottom: 0;
}
.selected-box-border-top {
  height: 2px;
  left: 0;
  top: 0;
  right: 0;
}
.selected-box-border-right {
  width: 2px;
  right: 0;
  top: 0;
  bottom: 0;
}
.selected-box-border-bottom {
  height: 2px;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
