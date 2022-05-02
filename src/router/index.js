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
        path: '/admin/administrador',
        component: () => import('../views/admin/AdminTexts.vue'),
        meta: {
          requiresAuth: true,
        },
      },
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
        path: '/admin/perfil-websites',
        component: () => import('../views/admin/ProfileWebsites.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/experimento',
        component: () => import('../views/admin/Experiment.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/atencion',
        component: () => import('../views/admin/Atention.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/exploracion',
        component: () => import('../views/admin/Exploration.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/emocion',
        component: () => import('../views/admin/Emotion.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/motivacion',
        component: () => import('../views/admin/Motivation.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/aprendizaje',
        component: () => import('../views/admin/Learning.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/maps',
        component: () => import('../views/admin/Maps.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/tables',
        component: () => import('../views/admin/Tables.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

function isAuthenticated() {
  const decodeLocalStorage = !!localStorage.getItem('etrackUser');
  const decodeSessionStorage = !!sessionStorage.getItem('etrackUser');
  return !!(decodeLocalStorage === true || decodeSessionStorage === true);
}

function isAdmin() {
  const codedLocalStorage = localStorage.getItem('etrackUser');
  const codedSessionStorage = sessionStorage.getItem('etrackUser');
  const decoded = codedLocalStorage && !codedSessionStorage
    ? JSON.parse(window.atob(codedLocalStorage))
    : JSON.parse(window.atob(codedSessionStorage));
  return decoded.role === 'admin';
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated() || !isAdmin()) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
