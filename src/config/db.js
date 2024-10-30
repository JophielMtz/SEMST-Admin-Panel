const mysql = require('mysql2');
const dotenv = require('dotenv');

//cargar variables del env variables .env

dotenv.config();

// Crear la conexión con la base de datos MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

//Probar conexión
// Probar conexión con una consulta simple
pool.query('SELECT 1 + 1 AS resultado')
  .then(([rows]) => {
    console.log('Conexión exitosa a la base de datos:', rows[0].resultado);
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });


//Exportar la conexión para usarla en otros archivos
module.exports = pool;


