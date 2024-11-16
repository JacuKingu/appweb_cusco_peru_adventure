import * as toursModel from '../20240912_COD_models/20240912_COD_toursModel.js';

// Servicio para obtener todos los tours activos basados en el rol
export const obtenerToursActivos = async (rol) => {
    try {
        const tours = await toursModel.obtenerToursActivos(rol);
        return tours;
    } catch (error) {
        console.error('Error en obtenerToursActivos:', error);
        throw new Error('Error al obtener los tours activos');
    }
};

// Servicio para obtener un tour por ID considerando el rol
export const obtenerTourPorIdYRol = async (id_tour, rol) => {
    try {
        const tour = await toursModel.obtenerTourPorId(id_tour, rol);
        if (!tour) {
            throw new Error('Tour no encontrado o no tienes permiso para verlo');
        }
        return tour;
    } catch (error) {
        console.error('Error en obtenerTourPorIdYRol:', error);
        throw new Error('Error al obtener el tour por ID');
    }
};

// Servicio para insertar un nuevo tour
export const insertarTour = async (nombre, descripcion, duracion, precio, categoria) => {
    try {
        await toursModel.insertarTour(nombre, descripcion, duracion, precio, categoria);
    } catch (error) {
        console.error('Error en insertarTour:', error);
        throw new Error('Error al insertar el tour');
    }
};

// Servicio para actualizar un tour existente
export const actualizarTour = async (id_tour, nombre, descripcion, duracion, precio, categoria) => {
    try {
        await toursModel.actualizarTour(id_tour, nombre, descripcion, duracion, precio, categoria);
    } catch (error) {
        console.error('Error en actualizarTour:', error);
        throw new Error('Error al actualizar el tour');
    }
};

// Servicio para eliminar un tour lógicamente
export const eliminarTour = async (id_tour) => {
    try {
        await toursModel.eliminarTour(id_tour);
    } catch (error) {
        console.error('Error en eliminarTour:', error);
        throw new Error('Error al eliminar el tour');
    }
};
