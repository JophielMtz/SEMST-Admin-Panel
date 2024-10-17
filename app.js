const express = require('express') 
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
// Importar la conexión a la base de datos
const db = require('./src/config/db');  // Aquí importas la conexión

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public'))); 


const router = require('./routes/router')
app.use(router);



app.listen (3000, ()=> {
    console.log('server up running in http://localhost:3000/')
})
