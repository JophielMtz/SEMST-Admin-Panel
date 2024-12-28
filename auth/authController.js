const pool = require("../src/config/db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const usuarios = {

    registroUsuario: async (req, res) => {
        const { usuario, apellido, email, password, rol } = req.body;
        const imagen = req.file;  
    
        try {
            if (!usuario || !apellido || !email || !password || !rol) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }
    
            const saltRounds = 10;
            const passwordHasheada = await bcrypt.hash(password, saltRounds);
    
            let imagenPath = null;
            if (imagen) {
                imagenPath = imagen.filename;
            }
    
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
            // Verificar que se han recibido ambos campos
            if (!email || !password) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }
    
            const query = `SELECT * FROM usuarios WHERE email = ?`;
            const [result] = await pool.query(query, [email]);
    
            // Si no se encuentra el usuario
            if (result.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            const usuario = result[0];
    
            // Verificación de la contraseña
            const contraseñaValida = await bcrypt.compare(password, usuario.password);
            if (!contraseñaValida) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }
    
            const accessToken = jwt.sign(
                { id: usuario.id, usuario: usuario.usuario, rol: usuario.rol, imagen: usuario.imagen },
                process.env.JWT_SECRET,
                { expiresIn: '7d' } 
            );
    
    
            // Generar el refresh token (7 días de validez)
            const refreshToken = jwt.sign(
                { id: usuario.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
    
            // Configuración de las cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 6000 * 60 * 1000, // 1 hora
                sameSite: 'Strict'
            });
    
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
                sameSite: 'Strict'
            });
    
            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
            });
    
        } catch (error) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    },
    
    
    logout: (req, res) => {
        // Limpiar las cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    
        // Configurar encabezados para evitar caché
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');
    
        // Redirigir al inicio
        return res.redirect('/');
    },
    
    
};


module.exports = usuarios;