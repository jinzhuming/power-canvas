<script setup lang="ts">
import { useMultipleSelectBox } from '../hooks/useMultipleSelectBox';
import { computed } from 'vue';

const box = useMultipleSelectBox();
const style = computed(() => ({
  display: box.visibility ? 'block' : 'none',
  left: `${box.x}px`,
  top: `${box.y}px`,
  width: `${box.x1 - box.x}px`,
  height: `${box.y1 - box.y}px`
}));
</script>

<template>
  <div id="multiple_select_panels" :style="style"></div>
</template>

<style lang="scss">
#multiple_select_panels {
  z-index: 3;
  position: absolute;
  background-color: rgba(165, 165, 222, 0.3);
  border: 1px solid cadetblue;
}
</style>
