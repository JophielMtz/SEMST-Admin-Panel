const express = require('express') // Corrección aquí
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public'))); 


const router = require('./routes/router')
app.use(router);



/*
app.get('/', (req, res) => {
    res.send('Dashboard con Node Js');
});
*/
app.listen (3000, ()=> {
    console.log('server up running in http://localhost:3000/')
})
