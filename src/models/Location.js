const db = require('../config/database');

class Location {
    static async findAll() {
        const result = await db.query('SELECT * FROM locations ORDER BY name');
        return result.rows;
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM locations WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create(locationData) {
        const { code, cnpj, name, state, city } = locationData;
        const result = await db.query(
            'INSERT INTO locations (code, cnpj, name, state, city) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [code, cnpj, name, state, city]
        );
        return result.rows[0];
    }

    static async update(id, locationData) {
        const { code, cnpj, name, state, city } = locationData;
        const result = await db.query(
            'UPDATE locations SET code = $1, cnpj = $2, name = $3, state = $4, city = $5 WHERE id = $6 RETURNING *',
            [code, cnpj, name, state, city, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM locations WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = Location;

