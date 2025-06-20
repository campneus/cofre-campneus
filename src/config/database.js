const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST || 'ep-crimson-meadow-a8krhs13.eastus2.azure.neon.tech',
    database: process.env.PGDATABASE || 'senhas_campneus',
    user: process.env.PGUSER || 'senhas_campneus_owner',
    password: process.env.PGPASSWORD || 'npg_MXP5UK4CqToH',
    port: process.env.PGPORT || 5432,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Teste de conexão
pool.on('connect', () => {
    console.log('Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Erro na conexão com o banco de dados:', err);
});

// Função para executar queries
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query executada:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Erro na query:', error);
        throw error;
    }
};

// Função para obter um cliente do pool
const getClient = async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    // Monkey patch para logging
    client.query = (...args) => {
        client.lastQuery = args;
        return query.apply(client, args);
    };
    
    client.release = () => {
        delete client.lastQuery;
        return release.apply(client);
    };
    
    return client;
};

module.exports = {
    query,
    getClient,
    pool
};

