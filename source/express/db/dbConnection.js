const { Pool } = require('pg'); // Example using PostgreSQL

const pool = new Pool({
    user: 'your-username',
    host: 'localhost',
    database: 'your-database',
    password: 'your-password',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
