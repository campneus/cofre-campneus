const db = require('../config/database');

class Category {
    static async findAll() {
        const result = await db.query('SELECT * FROM categories ORDER BY name');
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(categoryData) {
        const { name } = categoryData;
        const result = await db.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        return result.rows[0];
    }

    static async update(id, categoryData) {
        const { name } = categoryData;
        const result = await db.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

class Subcategory {
    static async findAll() {
        const query = `
            SELECT s.*, c.name as category_name 
            FROM subcategories s
            LEFT JOIN categories c ON s.category_id = c.id
            ORDER BY c.name, s.name
        `;
        const result = await db.query(query);
        return result.rows;
    }

    static async findById(id) {
        const query = `
            SELECT s.*, c.name as category_name 
            FROM subcategories s
            LEFT JOIN categories c ON s.category_id = c.id
            WHERE s.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByCategory(categoryId) {
        const result = await db.query(
            'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY name',
            [categoryId]
        );
        return result.rows;
    }

    static async create(subcategoryData) {
        const { category_id, name } = subcategoryData;
        const result = await db.query(
            'INSERT INTO subcategories (category_id, name) VALUES ($1, $2) RETURNING *',
            [category_id, name]
        );
        return result.rows[0];
    }

    static async update(id, subcategoryData) {
        const { category_id, name } = subcategoryData;
        const result = await db.query(
            'UPDATE subcategories SET category_id = $1, name = $2 WHERE id = $3 RETURNING *',
            [category_id, name, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM subcategories WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = { Category, Subcategory };

