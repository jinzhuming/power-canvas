<script setup lang="ts">
// 这里主要是存放在画布中的各个元素，比如地图、可视化图表、图片、视频等等
import { IPanel, usePanelsStore } from '../stores/panels';
import { Ref, toRefs } from 'vue';
import Panel from './Panel.vue';

const panelsStore = usePanelsStore();

// webstorm 对 vue3 template 的支持太烂了，不手动声明，模板内无法识别出来准确的类型
const { panels }: { panels: Ref<IPanel[]> } = toRefs(panelsStore);
</script>

<template>
  <div class="panels">
    <Panel
      class="panel"
      v-for="panel in panels"
      :key="panel.id"
      :panel="panel"
    ></Panel>
  </div>
</template>

<style>
#panel {
  transform-origin: 0 0;
  width: 1200px;
  height: 800px;
  background-color: gray;
}
</style>
