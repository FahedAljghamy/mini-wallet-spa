import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific functions
      },
    },
    // Enable source maps for debugging (optional)
    sourcemap: false, // Set to true if you need source maps
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Better chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vendor-vue'
            }
            if (id.includes('axios')) {
              return 'vendor-http'
            }
            if (id.includes('tailwindcss') || id.includes('@tailwindcss')) {
              return 'vendor-css'
            }
            return 'vendor-other'
          }

          // UI components
          if (id.includes('/src/components/ui/')) {
            return 'ui-components'
          }

          // Transaction components
          if (id.includes('/src/components/transactions/')) {
            return 'transaction-components'
          }

          // Beneficiary components
          if (id.includes('/src/components/beneficiaries/')) {
            return 'beneficiary-components'
          }

          // Views
          if (id.includes('/src/views/WalletDashboardRefactored.vue')) {
            return 'dashboard-view'
          }
          if (id.includes('/src/views/TransactionsViewRefactored.vue')) {
            return 'transactions-view'
          }
          if (id.includes('/src/views/BeneficiariesView.vue')) {
            return 'beneficiaries-view'
          }

          // Stores
          if (id.includes('/src/stores/transactions.ts')) {
            return 'transactions-store'
          }
          if (id.includes('/src/stores/beneficiaries.ts')) {
            return 'beneficiaries-store'
          }

          // Composables
          if (id.includes('/src/composables/')) {
            return 'composables'
          }

          // Default chunk for other files
          return 'app'
        },
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios'],
    exclude: [
      // Exclude heavy dependencies that are not needed initially
    ],
  },
  // Server configuration for development
  server: {
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
})
