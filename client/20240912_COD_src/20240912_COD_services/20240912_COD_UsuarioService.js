import api from './20240912_COD_Api';

// Servicio para obtener usuarios por rol
export const obtenerUsuariosPorRol = async (rol) => {
  try {
    const response = await api.get('/usuario', { params: { rol } });
    return response.data; // Devuelve los usuarios activos
  } catch (error) {
    console.error('Error en obtenerUsuariosPorRol (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al obtener usuarios por rol');
  }
};

// Servicio para obtener un usuario por ID considerando el rol
export const obtenerUsuarioPorIdYRol = async (id_usuario, rol) => {
  try {
    const response = await api.get(`/usuario/${id_usuario}`, { params: { rol } });
    return response.data; // Devuelve el usuario
  } catch (error) {
    console.error('Error en obtenerUsuarioPorIdYRol (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al obtener el usuario por ID');
  }
};

export const insertarUsuario = async (nombre, contraseña, rol) => {
  try {
    // Realiza una petición POST al backend para insertar un nuevo usuario
    const response = await api.post('/usuario', { nombre, contraseña, rol });
    
    // Devuelve el mensaje de éxito si la inserción es correcta
    return response.data.message;
  } catch (error) {
    // Aquí puedes manejar diferentes tipos de errores de forma más amigable

    // Si el error tiene una respuesta del servidor, maneja el error de esa forma
    if (error.response.data.errors) {
      const mensajeError = error.response.data.errors[0].msg;

      // Lanza un error con el mensaje adecuado para mostrar al usuario
      throw new Error(mensajeError);
    } else {
      throw new Error('El nombre de usuario ya está en uso');
    }
  }
};


// Servicio para actualizar un usuario existente
export const actualizarUsuario = async (id_usuario, nombre, contraseña, rol) => {
  try {
    const response = await api.put(`/usuario/${id_usuario}`, { nombre, contraseña, rol });
    return response.data.message; // Devuelve el mensaje de éxito
  } catch (error) {
    console.error('Error en actualizarUsuario (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al actualizar usuario');
  }
};

// Servicio para eliminar un usuario lógicamente
export const eliminarUsuario = async (id_usuario) => {
  try {
    const response = await api.delete(`/usuario/${id_usuario}`);
    return response.data.message; // Devuelve el mensaje de éxito
  } catch (error) {
    console.error('Error en eliminarUsuario (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al eliminar usuario');
  }
};
