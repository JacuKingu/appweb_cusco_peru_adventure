import api from './20240912_COD_Api';

// Servicio para iniciar sesión y obtener un token
export const loginUsuario = async (nombre, contraseña) => {
    try {
        const response = await api.post('/auth/login', { nombre, contraseña });

        // Devuelve un objeto con el token y el mensaje
        return {
            token: response.data.token,
            message: response.data.message
        };
    } catch (error) {
        console.error('Error en loginUsuario (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error de conexión');
    }
};


// Servicio para registrar un nuevo usuario
export const signupUsuario = async (nombre, contraseña, rol) => {
    try {
        const response = await api.post('/auth/signup', { nombre, contraseña, rol });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en signupUsuario (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al registrar usuario');
    }
};