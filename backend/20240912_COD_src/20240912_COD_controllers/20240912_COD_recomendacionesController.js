import * as recomendacionesService from '../20240912_COD_services/20240912_COD_recomendacionesServices.js';

// Obtener todas las recomendaciones activas
export const obtenerRecomendaciones = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        const recomendaciones = await recomendacionesService.obtenerRecomendacionesPorRol(rol);
        res.status(200).json({
            success: true,
            data: recomendaciones
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener recomendaciones' });
    }
};

// Obtener una recomendación por ID considerando el rol
export const obtenerRecomendacionPorId = async (req, res) => {
    const { id_recomendacion } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const recomendacion = await recomendacionesService.obtenerRecomendacionPorIdYRol(id_recomendacion, rol);
        if (!recomendacion) {
            return res.status(404).json({ message: 'Recomendación no encontrada' });
        }
        res.status(200).json({ success: true, data: recomendacion });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener recomendación' });
    }
};

// Insertar una nueva recomendación
export const insertarRecomendacion = async (req, res) => {
    const { id_grupo, contenido } = req.body;
    try {
        await recomendacionesService.insertarRecomendacion(id_grupo, contenido);
        res.status(201).json({ message: 'Recomendación insertada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar recomendación' });
    }
};

// Actualizar una recomendación existente
export const actualizarRecomendacion = async (req, res) => {
    const { id_recomendacion } = req.params;
    const { id_grupo, contenido } = req.body;
    try {
        await recomendacionesService.actualizarRecomendacion(id_recomendacion, id_grupo, contenido);
        res.status(200).json({ message: 'Recomendación actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar recomendación' });
    }
};

// Eliminar lógicamente una recomendación
export const eliminarRecomendacion = async (req, res) => {
    const { id_recomendacion } = req.params;
    try {
        await recomendacionesService.eliminarRecomendacion(id_recomendacion);
        res.status(200).json({ message: 'Recomendación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar recomendación' });
    }
};
