import * as pasaporteService from '../20240912_COD_services/20240912_COD_pasaporteServices.js';

// Obtener todos los pasaportes activos basados en el rol
export const obtenerPasaportes = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        const pasaportes = await pasaporteService.obtenerPasaportesPorRol(rol);
        res.status(200).json({
            success: true,
            data: pasaportes
        });
    } catch (error) {
        console.error('Error al obtener pasaportes:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener un pasaporte por ID considerando el rol
export const obtenerPasaportePorId = async (req, res) => {
    const { id_pasaporte } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const pasaporte = await pasaporteService.obtenerPasaportePorIdYRol(id_pasaporte, rol);
        res.status(200).json({ success: true, data: pasaporte });
    } catch (error) {
        console.error('Error al obtener pasaporte por ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Insertar un nuevo pasaporte
export const insertarPasaporte = async (req, res) => {
    const { id_cliente, numero_pasaporte, pais_emision, fecha_expiracion } = req.body;
    try {
        await pasaporteService.insertarPasaporte(id_cliente, numero_pasaporte, pais_emision, fecha_expiracion);
        res.status(201).json({ message: 'Pasaporte insertado exitosamente' });
    } catch (error) {
        console.error('Error al insertar pasaporte:', error);
        res.status(500).json({ message: 'Error al insertar pasaporte' });
    }
};

// Actualizar un pasaporte existente
export const actualizarPasaporte = async (req, res) => {
    const { id_pasaporte } = req.params;
    const { id_cliente, numero_pasaporte, pais_emision, fecha_expiracion } = req.body;
    try {
        await pasaporteService.actualizarPasaporte(id_pasaporte, id_cliente, numero_pasaporte, pais_emision, fecha_expiracion);
        res.status(200).json({ message: 'Pasaporte actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar pasaporte:', error);
        res.status(500).json({ message: 'Error al actualizar pasaporte' });
    }
};

// Eliminar un pasaporte lógicamente
export const eliminarPasaporte = async (req, res) => {
    const { id_pasaporte } = req.params;
    try {
        await pasaporteService.eliminarPasaporte(id_pasaporte);
        res.status(200).json({ message: 'Pasaporte eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar pasaporte:', error);
        res.status(500).json({ message: 'Error al eliminar pasaporte' });
    }
};
