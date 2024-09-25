import api from './20240912_COD_Api';

// Servicio para obtener todos los pasaportes activos
export const obtenerPasaportesPorRol = async (rol) => {
  try {
    const response = await api.get('/pasaporte', { params: { rol } });
    return response.data; // Devuelve los pasaportes activos
  } catch (error) {
    console.error('Error en obtenerPasaportesPorRol (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al obtener los pasaportes activos');
  }
};

// Servicio para obtener un pasaporte por ID considerando el rol
export const obtenerPasaportePorIdYRol = async (id_pasaporte, rol) => {
  try {
    const response = await api.get(`/pasaporte/${id_pasaporte}`, { params: { rol } });
    return response.data; // Devuelve el pasaporte
  } catch (error) {
    console.error('Error en obtenerPasaportePorIdYRol (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al obtener el pasaporte por ID');
  }
};

// Servicio para insertar un nuevo pasaporte
export const insertarPasaporte = async (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) => {
  try {
    const response = await api.post('/pasaporte', { id_cliente, numero_pasaporte, pais_emision, fecha_expiracion });
    return response.data.message; // Devuelve el mensaje de éxito
  } catch (error) {
    console.error('Error en insertarPasaporte (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al insertar el pasaporte');
  }
};

// Servicio para actualizar un pasaporte existente
export const actualizarPasaporte = async (id_pasaporte, id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) => {
  try {
    const response = await api.put(`/pasaporte/${id_pasaporte}`, { id_cliente, numero_pasaporte, pais_emision, fecha_expiracion });
    return response.data.message; // Devuelve el mensaje de éxito
  } catch (error) {
    console.error('Error en actualizarPasaporte (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al actualizar el pasaporte');
  }
};

// Servicio para eliminar un pasaporte lógicamente
export const eliminarPasaporte = async (id_pasaporte) => {
  try {
    const response = await api.delete(`/pasaporte/${id_pasaporte}`);
    return response.data.message; // Devuelve el mensaje de éxito
  } catch (error) {
    console.error('Error en eliminarPasaporte (Frontend):', error);
    throw new Error(error.response ? error.response.data.message : 'Error al eliminar el pasaporte');
  }
};
