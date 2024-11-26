const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

pool.query('SELECT 1 + 1 AS resultado')
  .then(([rows]) => {
    console.log('Conexión exitosa a la base de datos:', rows[0].resultado);
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = pool;


