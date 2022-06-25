import { createRouter, createWebHistory } from 'vue-router';
const Dashboard = () => import('/src/pages/Dashboard.vue');

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
});
