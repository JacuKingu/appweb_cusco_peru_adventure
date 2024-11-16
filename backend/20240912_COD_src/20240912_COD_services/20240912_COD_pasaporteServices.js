import * as pasaporteModel from '../20240912_COD_models/20240912_COD_pasaporteModel.js';

// Servicio para obtener todos los pasaportes activos basados en el rol
export const obtenerPasaportesPorRol = async (rol) => {
    try {
        const pasaportes = await pasaporteModel.obtenerPasaportesActivos(rol);
        return pasaportes;
    } catch (error) {
        console.error('Error en obtenerPasaportesPorRol (Servicio):', error);
        throw new Error('Error al obtener los pasaportes activos');
    }
};

// Servicio para obtener un pasaporte por ID considerando el rol
export const obtenerPasaportePorIdYRol = async (id_pasaporte, rol) => {
    try {
        const pasaporte = await pasaporteModel.obtenerPasaportePorId(id_pasaporte, rol);
        if (!pasaporte) {
            throw new Error('Pasaporte no encontrado o no tienes permiso para verlo');
        }
        return pasaporte;
    } catch (error) {
        console.error('Error en obtenerPasaportePorIdYRol (Servicio):', error);
        throw new Error('Error al obtener el pasaporte por ID');
    }
};

// Servicio para insertar un nuevo pasaporte
export const insertarPasaporte = async (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) => {
    try {
        await pasaporteModel.insertarPasaporte(id_cliente, numero_pasaporte, pais_emision, fecha_expiracion);
    } catch (error) {
        console.error('Error en insertarPasaporte (Servicio):', error);
        throw new Error('Error al insertar el pasaporte');
    }
};

// Servicio para actualizar un pasaporte existente
export const actualizarPasaporte = async (id_pasaporte, id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) => {
    try {
        await pasaporteModel.actualizarPasaporte(id_pasaporte, id_cliente, numero_pasaporte, pais_emision, fecha_expiracion);
    } catch (error) {
        console.error('Error en actualizarPasaporte (Servicio):', error);
        throw new Error('Error al actualizar el pasaporte');
    }
};

// Servicio para eliminar un pasaporte lógicamente
export const eliminarPasaporte = async (id_pasaporte) => {
    try {
        await pasaporteModel.eliminarPasaporte(id_pasaporte);
    } catch (error) {
        console.error('Error en eliminarPasaporte (Servicio):', error);
        throw new Error('Error al eliminar el pasaporte');
    }
};
