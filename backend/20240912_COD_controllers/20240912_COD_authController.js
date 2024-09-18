import * as Usuario from '../20240912_COD_models/20240912_COD_usuariosModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Iniciar sesión (Login)
export const login = async (req, res) => {
    const { nombre, contraseña } = req.body;

    try {
        // Obtener el usuario por nombre
        const usuarios = await Usuario.obtenerUsuariosActivos();
        const usuario = usuarios.find(u => u.nombre === nombre);
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id_usuario: usuario.id_usuario, rol: usuario.rol }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

// Registrar un nuevo usuario (opcional, si quieres permitir el registro)
export const signup = async (req, res) => {
    const { nombre, contraseña, rol } = req.body;

    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Insertar el usuario en la base de datos con la contraseña encriptada
        const result = await Usuario.insertarUsuario(nombre, hashedPassword, rol);

        res.status(201).json({ message: 'Usuario registrado exitosamente', result });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};
