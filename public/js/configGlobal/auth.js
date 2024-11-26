const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const usuario = jwt.verify(token, 'clave_secreta_segura'); // Cambia 'clave_secreta_segura' por una clave real
        req.usuario = usuario; 
        next(); 
    } catch (error) {
        return res.status(403).json({ error: 'Token no válido.' });
    }
};

module.exports = autenticarToken;
