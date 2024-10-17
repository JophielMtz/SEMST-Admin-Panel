const mysql = require('mysql2');
const dotenv = require('dotenv');

//cargar variables del env variables .env

dotenv.config();

// Crear la conexión con la base de datos MySQL
const connection = mysql.createConnection ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Probar conexión

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexion exitosa a la base de datos.');
});

//Exportar la conexión para usarla en otros archivos
module.exports = connection;


