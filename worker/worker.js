// Main Cloudflare Worker Entry Point
// Handles routing and request processing for Qatar Paint Platform

import { ProductController } from './controllers/ProductController.js';
import { OrderController } from './controllers/OrderController.js';
import { UploadController } from './controllers/UploadController.js';

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

// Helper function to parse JWT token (simplified - use a proper JWT library in production)
function authenticateUser(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    // In production, properly verify JWT token
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
}

// Helper function to return JSON response
function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...headers
    }
  });
}

// Router
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  // Check if database and storage are available
  const hasDatabase = env.DB !== undefined;
  const hasStorage = env.R2_BUCKET !== undefined;

  // Initialize controllers only if database is available
  let productController, orderController, uploadController;
  
  if (hasDatabase) {
    productController = new ProductController(env);
    orderController = new OrderController(env);
  }
  
  if (hasStorage) {
    uploadController = new UploadController(env);
  }

  // Product Routes
  if (path === '/api/products' && method === 'GET') {
    if (!hasDatabase) {
      return jsonResponse({ success: false, error: 'Database not configured' }, 503);
    }
    const result = await productController.list(request);
    return jsonResponse(result);
  }

  if (path.match(/^\/api\/products\/\d+$/) && method === 'GET') {
    const id = path.split('/').pop();
    const result = await productController.get(id);
    return jsonResponse(result);
  }

  if (path === '/api/products' && method === 'POST') {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const data = await request.json();
    const result = await productController.create(data);
    return jsonResponse(result, 201);
  }

  if (path.match(/^\/api\/products\/\d+$/) && method === 'PUT') {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const id = path.split('/').pop();
    const data = await request.json();
    const result = await productController.update(id, data);
    return jsonResponse(result);
  }

  if (path.match(/^\/api\/products\/\d+$/) && method === 'DELETE') {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const id = path.split('/').pop();
    const result = await productController.delete(id);
    return jsonResponse(result);
  }

  if (path === '/api/products/categories' && method === 'GET') {
    const result = await productController.getCategories();
    return jsonResponse(result);
  }

  if (path === '/api/products/search' && method === 'GET') {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const result = await productController.search(query);
    return jsonResponse(result);
  }

  // Order Routes
  if (path === '/api/orders' && method === 'GET') {
    const user = authenticateUser(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const result = await orderController.list(user.id, page, limit);
    return jsonResponse(result);
  }

  if (path.match(/^\/api\/orders\/\d+$/) && method === 'GET') {
    const user = authenticateUser(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const id = path.split('/').pop();
    const result = await orderController.get(id, user.id);
    return jsonResponse(result);
  }

  if (path === '/api/orders' && method === 'POST') {
    const user = authenticateUser(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const data = await request.json();
    const result = await orderController.create(user.id, data);
    return jsonResponse(result, 201);
  }

  if (path.match(/^\/api\/orders\/\d+\/cancel$/) && method === 'POST') {
    const user = authenticateUser(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const id = path.split('/')[3];
    const result = await orderController.cancel(id, user.id);
    return jsonResponse(result);
  }

  // Upload Routes
  if (path === '/api/upload' && method === 'POST') {
    const user = authenticateUser(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const result = await uploadController.uploadSingle(request);
    return jsonResponse(result, 201);
  }

  if (path === '/api/upload/multiple' && method === 'POST') {
    const user = authenticateUser(request);
    if (!user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const result = await uploadController.uploadMultiple(request);
    return jsonResponse(result, 201);
  }

  if (path.match(/^\/api\/upload\/.+/) && method === 'DELETE') {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }
    const key = path.replace('/api/upload/', '');
    const result = await uploadController.delete(key);
    return jsonResponse(result);
  }

  // Serve static frontend files
  // In local dev, we'll redirect to the file
  // In production, use Cloudflare Assets binding
  
  // For local development, create a simple redirect
  if (!path.startsWith('/api/')) {
    // Let the user know this is a static file route
    // In production with Cloudflare, this would be handled by the assets binding
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><meta http-equiv="refresh" content="0;url=/index.html"></head>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Return 404 for unknown API routes
  return jsonResponse(
    { success: false, error: 'Not Found' },
    404
  );
}

// Main worker export
export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx);
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          error: 'Internal Server Error',
          message: error.message
        },
        500
      );
    }
  }
};
