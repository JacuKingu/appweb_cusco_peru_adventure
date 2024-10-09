import api from './20240912_COD_Api';

// Servicio para obtener todas las recomendaciones activas
export const obtenerRecomendacionesPorRol = async (rol) => {
    try {
        const response = await api.get('/recomendacion', { params: { rol } });
        return response.data; // Devuelve las recomendaciones activas
    } catch (error) {
        console.error('Error en obtenerRecomendacionesPorRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener las recomendaciones activas');
    }
};

// Servicio para obtener una recomendación por ID considerando el rol
export const obtenerRecomendacionPorIdYRol = async (id_recomendacion, rol) => {
    try {
        const response = await api.get(`/recomendacion/${id_recomendacion}`, { params: { rol } });
        return response.data; // Devuelve la recomendación
    } catch (error) {
        console.error('Error en obtenerRecomendacionPorIdYRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener la recomendación por ID');
    }
};

// Servicio para insertar una nueva recomendación
export const insertarRecomendacion = async (id_cliente, id_tour, contenido) => {
    try {
        const response = await api.post('/recomendacion', { id_cliente, id_tour, contenido });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en insertarRecomendacion (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al insertar la recomendación');
    }
};

// Servicio para actualizar una recomendación existente
export const actualizarRecomendacion = async (id_recomendacion, id_cliente, id_tour, contenido) => {
    try {
        const response = await api.put(`/recomendacion/${id_recomendacion}`, { id_cliente, id_tour, contenido });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en actualizarRecomendacion (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al actualizar la recomendación');
    }
};

// Servicio para eliminar una recomendación lógicamente
export const eliminarRecomendacion = async (id_recomendacion) => {
    try {
        const response = await api.delete(`/recomendacion/${id_recomendacion}`);
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en eliminarRecomendacion (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al eliminar la recomendación');
    }
};
