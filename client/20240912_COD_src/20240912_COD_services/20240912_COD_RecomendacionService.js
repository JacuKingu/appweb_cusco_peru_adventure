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
export const insertarRecomendacion = async (id_grupo, tipo, nivel, presupuesto, destino, duracion, contenido) => {
    try {
        console.log('Datos a enviar:', { id_grupo, tipo, nivel, presupuesto, destino, duracion, contenido });
        const response = await api.post('/recomendacion', { id_grupo, tipo, nivel, presupuesto, destino, duracion, contenido });
        console.log('Esta es la respuesta:', response);
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en insertarRecomendacion (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al insertar la recomendación');
    }
};


export const obtenerYProcesarEdades = async (id_grupo, tipo, nivel, presupuesto, destino, duracion) => {
    try {
        // Cuerpo de la solicitud POST con los datos necesarios en el formato requerido
        const body = {
            id_grupo,             // ID del grupo
            tipo_actividades: tipo,  // Tipo de actividades
            nivel_actividad: nivel,      // Nivel de actividad
            presupuesto,          // Presupuesto
            destino_preferido: destino,    // Destino preferido
            duracion_viaje: duracion      // Duración del viaje
        };
        console.log('esta es el body para el backend: ', body)

        // Enviar la solicitud POST con los datos en el cuerpo
        const response = await api.post('/grupo/procesar-edades/', body);
        console.log('respuesta del backend: ', response)

        return response.data; // Retornar los datos de la respuesta
// Servicio para obtener y procesar las edades de un grupo
export const obtenerYProcesarEdades = async (id_grupo, tipo, nivel, presupuesto, destino, duracion, contenido) => {
    try {
        const response = await api.get(`/grupo/procesar-edades/${id_grupo}`, {
            params: { tipo, nivel, presupuesto, destino, duracion, contenido }
        });
        return response.data; 
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un código de error
            console.error('Error de servidor:', error.response.data);
        } else {
            // Si no hay respuesta del servidor
            console.error('Error de red o configuración de la solicitud:', error.message);
        }
        throw new Error(error.response ? error.response.data.message : 'Error al obtener y procesar las edades');
    }
};




// Servicio para actualizar una recomendación existente
export const actualizarRecomendacion = async (id_recomendacion, id_grupo, tipo, nivel, presupuesto, destino, duracion, contenido) => {
    try {
        const response = await api.put(`/recomendacion/${id_recomendacion}`, { id_grupo, tipo, nivel, presupuesto, destino, duracion, contenido });
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
