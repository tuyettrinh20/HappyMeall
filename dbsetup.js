
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'wpr',
    password: 'fit2023',
    database: 'happymeal'
}).promise();
module.exports = db;