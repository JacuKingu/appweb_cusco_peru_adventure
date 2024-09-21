import * as Auth from '../20240912_COD_models/20240912_COD_authModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Iniciar sesión (Login)
export const login = async (req, res) => {
    const { nombre, contraseña } = req.body;

    try {
        // Llamar al modelo loginUsuario para obtener la información del procedimiento almacenado
        const { mensaje, id_usuario, rol, contraseña_hash } = await Auth.loginUsuario(nombre);

        if (mensaje !== 'Usuario encontrado. Contraseña verificada externamente.') {
            return res.status(401).json({ message: mensaje });
        }

        // Comparar la contraseña ingresada con la almacenada (hash)
        const isMatch = await bcrypt.compare(contraseña, contraseña_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id_usuario, rol }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

// Registrar un nuevo usuario (Signup)
export const signup = async (req, res) => {
    const { nombre, contraseña, rol } = req.body;

    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Llamar al modelo signupUsuario para insertar un nuevo usuario
        const mensaje = await Auth.signupUsuario(nombre, hashedPassword, rol);

        res.status(201).json({ message: mensaje });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};
