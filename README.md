# Mini Wallet SPA

A Vue 3 Single Page Application for managing digital wallet transactions with real-time updates.

## Author
**Eng.Fahed**

## Features

- **Vue 3** with Composition API and TypeScript
- **Pinia** for state management
- **TailwindCSS** for responsive styling
- **Axios** for API communication
- **Pusher** for real-time transaction notifications
- **Vue Router** for navigation
- **Form validation** and error handling
- **Responsive design** for mobile and desktop

## Technology Stack

- Vue 3.5+ with Vite
- TypeScript
- Pinia (State Management)
- Vue Router 4
- TailwindCSS 4
- Axios
- Pusher-js
- ESLint + Prettier

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── TransactionForm.vue
│   └── TransactionList.vue
├── views/              # Page components
│   ├── HomeView.vue
│   └── TransactionsView.vue
├── stores/             # Pinia stores
│   └── transactions.ts
├── router/             # Vue Router configuration
│   └── index.ts
├── assets/             # Static assets
│   └── main.css
└── main.ts            # Application entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_APP_CLUSTER=your_pusher_cluster
```

4. Start development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Laravel API base URL | `http://localhost:8000` |
| `VITE_PUSHER_APP_KEY` | Pusher app key | `your_pusher_app_key` |
| `VITE_PUSHER_APP_CLUSTER` | Pusher cluster | `your_pusher_cluster` |

## Components

### TransactionForm.vue
- Form for sending money to other users
- Validation for receiver email, amount, and commission fee
- Real-time total calculation
- Success/error message display

### TransactionList.vue
- Displays user's wallet balance
- Shows transaction history with pagination
- Real-time updates via Pusher
- Transaction status indicators

## State Management

### Transactions Store (Pinia)
- **State**: `balance`, `transactions[]`, `user`, `loading`, `error`
- **Actions**: 
  - `fetchTransactions()` - Get user transactions
  - `sendTransaction()` - Send money to another user
  - `handlePusherEvent()` - Handle real-time events

## Real-time Features

The application uses Pusher for real-time transaction notifications:

- **Channel**: `private-transactions.{user_id}`
- **Event**: `transaction.created`
- **Authentication**: Bearer token in headers
- **Auto-update**: Transactions list updates automatically

## API Integration

### Axios Configuration
- Base URL: `http://localhost:8000`
- Automatic token injection
- Error handling for 401 responses
- Request/response interceptors

### Endpoints Used
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/broadcasting/auth` - Pusher authentication

## Styling

### TailwindCSS Configuration
- Custom primary color palette
- Responsive design utilities
- Form styling with `@tailwindcss/forms`
- Custom component classes

### Design System
- **Primary Colors**: Blue palette (primary-50 to primary-900)
- **Status Colors**: Green (success), Red (error), Yellow (warning)
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:unit    # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Code Quality
- **ESLint**: Code linting with Vue and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Vitest**: Unit testing
- **Playwright**: End-to-end testing

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
1. Set production environment variables
2. Update API base URL to production endpoint
3. Configure Pusher credentials
4. Build and deploy to your hosting platform

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Write tests for new functionality
4. Update documentation as needed

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).