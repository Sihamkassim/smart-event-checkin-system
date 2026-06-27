import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false, layout: 'auth' },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/DashboardPage.vue'),
    meta: { requiresAuth: true, layout: 'main' },
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../pages/events/EventsPage.vue'),
    meta: { requiresAuth: true, layout: 'main' },
  },
  {
    path: '/events/:id',
    name: 'EventDetails',
    component: () => import('../pages/events/EventDetailsPage.vue'),
    meta: { requiresAuth: true, layout: 'main' },
  },
  {
    path: '/checkin',
    name: 'CheckIn',
    component: () => import('../pages/checkin/CheckInPage.vue'),
    meta: { requiresAuth: true, layout: 'main' },
  },
  {
    path: '/public',
    name: 'PublicHome',
    component: () => import('../pages/public/PublicHomePage.vue'),
    meta: { requiresAuth: false, layout: 'public' },
  },
  {
    path: '/public/register/:eventId',
    name: 'PublicRegistration',
    component: () => import('../pages/public/PublicEventRegistrationPage.vue'),
    meta: { requiresAuth: false, layout: 'public' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from) => {
  const token = localStorage.getItem('auth_token');
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !token) {
    return '/login';
  } else if (to.path === '/login' && token) {
    return '/';
  }
  
  return true;
});

export default router;
