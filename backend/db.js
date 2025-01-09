// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql2024',
    database: 'quiz_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const query = (sql, params) => {

    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(results);

        });
    });
};

// Exporter la fonction query
module.exports = { query };
