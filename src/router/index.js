import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    children: [
      {
        path: '/admin/dashboard',
        component: () => import('../views/admin/Dashboard.vue'),
      },
      {
        path: '/admin/settings',
        component: () => import('../views/admin/Settings.vue'),
      },
      {
        path: '/admin/tables',
        component: () => import('../views/admin/Tables.vue'),
      },
      {
        path: '/admin/maps',
        component: () => import('../views/admin/Maps.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
