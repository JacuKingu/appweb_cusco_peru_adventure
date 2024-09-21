import * as toursModel from '../20240912_COD_models/20240912_COD_toursModel.js';

// Obtener todos los tours activos
export const obtenerTours = async (req, res) => {
    try {
        const tours = await toursModel.obtenerToursActivos();
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tours' });
    }
};

// Insertar un nuevo tour
export const insertarTour = async (req, res) => {
    const { nombre_tour, descripcion, duracion, precio, categoria } = req.body;
    try {
        await toursModel.insertarTour(nombre_tour, descripcion, duracion, precio, categoria);
        res.status(201).json({ mensaje: 'Tour insertado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar tour' });
    }
};

// Actualizar un tour
export const actualizarTour = async (req, res) => {
    const { id_tour } = req.params;
    const { nombre_tour, descripcion, duracion, precio, categoria } = req.body;
    try {
        await toursModel.actualizarTour(id_tour, nombre_tour, descripcion, duracion, precio, categoria);
        res.status(200).json({ mensaje: 'Tour actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar tour' });
    }
};

// Eliminar un tour 
export const eliminarTour = async (req, res) => {
    const { id_tour } = req.params;
    try {
        await toursModel.eliminarTour(id_tour);
        res.status(200).json({ mensaje: 'Tour eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar tour' });
    }
};
