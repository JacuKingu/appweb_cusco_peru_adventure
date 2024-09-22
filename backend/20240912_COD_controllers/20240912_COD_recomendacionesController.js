import * as recomendacionesModel from '../20240912_COD_models/20240912_COD_recomendacionesModel.js';

// Obtener todas las recomendaciones activas
export const obtenerRecomendaciones = async (req, res) => {
    try {
        const rol = req.usuario.rol
        const recomendaciones = await recomendacionesModel.obtenerRecomendacionesActivas(rol);
        res.status(200).json({
            success: true,
            data: recomendaciones
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener recomendaciones' });
    }
};

// Obtener una recomendación por ID
export const obtenerRecomendacionPorId = async (req, res) => {
    const { id_recomendacion } = req.params;
    const rol = req.usuario.rol
    try {
        const recomendacion = await recomendacionesModel.obtenerRecomendacionPorId(id_recomendacion,rol);
        if (!recomendacion) {
            return res.status(404).json({ mensaje: 'Recomendación no encontrada' });
        }
        res.status(200).json({ success: true, data: recomendacion });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener recomendación' });
    }
};

// Insertar una nueva recomendación
export const insertarRecomendacion = async (req, res) => {
    const { id_cliente, id_tour, contenido } = req.body;
    try {
        await recomendacionesModel.insertarRecomendacion(id_cliente, id_tour, contenido);
        res.status(201).json({ mensaje: 'Recomendación insertada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar recomendación' });
    }
};

// Actualizar una recomendación existente
export const actualizarRecomendacion = async (req, res) => {
    const { id_recomendacion } = req.params;
    const { id_cliente, id_tour, contenido } = req.body;
    try {
        await recomendacionesModel.actualizarRecomendacion(id_recomendacion, id_cliente, id_tour, contenido);
        res.status(200).json({ mensaje: 'Recomendación actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar recomendación' });
    }
};

// Eliminar lógicamente una recomendación
export const eliminarRecomendacion = async (req, res) => {
    const { id_recomendacion } = req.params;
    try {
        await recomendacionesModel.eliminarRecomendacion(id_recomendacion);
        res.status(200).json({ mensaje: 'Recomendación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar recomendación' });
    }
};
