// Order Controller - Handles order-related operations
// Uses Cloudflare D1 database

export class OrderController {
  constructor(env) {
    this.db = env.DB;
  }

  // Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `QP-${timestamp}-${random}`.toUpperCase();
  }

  // Get all orders for a user
  async list(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const [orders, countResult] = await Promise.all([
        this.db
          .prepare(
            `SELECT * FROM orders 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`
          )
          .bind(userId, limit, offset)
          .all(),
        this.db
          .prepare('SELECT COUNT(*) as total FROM orders WHERE user_id = ?')
          .bind(userId)
          .first()
      ]);

      return {
        success: true,
        data: orders.results,
        pagination: {
          page,
          limit,
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get single order by ID
  async get(orderId, userId) {
    try {
      const order = await this.db
        .prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?')
        .bind(orderId, userId)
        .first();

      if (!order) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      // Get order items
      const items = await this.db
        .prepare(
          `SELECT oi.*, p.name, p.image_url 
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = ?`
        )
        .bind(orderId)
        .all();

      return {
        success: true,
        data: {
          ...order,
          items: items.results
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create new order
  async create(userId, orderData) {
    try {
      const { items, shipping_address, billing_address, payment_method, notes } = orderData;

      // Calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await this.db
          .prepare('SELECT * FROM products WHERE id = ?')
          .bind(item.product_id)
          .first();

        if (!product) {
          return {
            success: false,
            error: `Product ${item.product_id} not found`
          };
        }

        if (product.stock_quantity < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for ${product.name}`
          };
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal
        });
      }

      const tax = subtotal * 0.05; // 5% tax
      const shipping_cost = 50; // Fixed shipping cost
      const total = subtotal + tax + shipping_cost;
      const order_number = this.generateOrderNumber();

      // Begin transaction
      const tx = this.db.batch([
        this.db
          .prepare(
            `INSERT INTO orders 
             (user_id, order_number, subtotal, tax, shipping_cost, total, payment_method, shipping_address, billing_address, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            userId,
            order_number,
            subtotal,
            tax,
            shipping_cost,
            total,
            payment_method,
            shipping_address,
            billing_address,
            notes
          ),
        ...orderItems.map(item =>
          this.db
            .prepare(
              `INSERT INTO order_items (order_id, product_id, quantity, price, total)
               VALUES (last_insert_rowid(), ?, ?, ?, ?)`
            )
            .bind(item.product_id, item.quantity, item.price, item.total)
        ),
        ...items.map(item =>
          this.db
            .prepare(
              'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?'
            )
            .bind(item.quantity, item.product_id)
        )
      ]);

      await tx;

      return {
        success: true,
        data: { order_number, total },
        message: 'Order created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update order status
  async updateStatus(orderId, userId, status) {
    try {
      const result = await this.db
        .prepare(
          'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
        )
        .bind(status, orderId, userId)
        .run();

      if (result.meta.changes === 0) {
        return {
          success: false,
          error: 'Order not found'
        };
      }

      return {
        success: true,
        message: 'Order status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Cancel order
  async cancel(orderId, userId) {
    try {
      // Get order items to restore stock
      const items = await this.db
        .prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?')
        .bind(orderId)
        .all();

      const tx = this.db.batch([
        this.db
          .prepare(
            'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
          )
          .bind('cancelled', orderId, userId),
        ...items.results.map(item =>
          this.db
            .prepare(
              'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?'
            )
            .bind(item.quantity, item.product_id)
        )
      ]);

      await tx;

      return {
        success: true,
        message: 'Order cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
