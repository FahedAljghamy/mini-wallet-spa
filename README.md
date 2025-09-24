# 💳 Mini Wallet SPA

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A modern, secure, and scalable digital wallet application built with Vue 3**

[🚀 Live Demo](https://your-demo-url.com) | [📖 Documentation](https://your-docs-url.com) | [🐛 Report Bug](https://github.com/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [💼 Business Logic](#-business-logic)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔧 Configuration](#-configuration)
- [🚀 Deployment](#-deployment)
- [📊 Performance](#-performance)
- [🔒 Security](#-security)
- [🧪 Testing](#-testing)
- [📈 Monitoring](#-monitoring)
- [🤝 Contributing](#-contributing)

---

## 🎯 Overview

**Mini Wallet SPA** is a sophisticated digital wallet application designed for secure money transfers and transaction management. Built with modern web technologies, it provides a seamless user experience with real-time updates, comprehensive transaction tracking, and advanced security features.

### 🎯 Key Objectives

- **Secure Transactions**: End-to-end encrypted money transfers
- **Real-time Updates**: Instant transaction notifications and balance updates
- **User-Friendly Interface**: Intuitive design for all user types
- **Scalable Architecture**: Built to handle growing user base and transaction volume
- **Performance Optimized**: Fast loading and smooth interactions

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT-based Authentication** with automatic token refresh
- **Role-based Access Control** (User, Admin)
- **Secure API Communication** with HTTPS and CORS protection
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse

### 💰 Core Wallet Features

- **Multi-Currency Support** (AED, USD, EUR, GBP)
- **Real-time Balance Tracking** with instant updates
- **Transaction History** with advanced filtering and search
- **Beneficiary Management** with favorites and quick send
- **Commission Calculation** (1.5% automatic fee)
- **Transaction Status Tracking** (Pending, Completed, Failed, Cancelled)

### 📱 User Experience

- **Responsive Design** for desktop, tablet, and mobile
- **Dark/Light Mode** support
- **Progressive Web App** (PWA) capabilities
- **Offline Support** with service worker caching
- **Accessibility** (WCAG 2.1 AA compliant)

### 🔄 Real-time Features

- **Live Transaction Updates** via WebSocket (Pusher)
- **Instant Balance Refresh** after transactions
- **Real-time Notifications** for incoming/outgoing transfers
- **Live Beneficiary Updates** when contacts are added/modified

### 📊 Advanced Features

- **Transaction Analytics** with detailed insights
- **Export Functionality** (PDF, CSV reports)
- **Advanced Search** with multiple filters
- **Bulk Operations** for multiple beneficiaries
- **Transaction Scheduling** (coming soon)

---

## 🏗️ Architecture

### System Architecture

```
Frontend SPA → API Gateway → Authentication Service
                    ↓
              Transaction Service → Database
                    ↓
              User Service → Database
                    ↓
              Notification Service → Pusher/WebSocket
```

### Frontend Architecture

```
App.vue → Router → Views (Dashboard, Transactions, Beneficiaries)
    ↓
Pinia Store → Composables → Utils
    ↓
Components → UI Components → Base Components
```

---

## 💼 Business Logic

### Transaction Flow

1. **User initiates transaction** through the form
2. **Frontend validates input** and sends to API
3. **API validates data** and checks balance
4. **Transaction created** with "Pending" status
5. **Balance updated** and transaction marked "Completed"
6. **Real-time notification** sent via WebSocket
7. **Frontend updates** automatically with new data

### Business Rules

#### 💸 Transaction Rules

- **Minimum Amount**: $1.00 equivalent
- **Maximum Amount**: $10,000 per transaction
- **Daily Limit**: $50,000 per user
- **Commission Fee**: 1.5% of transaction amount
- **Processing Time**: Instant for verified accounts

#### 🔐 Security Rules

- **Session Timeout**: 30 minutes of inactivity
- **Failed Login Attempts**: 5 attempts before lockout
- **Password Requirements**: 8+ characters, mixed case, numbers
- **2FA**: Optional for enhanced security

#### 👥 User Management

- **Account Verification**: Email verification required
- **Profile Completion**: Name, email, phone required
- **Beneficiary Limits**: Maximum 50 saved beneficiaries
- **Transaction History**: 2 years retention period

### API Endpoints

#### 🔑 Authentication

```
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
POST   /api/auth/refresh        # Refresh token
GET    /api/auth/user           # Get user profile
PUT    /api/auth/profile        # Update profile
```

#### 💰 Transactions

```
GET    /api/transactions        # Get transaction history
POST   /api/transactions        # Create new transaction
GET    /api/transactions/{id}   # Get transaction details
PUT    /api/transactions/{id}   # Update transaction status
DELETE /api/transactions/{id}   # Cancel transaction
```

#### 👥 Beneficiaries

```
GET    /api/beneficiaries       # Get beneficiary list
POST   /api/beneficiaries       # Add new beneficiary
PUT    /api/beneficiaries/{id}  # Update beneficiary
DELETE /api/beneficiaries/{id}  # Remove beneficiary
POST   /api/beneficiaries/{id}/favorite # Toggle favorite
```

---

## 🛠️ Technology Stack

### Frontend Stack

- **Framework**: Vue 3.5+ with Composition API
- **Language**: TypeScript 5.0+
- **Build Tool**: Vite 5.0+
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Styling**: TailwindCSS 4.0+
- **HTTP Client**: Axios
- **Real-time**: Pusher-js
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier

### Development Tools

- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier, Husky
- **Performance**: Lighthouse, Bundle Analyzer
- **Monitoring**: Sentry (optional)

### Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+
- **Mobile**: iOS 14+, Android 8+

---

## 📁 Project Structure

```
src/
├── 📁 components/              # Reusable UI components
│   ├── 📁 layout/             # Layout components
│   │   ├── AppHeader.vue      # Application header
│   │   ├── AppFooter.vue      # Application footer
│   │   └── AppSidebar.vue     # Navigation sidebar
│   ├── 📁 ui/                 # Base UI components
│   │   ├── BaseButton.vue     # Button component
│   │   ├── BaseInput.vue      # Input component
│   │   ├── BaseCard.vue       # Card component
│   │   ├── BaseIcon.vue       # Icon component
│   │   └── BaseModal.vue      # Modal component
│   ├── 📁 transactions/       # Transaction components
│   │   ├── TransactionForm.vue
│   │   ├── TransactionList.vue
│   │   ├── TransactionCard.vue
│   │   └── TransactionDetailsModal.vue
│   ├── 📁 beneficiaries/      # Beneficiary components
│   │   ├── BeneficiaryList.vue
│   │   ├── BeneficiaryCard.vue
│   │   └── BeneficiaryForm.vue
│   └── 📁 wallet/             # Wallet components
│       ├── BalanceCard.vue    # Balance display
│       └── CurrencySelector.vue
├── 📁 views/                  # Page components
│   ├── DashboardView.vue      # Main dashboard
│   ├── TransactionsView.vue   # Transactions page
│   ├── BeneficiariesView.vue  # Beneficiaries page
│   ├── LoginView.vue          # Login page
│   └── ProfileView.vue        # User profile
├── 📁 stores/                 # Pinia stores
│   ├── transactions.ts        # Transaction state
│   ├── beneficiaries.ts       # Beneficiary state
│   ├── auth.ts               # Authentication state
│   └── app.ts                # App-wide state
├── 📁 composables/            # Vue composables
│   ├── useAuth.ts            # Authentication logic
│   ├── useCurrency.ts        # Currency conversion
│   ├── useNotifications.ts   # Notification system
│   ├── usePerformance.ts     # Performance monitoring
│   └── useApiOptimization.ts # API optimization
├── 📁 router/                 # Vue Router
│   └── index.ts              # Route configuration
├── 📁 types/                  # TypeScript definitions
│   ├── auth.ts               # Auth types
│   ├── transaction.ts        # Transaction types
│   └── beneficiary.ts        # Beneficiary types
├── 📁 utils/                  # Utility functions
│   ├── formatters.ts         # Data formatters
│   ├── validators.ts         # Input validators
│   └── constants.ts          # App constants
├── 📁 assets/                 # Static assets
│   ├── styles/               # Global styles
│   │   ├── main.css          # Main stylesheet
│   │   ├── components.css    # Component styles
│   │   └── utilities.css     # Utility classes
│   └── images/               # Images and icons
├── 📁 constants/              # Application constants
│   ├── api.ts                # API endpoints
│   ├── routes.ts             # Route definitions
│   └── config.ts             # App configuration
└── main.ts                   # Application entry point
```

---

## ⚙️ Installation & Setup

### Prerequisites

- **Node.js**: 18.0+ (LTS recommended)
- **npm**: 9.0+ or **yarn**: 1.22+
- **Git**: 2.30+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/mini-wallet-spa.git
cd mini-wallet-spa

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure environment variables
npm run setup:env

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
VITE_APP_NAME="Mini Wallet"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENV="development"

# API Configuration
VITE_API_BASE_URL="http://localhost:8000"
VITE_API_TIMEOUT="30000"
VITE_API_RETRY_ATTEMPTS="3"

# Authentication
VITE_JWT_STORAGE_KEY="auth_token"
VITE_REFRESH_TOKEN_KEY="refresh_token"
VITE_SESSION_TIMEOUT="1800000"

# Real-time Features
VITE_PUSHER_APP_KEY="your_pusher_app_key"
VITE_PUSHER_APP_CLUSTER="your_pusher_cluster"
VITE_PUSHER_APP_SECRET="your_pusher_secret"
VITE_PUSHER_APP_HOST="your_pusher_host"
VITE_PUSHER_APP_PORT="443"
VITE_PUSHER_APP_ENCRYPTED="true"

# Currency & Localization
VITE_DEFAULT_CURRENCY="AED"
VITE_SUPPORTED_CURRENCIES="AED,USD,EUR,GBP"
VITE_LOCALE="en-US"
VITE_TIMEZONE="Asia/Dubai"

# Performance & Monitoring
VITE_ENABLE_ANALYTICS="true"
VITE_ENABLE_PERFORMANCE_MONITORING="true"
VITE_SENTRY_DSN="your_sentry_dsn"

# Feature Flags
VITE_ENABLE_PWA="true"
VITE_ENABLE_OFFLINE_MODE="true"
VITE_ENABLE_DARK_MODE="true"
VITE_ENABLE_2FA="false"

# Development
VITE_DEBUG_MODE="true"
VITE_MOCK_API="false"
VITE_SHOW_DEV_TOOLS="true"
```

---

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run analyze

# Run performance audit
npm run audit
```

### Deployment Strategies

#### 1. Static Hosting (Recommended)

**Vercel Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configure environment variables in Vercel dashboard
```

**Netlify Deployment:**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Configure redirects for SPA routing
```

#### 2. CDN + Static Hosting

```yaml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 3. Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment-Specific Configuration

#### Production Environment

```env
# Production .env
VITE_APP_ENV="production"
VITE_API_BASE_URL="https://api.yourdomain.com"
VITE_PUSHER_APP_KEY="prod_pusher_key"
VITE_ENABLE_ANALYTICS="true"
VITE_DEBUG_MODE="false"
```

#### Staging Environment

```env
# Staging .env
VITE_APP_ENV="staging"
VITE_API_BASE_URL="https://staging-api.yourdomain.com"
VITE_PUSHER_APP_KEY="staging_pusher_key"
VITE_ENABLE_ANALYTICS="false"
VITE_DEBUG_MODE="true"
```

### CI/CD Pipeline

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_PUSHER_APP_KEY: ${{ secrets.PUSHER_APP_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Performance

### Performance Metrics

#### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s

#### Bundle Size Targets

- **Initial Bundle**: < 250KB gzipped
- **Vendor Chunks**: < 150KB gzipped
- **Route Chunks**: < 100KB gzipped
- **Total Assets**: < 1MB

### Optimization Strategies

#### 1. Code Splitting

```typescript
// Lazy load routes
const TransactionsView = defineAsyncComponent(() => import('../views/TransactionsView.vue'))

// Lazy load components
const TransactionModal = defineAsyncComponent({
  loader: () => import('../components/TransactionModal.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200,
  timeout: 3000,
})
```

#### 2. Caching Strategy

```typescript
// Service Worker caching
const CACHE_NAME = 'wallet-app-v1'
const urlsToCache = ['/', '/static/js/bundle.js', '/static/css/main.css', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})
```

---

## 🔒 Security

### Security Measures

#### 1. Authentication Security

```typescript
// JWT token management
const tokenManager = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token)
  },

  getToken: () => {
    return localStorage.getItem('auth_token')
  },

  removeToken: () => {
    localStorage.removeItem('auth_token')
  },

  isTokenValid: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },
}
```

#### 2. Input Validation

```typescript
// Form validation
const validateTransaction = (data: TransactionData) => {
  const errors: string[] = []

  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0')
  }

  if (data.amount > 10000) {
    errors.push('Amount cannot exceed $10,000')
  }

  if (!data.receiverEmail || !isValidEmail(data.receiverEmail)) {
    errors.push('Valid receiver email is required')
  }

  return errors
}
```

---

## 🧪 Testing

### Testing Strategy

#### 1. Unit Tests (Vitest)

```typescript
// tests/transactions.test.ts
import { describe, it, expect } from 'vitest'
import { useTransactionsStore } from '@/stores/transactions'

describe('Transaction Store', () => {
  it('should calculate commission correctly', () => {
    const store = useTransactionsStore()
    const amount = 100

    const commission = store.calculateCommission(amount)
    expect(commission).toBe(1.5)
  })
})
```

#### 2. Component Tests (Vue Test Utils)

```typescript
// tests/components/TransactionForm.test.ts
import { mount } from '@vue/test-utils'
import TransactionForm from '@/components/TransactionForm.vue'

describe('TransactionForm', () => {
  it('should render form fields', () => {
    const wrapper = mount(TransactionForm)

    expect(wrapper.find('[data-testid="amount-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="receiver-email"]').exists()).toBe(true)
  })
})
```

#### 3. E2E Tests (Playwright)

```typescript
// tests/e2e/transactions.spec.ts
import { test, expect } from '@playwright/test'

test('user can send money', async ({ page }) => {
  await page.goto('/login')

  // Login
  await page.fill('[data-testid="email"]', 'user@example.com')
  await page.fill('[data-testid="password"]', 'password123')
  await page.click('[data-testid="login-button"]')

  // Send money
  await page.fill('[data-testid="receiver-email"]', 'recipient@example.com')
  await page.fill('[data-testid="amount"]', '100')
  await page.click('[data-testid="send-button"]')

  // Verify success
  await expect(page.locator('.success-message')).toBeVisible()
})
```

### Test Commands

```bash
# Run unit tests
npm run test:unit

# Run component tests
npm run test:component

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test

# Test coverage
npm run test:coverage
```

---

## 📈 Monitoring

### Analytics Integration

```typescript
// utils/analytics.ts
export const analytics = {
  trackEvent: (eventName: string, properties: Record<string, any>) => {
    if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      // Google Analytics 4
      gtag('event', eventName, properties)

      // Custom analytics
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, properties }),
      })
    }
  },

  trackTransaction: (amount: number, currency: string) => {
    analytics.trackEvent('transaction_completed', {
      amount,
      currency,
      timestamp: Date.now(),
    })
  },
}
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TypeScript types
4. **Write tests** for new functionality
5. **Run the test suite**: `npm run test`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Standards

#### TypeScript Guidelines

```typescript
// Use interfaces for object shapes
interface Transaction {
  id: number
  amount: number
  status: TransactionStatus
  createdAt: Date
}

// Use type aliases for unions
type TransactionStatus = 'pending' | 'completed' | 'failed'

// Use enums for constants
enum Currency {
  AED = 'AED',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}
```

---

## 📞 Support & Contact

### Getting Help

- **📖 Documentation**: [docs.yourdomain.com](https://docs.yourdomain.com)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/your-repo/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **📧 Email**: support@yourdomain.com

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary

- ✅ **Commercial use** allowed
- ✅ **Modification** allowed
- ✅ **Distribution** allowed
- ✅ **Private use** allowed
- ❌ **Liability** not provided
- ❌ **Warranty** not provided

---

<div align="center">

**Built with ❤️ by [Eng.Fahed](https://github.com/your-username)**

[⬆ Back to Top](#-mini-wallet-spa)

</div>
