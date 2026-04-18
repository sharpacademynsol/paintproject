// Product Controller - Handles product-related operations
// Uses Cloudflare D1 database

export class ProductController {
  constructor(env) {
    this.db = env.DB;
  }

  // Get all products with pagination and filtering
  async list(request) {
    try {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const limit = parseInt(url.searchParams.get('limit')) || 20;
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      const offset = (page - 1) * limit;

      let query = 'SELECT * FROM products WHERE is_active = 1';
      let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = 1';
      const params = [];
      const countParams = [];

      if (category) {
        query += ' AND category = ?';
        countQuery += ' AND category = ?';
        params.push(category);
        countParams.push(category);
      }

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        countQuery += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
        countParams.push(`%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [products, countResult] = await Promise.all([
        this.db.prepare(query).bind(...params).all(),
        this.db.prepare(countQuery).bind(...countParams).first()
      ]);

      return {
        success: true,
        data: products.results,
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

  // Get single product by ID
  async get(id) {
    try {
      const product = await this.db
        .prepare('SELECT * FROM products WHERE id = ?')
        .bind(id)
        .first();

      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      return {
        success: true,
        data: product
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create new product
  async create(data) {
    try {
      const {
        name,
        description,
        category,
        subcategory,
        price,
        stock_quantity,
        sku,
        image_url,
        images,
        specifications,
        featured
      } = data;

      const result = await this.db
        .prepare(
          `INSERT INTO products 
           (name, description, category, subcategory, price, stock_quantity, sku, image_url, images, specifications, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          name,
          description,
          category,
          subcategory,
          price,
          stock_quantity,
          sku,
          image_url,
          JSON.stringify(images || []),
          JSON.stringify(specifications || {}),
          featured || 0
        )
        .run();

      return {
        success: true,
        data: { id: result.meta.last_row_id },
        message: 'Product created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update product
  async update(id, data) {
    try {
      const fields = [];
      const values = [];

      Object.keys(data).forEach(key => {
        if (key !== 'id') {
          fields.push(`${key} = ?`);
          values.push(
            typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]
          );
        }
      });

      values.push(id);

      const query = `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await this.db.prepare(query).bind(...values).run();

      return {
        success: true,
        message: 'Product updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete product (soft delete)
  async delete(id) {
    try {
      await this.db
        .prepare('UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(id)
        .run();

      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all categories
  async getCategories() {
    try {
      const categories = await this.db
        .prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY name')
        .all();

      return {
        success: true,
        data: categories.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search products
  async search(query, filters = {}) {
    try {
      let sql = 'SELECT * FROM products WHERE is_active = 1';
      const params = [];

      if (query) {
        sql += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${query}%`, `%${query}%`);
      }

      if (filters.category) {
        sql += ' AND category = ?';
        params.push(filters.category);
      }

      if (filters.minPrice) {
        sql += ' AND price >= ?';
        params.push(filters.minPrice);
      }

      if (filters.maxPrice) {
        sql += ' AND price <= ?';
        params.push(filters.maxPrice);
      }

      sql += ' ORDER BY created_at DESC LIMIT 50';

      const products = await this.db.prepare(sql).bind(...params).all();

      return {
        success: true,
        data: products.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
