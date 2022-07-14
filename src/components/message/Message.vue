<template>
  <ul class="message-list">
    <li
      :class="`message-item ${setClass(item.type)}`"
      v-for="(item, index) in messageList"
      :key="index"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<script lang="ts" setup="props">
import { useMessageStore } from '../../stores/message';
import { toRefs } from 'vue';

const messageStore = useMessageStore();
const { messageList } = toRefs(messageStore);
const setClass = (type: string) => {
  if (type === 'info') {
    return 'message-info-item';
  } else if (type === 'wraning') {
    return 'message-wraning-item';
  } else if (type === 'success') {
    return 'message-success-item';
  } else if (type === 'error') {
    return 'message-error-item';
  }

  return '';
};
</script>

<style lang="scss" scoped>
.message-list {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 1000;
  list-style: none;

  .message-item {
    padding: 12px 24px;
    border: 1px solid #b3d0cf;
    margin-left: 8px;
    margin-bottom: 12px;
    background-color: #e6f3ff;
    font-size: 14px;
    color: #007bff;
    text-align: left;
    box-shadow: 0 1px 1px 0 hsla(0, 0%, 80.4%, 0.5);
    border-radius: 2px;
    cursor: default;
  }
  .message-info-item {
    border: 1px solid #b3d0cf;
    background-color: #e6f3ff;
    color: #007bff;
  }
  .message-error-item {
    border: 1px solid #e99;
    background-color: #f6e3e3;
    color: #e33;
  }
}
</style>
