import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Auth from '../20240912_COD_models/20240912_COD_authModel.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Servicio para validar las credenciales del usuario y generar un token
export const loginUsuario = async (nombre, contraseña) => {
    try {
        // Llamar al modelo loginUsuario para obtener la información del usuario
        const { mensaje, id_usuario, rol, contraseña_hash } = await Auth.loginUsuario(nombre);

        // Verificar si el usuario fue encontrado y la contraseña fue verificada
        if (mensaje !== 'Usuario encontrado. Contraseña verificada externamente.') {
            throw new Error(mensaje);
        }

        // Comparar la contraseña ingresada con la contraseña encriptada almacenada
        const isMatch = await bcrypt.compare(contraseña, contraseña_hash);
        if (!isMatch) {
            throw new Error('Contraseña incorrecta.');
        }

        // Generar un token JWT
        const token = jwt.sign({ id_usuario, rol }, JWT_SECRET, { expiresIn: '8h' });

        // Devolver el token y los datos del usuario
        return { token, id_usuario, rol };
    } catch (error) {
        console.error('Error en loginUsuario (Servicio):', error);
        throw new Error(error.message);
    }
};

// Servicio para registrar un nuevo usuario
export const signupUsuario = async (nombre, contraseña, rol) => {
    try {
        // Encriptar la contraseña antes de enviar al modelo
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Llamar al modelo para registrar el usuario
        const mensaje = await Auth.signupUsuario(nombre, hashedPassword, rol);

        // Devolver el mensaje de éxito
        return mensaje;
    } catch (error) {
        console.error('Error en signupUsuario (Servicio):', error);
        throw new Error('Error al registrar usuario');
    }
};
