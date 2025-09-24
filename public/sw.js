/**
 * Service Worker for Performance Optimization
 *
 * Caching and performance optimization
 *
 * @author Fahed
 */

const CACHE_NAME = 'mini-wallet-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/wallet-login',
  '/wallet-dashboard',
  '/transactions',
  '/beneficiaries',
  '/about',
  '/manifest.json',
]

// API endpoints to cache
const API_CACHE_PATTERNS = [/\/api\/user/, /\/api\/transactions/, /\/api\/beneficiaries/]

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files...')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('✅ Static files cached successfully')
        return self.skipWaiting()
      }),
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        return self.clients.claim()
      }),
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle static files
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request))
    return
  }
})

// Handle API requests with caching
async function handleApiRequest(request) {
  const url = new URL(request.url)

  try {
    // Try network first for API requests
    const networkResponse = await fetch(request)

    // Cache successful responses
    if (networkResponse.ok && shouldCacheApi(url.pathname)) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      console.log('📦 Serving API from cache:', url.pathname)
      return cachedResponse
    }

    // Return error response
    return new Response(JSON.stringify({ error: 'Network error and no cache available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Handle static file requests
async function handleStaticRequest(request) {
  try {
    // Try cache first for static files
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Fetch from network if not in cache
    const networkResponse = await fetch(request)

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/')
      return offlineResponse || new Response('Offline', { status: 503 })
    }

    throw error
  }
}

// Check if API endpoint should be cached
function shouldCacheApi(pathname) {
  return API_CACHE_PATTERNS.some((pattern) => pattern.test(pathname))
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered')
    event.waitUntil(handleBackgroundSync())
  }
})

// Handle background sync
async function handleBackgroundSync() {
  // Implement background sync logic here
  console.log('🔄 Processing background sync...')
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'wallet-notification',
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(clients.openWindow('/wallet-dashboard'))
  }
})
