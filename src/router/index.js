import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    name: 'All',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/register-website',
    name: 'Register Website',
    component: () => import('../views/RegisterWebsite.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/admin/dashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/settings',
        component: () => import('../views/admin/Settings.vue'),
      },
      {
        path: '/admin/analytics',
        component: () => import('../views/admin/Analytics.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/perfil',
        component: () => import('../views/admin/Settings.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/analisis-psicologico',
        component: () => import('../views/admin/Psychological.vue'),
      },
      {
        path: '/admin/maps',
        component: () => import('../views/admin/Maps.vue'),
      },
      {
        path: '/admin/tables',
        component: () => import('../views/admin/Tables.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

function isAuthenticated() {
  const decodeLocalStorage = !!localStorage.getItem('etrackUser');
  const decodeSessionStorage = !!sessionStorage.getItem('etrackUser');
  return !!(decodeLocalStorage === true || decodeSessionStorage === true);
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
