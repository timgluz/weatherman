const level = require('level');  
const path = require('path');

let dbPath = process.env.DB_PATH || path.join(__dirname, 'data/weatherman_db');
const db = level(dbPath);

module.exports = db;  
