import * as toursService from '../20240912_COD_services/20240912_COD_toursServices.js';

// Obtener todos los tours activos basados en el rol
export const obtenerTours = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        console.log("Rol recibido: ",rol);
        const tours = await toursService.obtenerToursActivos(rol);
        
        res.status(200).json({
            success: true,
            data: tours
        });
    } catch (error) {
        console.error('Error al obtener tours:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener un tour por ID considerando el rol
export const obtenerTourPorId = async (req, res) => {
    const { id_tour } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const tour = await toursService.obtenerTourPorIdYRol(id_tour, rol);
        res.status(200).json({ success: true, data: tour });
    } catch (error) {
        console.error('Error al obtener tour por ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Insertar un nuevo tour
export const insertarTour = async (req, res) => {
    const { nombre, descripcion, duracion, precio, categoria } = req.body;
    console.log('Datos recibidos controller:', { nombre, descripcion, duracion, precio, categoria });
    try {
        await toursService.insertarTour(nombre, descripcion, duracion, precio, categoria);
        res.status(201).json({ message: 'Tour insertado exitosamente' });
    } catch (error) {
        console.error('Error al insertar tour:', error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un tour existente
export const actualizarTour = async (req, res) => {
    const { id_tour } = req.params;
    const { nombre, descripcion, duracion, precio, categoria } = req.body;
    try {
        await toursService.actualizarTour(id_tour, nombre, descripcion, duracion, precio, categoria);
        res.status(200).json({ message: 'Tour actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar tour:', error);
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un tour lógicamente
export const eliminarTour = async (req, res) => {
    const { id_tour } = req.params;
    try {
        await toursService.eliminarTour(id_tour);
        res.status(200).json({ message: 'Tour eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tour:', error);
        res.status(500).json({ message: error.message });
    }
};
