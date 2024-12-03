const checkRol = (roles) => {
    return (req, res, next) => {
        const { rol } = req.usuario;

        if (!roles.includes(rol)) {
            return res.redirect('/403');
        }

        next();
    };
};

module.exports = checkRol;
