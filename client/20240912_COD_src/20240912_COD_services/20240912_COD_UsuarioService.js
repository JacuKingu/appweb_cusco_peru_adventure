// 20240912_COD_usuariosServices.js
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

// Servicio para insertar un nuevo usuario
export const insertarUsuario = async (nombre, contraseña, rol) => {
  try {
    const response = await api.post('/usuario', { nombre, contraseña, rol });
    return response.data.message; // Devuelve el mensaje de éxito
  } catch (error) {
    console.error('Error en insertarUsuario (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al insertar usuario');
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
