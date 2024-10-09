import api from './20240912_COD_Api';

// Servicio para obtener todos los tours activos
export const obtenerToursActivos = async (rol) => {
    try {
        const response = await api.get('/tour', { params: { rol } });
        return response.data; // Devuelve los tours activos
    } catch (error) {
        console.error('Error en obtenerToursActivos (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener los tours activos');
    }
};

// Servicio para obtener un tour por ID considerando el rol
export const obtenerTourPorIdYRol = async (id_tour, rol) => {
    try {
        const response = await api.get(`/tour/${id_tour}`, { params: { rol } });
        return response.data; // Devuelve el tour
    } catch (error) {
        console.error('Error en obtenerTourPorIdYRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener el tour por ID');
    }
};

// Servicio para insertar un nuevo tour
export const insertarTour = async (nombre, descripcion, duracion, precio, categoria) => {
    try {
        console.log('Datos enviados al backend para insertar tour:', {
            nombre,
            descripcion,
            duracion,
            precio,
            categoria
        });
        const response = await api.post('/tour', { nombre, descripcion, duracion, precio, categoria });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en insertarTour (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al insertar el tour');
    }
};

// Servicio para actualizar un tour existente
export const actualizarTour = async (id_tour, nombre, descripcion, duracion, precio, categoria) => {
    try {
        const response = await api.put(`/tour/${id_tour}`, { nombre, descripcion, duracion, precio, categoria });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en actualizarTour (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al actualizar el tour');
    }
};

// Servicio para eliminar un tour lógicamente
export const eliminarTour = async (id_tour) => {
    try {
        const response = await api.delete(`/tour/${id_tour}`);
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en eliminarTour (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al eliminar el tour');
    }
};
