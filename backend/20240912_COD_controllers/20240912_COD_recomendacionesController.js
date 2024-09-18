import * as recomendacionesModel from '../20240912_COD_models/20240912_COD_recomendacionesModel.js';

// Obtener todas las recomendaciones activas
export const obtenerRecomendaciones = async (req, res) => {
    try {
        const recomendaciones = await recomendacionesModel.obtenerRecomendacionesActivas();
        res.status(200).json(recomendaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener recomendaciones' });
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
