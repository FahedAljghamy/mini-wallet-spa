/**
 * Router Configuration
 *
 * Vue Router setup for Mini Wallet SPA
 *
 * @author Fahed
 */

import { createRouter, createWebHistory } from 'vue-router'
import { AUTH_ROUTES, ROUTES } from '../constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTES.HOME,
      name: 'home',
      component: () => import('../views/WalletDashboardRefactored.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: ROUTES.DASHBOARD,
      name: 'wallet-dashboard',
      component: () =>
        import(/* webpackChunkName: "dashboard" */ '../views/WalletDashboardRefactored.vue'),
      meta: {
        title: 'Wallet Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: ROUTES.TRANSACTIONS,
      name: 'transactions',
      component: () =>
        import(/* webpackChunkName: "transactions" */ '../views/TransactionsViewRefactored.vue'),
      meta: {
        title: 'Transactions',
        requiresAuth: true,
      },
    },
    {
      path: ROUTES.BENEFICIARIES,
      name: 'beneficiaries',
      component: () =>
        import(/* webpackChunkName: "beneficiaries" */ '../views/BeneficiariesView.vue'),
      meta: {
        title: 'Beneficiaries',
        requiresAuth: true,
      },
    },
    {
      path: ROUTES.LOGIN,
      name: 'wallet-login',
      component: () => import('../views/WalletLogin.vue'),
      meta: {
        title: 'Login',
        requiresAuth: false,
      },
    },
    {
      path: ROUTES.ABOUT,
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About',
        requiresAuth: false,
      },
    },
  ],
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Mini Wallet`
  }

  // Check authentication for protected routes
  const token = localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !token) {
    // Redirect to login if not authenticated
    next(ROUTES.LOGIN)
  } else if (!to.meta.requiresAuth && token && AUTH_ROUTES.includes(to.path as any)) {
    // Redirect to dashboard if already authenticated and trying to access auth routes
    next(ROUTES.DASHBOARD)
  } else {
    next()
  }
})

export default router
