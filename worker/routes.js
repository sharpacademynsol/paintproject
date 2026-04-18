// Cloudflare Worker Routes Configuration
// Defines all API routes for the Qatar Paint platform

export const routes = {
  // Product Routes
  products: {
    list: { method: 'GET', path: '/api/products' },
    get: { method: 'GET', path: '/api/products/:id' },
    create: { method: 'POST', path: '/api/products' },
    update: { method: 'PUT', path: '/api/products/:id' },
    delete: { method: 'DELETE', path: '/api/products/:id' },
    search: { method: 'GET', path: '/api/products/search' },
    categories: { method: 'GET', path: '/api/products/categories' }
  },

  // Order Routes
  orders: {
    list: { method: 'GET', path: '/api/orders' },
    get: { method: 'GET', path: '/api/orders/:id' },
    create: { method: 'POST', path: '/api/orders' },
    update: { method: 'PUT', path: '/api/orders/:id' },
    cancel: { method: 'POST', path: '/api/orders/:id/cancel' }
  },

  // User Routes
  users: {
    register: { method: 'POST', path: '/api/users/register' },
    login: { method: 'POST', path: '/api/users/login' },
    profile: { method: 'GET', path: '/api/users/profile' },
    update: { method: 'PUT', path: '/api/users/profile' }
  },

  // Service Routes
  services: {
    list: { method: 'GET', path: '/api/services' },
    get: { method: 'GET', path: '/api/services/:id' },
    book: { method: 'POST', path: '/api/services/:id/book' }
  },

  // Upload Routes (R2)
  upload: {
    single: { method: 'POST', path: '/api/upload' },
    multiple: { method: 'POST', path: '/api/upload/multiple' },
    delete: { method: 'DELETE', path: '/api/upload/:key' }
  },

  // Review Routes
  reviews: {
    list: { method: 'GET', path: '/api/reviews' },
    create: { method: 'POST', path: '/api/reviews' },
    approve: { method: 'PUT', path: '/api/reviews/:id/approve' }
  }
};
