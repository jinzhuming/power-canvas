import piniaPluginPersist from 'pinia-plugin-persist';
import { createPinia } from 'pinia';
export const store = createPinia();

store.use(piniaPluginPersist);
