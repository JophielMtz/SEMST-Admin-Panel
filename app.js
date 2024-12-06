const express = require('express');
const path = require('path');
const multer = require('multer');
const expressLayouts = require('express-ejs-layouts');
const db = require('./src/config/db'); 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authViews = require('./src/config/middlewares/authViews');



require('dotenv').config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png']; 

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan .jpg y .png.'), false); 
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const app = express();


app.use(cookieParser());


// Configuración del motor de vistas y layout
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(authViews); //vistas globales autenticadas

// Definir rutas de la API antes de los archivos estáticos
const apiRoutes = require('./routes/router');
app.use('/api', apiRoutes);

app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/perfil', express.static('public'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {res.redirect('/login'); });


module.exports = { app, upload };

const router = require('./routes/router');
app.use(router);

app.listen(3000, () => {
  console.log('server up running in http://localhost:3000/');
});

app.use(morgan('dev')); 
