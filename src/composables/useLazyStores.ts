/**
 * Lazy Loading Composables
 *
 * Lazy loading for stores and composables to improve performance
 *
 * @author Fahed
 */

import { defineAsyncComponent } from 'vue'

// Lazy loading for stores
export const useLazyTransactionsStore = () => {
  return import('../stores/transactions').then((module) => module.useTransactionsStore())
}

export const useLazyBeneficiariesStore = () => {
  return import('../stores/beneficiaries').then((module) => module.useBeneficiariesStore())
}

// Lazy loading for composables
export const useLazyCurrency = () => {
  return import('./useCurrency').then((module) => module.useCurrency())
}

export const useLazyNotifications = () => {
  return import('./useNotifications').then((module) => module.useNotifications())
}

// Lazy loading for components
export const LazyBaseInput = defineAsyncComponent({
  loader: () => import('../components/ui/BaseInput.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-12 rounded-xl"></div>',
  },
  delay: 100,
  timeout: 3000,
})

export const LazyBaseButton = defineAsyncComponent({
  loader: () => import('../components/ui/BaseButton.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-10 rounded-xl"></div>',
  },
  delay: 100,
  timeout: 3000,
})

export const LazyBaseIcon = defineAsyncComponent({
  loader: () => import('../components/ui/BaseIcon.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 w-6 h-6 rounded"></div>',
  },
  delay: 50,
  timeout: 3000,
})

export const LazyBaseCard = defineAsyncComponent({
  loader: () => import('../components/ui/BaseCard.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-32 rounded-xl"></div>',
  },
  delay: 100,
  timeout: 3000,
})

// Lazy loading for beneficiary components
export const LazyBeneficiaryCard = defineAsyncComponent({
  loader: () => import('../components/beneficiaries/BeneficiaryCard.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-24 rounded-xl"></div>',
  },
  delay: 200,
  timeout: 5000,
})

export const LazyBeneficiaryForm = defineAsyncComponent({
  loader: () => import('../components/beneficiaries/BeneficiaryForm.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-64 rounded-xl"></div>',
  },
  delay: 300,
  timeout: 5000,
})

export const LazyBeneficiaryList = defineAsyncComponent({
  loader: () => import('../components/beneficiaries/BeneficiaryList.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-48 rounded-xl"></div>',
  },
  delay: 200,
  timeout: 5000,
})

// Lazy loading for transaction components
export const LazyTransactionCard = defineAsyncComponent({
  loader: () => import('../components/transactions/TransactionCard.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-20 rounded-xl"></div>',
  },
  delay: 100,
  timeout: 3000,
})

export const LazyTransactionForm = defineAsyncComponent({
  loader: () => import('../components/transactions/TransactionFormRefactored.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-96 rounded-xl"></div>',
  },
  delay: 300,
  timeout: 5000,
})

export const LazyTransactionList = defineAsyncComponent({
  loader: () => import('../components/transactions/TransactionListRefactored.vue'),
  loadingComponent: {
    template: '<div class="animate-pulse bg-gray-200 h-64 rounded-xl"></div>',
  },
  delay: 200,
  timeout: 5000,
})
