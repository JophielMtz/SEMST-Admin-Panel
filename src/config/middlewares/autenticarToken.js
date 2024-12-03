const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
    const token = req.cookies.accessToken;  // Asegúrate de que esta cookie se llame 'accessToken'

    // Si no se proporciona el token en las cookies
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    // Verificar la validez del token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token no válido.' });
        }
        req.usuario = user;
      
        next();  // Continua al siguiente middleware o controlador
    });
};

module.exports = autenticarToken;