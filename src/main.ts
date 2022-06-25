import { createApp } from 'vue';
import App from './App.vue';
import { router } from './route';
import { store } from './stores';

createApp(App).use(router).use(store).mount('#app');
