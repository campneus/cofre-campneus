const db = require('../config/database');

class Password {
    static async findAll(filters = {}) {
        let query = `
            SELECT p.*, 
                   u.username as created_by_username,
                   lm.username as last_modified_by_username,
                   ar.username as analyst_responsible_username,
                   s.name as subcategory_name,
                   c.name as category_name,
                   l.name as location_name,
                   l.code as location_code,
                   l.city as location_city,
                   l.state as location_state
            FROM passwords p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN users lm ON p.last_modified_by = lm.id
            LEFT JOIN users ar ON p.analyst_responsible = ar.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN locations l ON p.location_id = l.id
        `;
        
        const conditions = [];
        const params = [];
        
        if (filters.search) {
            conditions.push(`(p.username ILIKE $${params.length + 1} OR p.url ILIKE $${params.length + 1} OR p.notes ILIKE $${params.length + 1})`);
            params.push(`%${filters.search}%`);
        }
        
        if (filters.subcategory_id) {
            conditions.push(`p.subcategory_id = $${params.length + 1}`);
            params.push(filters.subcategory_id);
        }
        
        if (filters.location_id) {
            conditions.push(`p.location_id = $${params.length + 1}`);
            params.push(filters.location_id);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY p.last_modified_at DESC';
        
        const result = await db.query(query, params);
        return result.rows;
    }

    static async findById(id) {
        const query = `
            SELECT p.*, 
                   u.username as created_by_username,
                   lm.username as last_modified_by_username,
                   ar.username as analyst_responsible_username,
                   s.name as subcategory_name,
                   c.name as category_name,
                   l.name as location_name,
                   l.code as location_code
            FROM passwords p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN users lm ON p.last_modified_by = lm.id
            LEFT JOIN users ar ON p.analyst_responsible = ar.id
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN locations l ON p.location_id = l.id
            WHERE p.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async create(passwordData) {
        const { 
            user_id, 
            subcategory_id, 
            location_id, 
            username, 
            password, 
            url, 
            notes, 
            last_modified_by, 
            analyst_responsible 
        } = passwordData;
        
        const result = await db.query(
            `INSERT INTO passwords 
             (user_id, subcategory_id, location_id, username, password, url, notes, last_modified_by, analyst_responsible) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING *`,
            [user_id, subcategory_id, location_id, username, password, url, notes, last_modified_by, analyst_responsible]
        );
        return result.rows[0];
    }

    static async update(id, passwordData) {
        const { 
            subcategory_id, 
            location_id, 
            username, 
            password, 
            url, 
            notes, 
            last_modified_by, 
            analyst_responsible 
        } = passwordData;
        
        const result = await db.query(
            `UPDATE passwords 
             SET subcategory_id = $1, location_id = $2, username = $3, password = $4, 
                 url = $5, notes = $6, last_modified_at = CURRENT_TIMESTAMP, 
                 last_modified_by = $7, analyst_responsible = $8
             WHERE id = $9 
             RETURNING *`,
            [subcategory_id, location_id, username, password, url, notes, last_modified_by, analyst_responsible, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM passwords WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }

    static async getRecentPasswords(limit = 5) {
        const query = `
            SELECT p.*, 
                   s.name as subcategory_name,
                   c.name as category_name,
                   l.name as location_name
            FROM passwords p
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN locations l ON p.location_id = l.id
            ORDER BY p.id DESC
            LIMIT $1
        `;
        const result = await db.query(query, [limit]);
        return result.rows;
    }

    static async getRecentlyModified(limit = 5) {
        const query = `
            SELECT p.*, 
                   s.name as subcategory_name,
                   c.name as category_name,
                   l.name as location_name
            FROM passwords p
            LEFT JOIN subcategories s ON p.subcategory_id = s.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN locations l ON p.location_id = l.id
            ORDER BY p.last_modified_at DESC
            LIMIT $1
        `;
        const result = await db.query(query, [limit]);
        return result.rows;
    }

    static async getPasswordCountByCategory() {
        const query = `
            SELECT c.name as category_name, COUNT(p.id) as count
            FROM categories c
            LEFT JOIN subcategories s ON c.id = s.category_id
            LEFT JOIN passwords p ON s.id = p.subcategory_id
            GROUP BY c.id, c.name
            ORDER BY c.name
        `;
        const result = await db.query(query);
        return result.rows;
    }
}

module.exports = Password;

