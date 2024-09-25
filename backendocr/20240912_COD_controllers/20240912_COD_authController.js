import * as authService from '../20240912_COD_services/20240912_COD_authServices.js';

// Iniciar sesión (Login)
export const login = async (req, res) => {
    const { nombre, contraseña } = req.body;

    try {
        // Llamar al servicio loginUsuario para validar las credenciales y obtener el token
        const { token, id_usuario, rol } = await authService.loginUsuario(nombre, contraseña);
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(401).json({ message: error.message });
    }
};

// Registrar un nuevo usuario (Signup)
export const signup = async (req, res) => {
    const { nombre, contraseña, rol } = req.body;

    try {
        // Llamar al servicio signupUsuario para registrar al usuario
        const mensaje = await authService.signupUsuario(nombre, contraseña, rol);
        res.status(201).json({ message: mensaje });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};
