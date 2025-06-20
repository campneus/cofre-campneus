const db = require('../config/database');

class User {
    static async findById(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

    static async create(userData) {
        const { username, password, role } = userData;
        const result = await db.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
            [username, password, role]
        );
        return result.rows[0];
    }

    static async update(id, userData) {
        const { username, password, role } = userData;
        let query = 'UPDATE users SET username = $1, role = $2';
        let params = [username, role];
        
        if (password) {
            query += ', password = $3';
            params.push(password);
        }
        
        query += ' WHERE id = $' + (params.length + 1) + ' RETURNING *';
        params.push(id);
        
        const result = await db.query(query, params);
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }

    static async findAll() {
        const result = await db.query('SELECT id, username, role FROM users ORDER BY username');
        return result.rows;
    }
}

module.exports = User;

