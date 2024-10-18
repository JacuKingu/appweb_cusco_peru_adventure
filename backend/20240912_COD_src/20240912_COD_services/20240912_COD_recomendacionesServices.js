import * as recomendacionesModel from '../20240912_COD_models/20240912_COD_recomendacionesModel.js';

// Servicio para obtener todas las recomendaciones activas basadas en el rol
export const obtenerRecomendacionesPorRol = async (rol) => {
    try {
        const recomendaciones = await recomendacionesModel.obtenerRecomendacionesActivas(rol);
        return recomendaciones;
    } catch (error) {
        console.error('Error en obtenerRecomendacionesPorRol (Servicio):', error);
        throw new Error('Error al obtener las recomendaciones activas');
    }
};

// Servicio para obtener una recomendación por ID considerando el rol
export const obtenerRecomendacionPorIdYRol = async (id_recomendacion, rol) => {
    try {
        const recomendacion = await recomendacionesModel.obtenerRecomendacionPorId(id_recomendacion, rol);
        if (!recomendacion) {
            throw new Error('Recomendación no encontrada o no tienes permiso para verla');
        }
        return recomendacion;
    } catch (error) {
        console.error('Error en obtenerRecomendacionPorIdYRol (Servicio):', error);
        throw new Error('Error al obtener la recomendación por ID');
    }
};

// Servicio para insertar una nueva recomendación
export const insertarRecomendacion = async (id_grupo, contenido) => {
    try {
        await recomendacionesModel.insertarRecomendacion(id_grupo, contenido);
    } catch (error) {
        console.error('Error en insertarRecomendacion (Servicio):', error);
        throw new Error('Error al insertar la recomendación');
    }
};

// Servicio para actualizar una recomendación existente
export const actualizarRecomendacion = async (id_recomendacion, id_grupo, contenido) => {
    try {
        await recomendacionesModel.actualizarRecomendacion(id_recomendacion, id_grupo, contenido);
    } catch (error) {
        console.error('Error en actualizarRecomendacion (Servicio):', error);
        throw new Error('Error al actualizar la recomendación');
    }
};

// Servicio para eliminar una recomendación lógicamente
export const eliminarRecomendacion = async (id_recomendacion) => {
    try {
        await recomendacionesModel.eliminarRecomendacion(id_recomendacion);
    } catch (error) {
        console.error('Error en eliminarRecomendacion (Servicio):', error);
        throw new Error('Error al eliminar la recomendación');
    }
};
