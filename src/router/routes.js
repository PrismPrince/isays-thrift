const routes = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/dashboard',
    meta: { requiresAuth: true },
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('pages/DashboardPage.vue') }],
  },

  {
    path: '/sales',
    meta: { requiresAuth: true },
    component: () => import('layouts/SalesLayout.vue'),
    children: [{ path: '', component: () => import('pages/SalesPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
