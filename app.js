const express = require('express');
const path = require('path');
const multer = require('multer');

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Carpeta donde se guardarán los archivos subidos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
  }
});

const upload = multer({ storage: storage });

const expressLayouts = require('express-ejs-layouts');
const db = require('./src/config/db');  // Importar la conexión a la base de datos

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Middleware para procesar datos JSON
app.use(express.json());

// No es necesario si no usas métodos PUT o DELETE
// app.use(methodOverride('_method'));

// Exportar 'upload' si lo necesitas en tus rutas
module.exports = { app, upload };

// Importar y usar las rutas
const router = require('./routes/router');
app.use(router);

app.listen(3000, () => {
  console.log('server up running in http://localhost:3000/');
});
