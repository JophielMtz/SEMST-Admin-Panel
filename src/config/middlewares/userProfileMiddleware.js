module.exports = (req, res, next) => {
    // Verificamos si hay un usuario en req.usuario (verificado por el middleware autenticarToken)
   

    if (req.usuario) {
        // Si el usuario existe, lo asignamos a res.locals
        res.locals.usuario = req.usuario;
       
    } else {
        // Si no hay usuario, asignamos valores por defecto
        res.locals.usuario = { 
            usuario: 'Invitado',  // Nombre predeterminado
            imagen: '01.png',  // Imagen predeterminada
            rol: 'guest'  // Rol predeterminado
        };
        // console.log('No hay usuario, asignando valores predeterminados.');
    }

    next();  // Pasamos al siguiente middleware o controlador
};
