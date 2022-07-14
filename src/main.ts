import { createApp } from 'vue';
import App from './App.vue';
import { router } from './route';
import { store } from './stores';
import MessageComponent from './components/message/Message.vue';
createApp(App).use(router).use(store).mount('#app');

// 创建
const messageApp = createApp(MessageComponent);
messageApp.mount('#message');
