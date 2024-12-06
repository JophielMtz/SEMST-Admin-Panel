const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',  // Si no está definido en .env, usa localhost
  user: process.env.DB_USER || 'root',      // Si no está definido, usa root
  password: process.env.DB_PASSWORD || 'root', // Si no está definido, usa el valor por defecto
  database: process.env.DB_NAME || 'semstdb',   // Si no está definido, usa usersdb
  port: process.env.DB_PORT || 3306          // Si no está definido, usa 3306
}).promise();

pool.query('SELECT 1 + 1 AS resultado')
  .then(([rows]) => {
    console.log('Conexión exitosa a la base de datos:', rows[0].resultado);
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = pool;


