const pool = require("../src/config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();
const usuarios = {

    registroUsuario: async (req, res) => {
        const { usuario, apellido, email, password, rol } = req.body;
        const imagen = req.file;  // Este es el archivo de imagen recibido
    
        try {
            if (!usuario || !apellido || !email || !password || !rol) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }
    
            const saltRounds = 10;
            const passwordHasheada = await bcrypt.hash(password, saltRounds);
    
            // Manejo de la imagen (si existe)
            let imagenPath = null;
            if (imagen) {
                imagenPath = imagen.filename; // Guarda el nombre del archivo subido
            }
    
            // Guardar el usuario en la base de datos
            const query = `
                INSERT INTO usuarios (usuario, apellido, email, password, rol, imagen) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await pool.query(query, [usuario, apellido, email, passwordHasheada, rol, imagenPath]);
    
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (error) {
            console.error('### Error al registrar el usuario ###');
            console.error(error);
            res.status(500).json({ error: 'Error al registrar el usuario' });
        }
    },
    
    
    login: async (req, res) => {
        const { email, password } = req.body;
    
        try {
            // Log: Datos recibidos
            console.log('Datos recibidos:', { email, password });
    
            // Verificar que se han recibido ambos campos
            if (!email || !password) {
                console.log('Faltan campos:', { email, password });
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }
    
            // Log: Verificando si el email existe en la base de datos
            const query = `SELECT * FROM usuarios WHERE email = ?`;
            console.log('Ejecutando consulta para email:', email);
    
            const [result] = await pool.query(query, [email]);
    
            // Si no se encuentra el usuario
            if (result.length === 0) {
                console.log('Usuario no encontrado para el email:', email);
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            const usuario = result[0];
            console.log('Usuario encontrado:', usuario);
    
            // Verificación de la contraseña
            const contraseñaValida = await bcrypt.compare(password, usuario.password);
            console.log('Contraseña válida:', contraseñaValida);
    
            if (!contraseñaValida) {
                console.log('Contraseña incorrecta para el usuario:', email);
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }
    
            // Generar un token JWT para el usuario autenticado
            console.log('Generando token JWT para el usuario:', usuario.id);
            const token = jwt.sign(
                { id: usuario.id, usuario: usuario.usuario, rol: usuario.rol, imagen: usuario.imagen },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            // Log: Token generado con éxito
            console.log('Token generado exitosamente');
    
            // Responder con el mensaje de éxito y el token en formato JSON
            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token
            });
        } catch (error) {
            // Log: Error general
            console.error('Error al iniciar sesión:', error);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    },
    
    


autenticarToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraer el token

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Verifica el token con la clave secreta
        const usuario = jwt.verify(token, process.env.JWT_SECRET);

        // Asigna los datos del usuario a la solicitud
        req.usuario = usuario;

        // Responde con los datos del usuario si es necesario
        return res.status(200).json({
            message: 'Token válido',
            usuario: usuario
        });

    } catch (error) {
        return res.status(403).json({ error: 'Token no válido.' });
    }
}

};


module.exports = usuarios;
