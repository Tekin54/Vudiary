import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import EditView from '../views/EditView.vue';
import EditInpView from '../views/EditInpView.vue';
import ReadInpView from '../views/ReadInpView.vue';
import InputView from '../views/InputView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditView,
    },
    {
      path: '/edit/input/:id',
      props: true,
      name: 'edit input',
      component: EditInpView,
    },
    {
      path: '/read/:id',
      props: true,
      name: 'read input',
      component: ReadInpView,
    },
    {
      path: '/input/',
      name: 'input',
      component: InputView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
});

export default router;
