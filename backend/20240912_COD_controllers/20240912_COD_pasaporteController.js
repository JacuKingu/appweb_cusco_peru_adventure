import * as pasaporteModel from '../20240912_COD_models/20240912_COD_pasaporteModel.js';

// Obtener todos los pasaportes activos
export const obtenerPasaportes = async (req, res) => {
    try {
        const pasaportes = await pasaporteModel.obtenerPasaportesActivos();
        res.status(200).json({
            success: true,
            data: pasaportes
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener pasaportes' });
    }
};

// Obtener un pasaporte por ID
export const obtenerPasaportePorId = async (req, res) => {
    const { id_pasaporte } = req.params;
    try {
        const pasaporte = await pasaporteModel.obtenerPasaportePorId(id_pasaporte);
        if (!pasaporte) {
            return res.status(404).json({ mensaje: 'Pasaporte no encontrado' });
        }
        res.status(200).json({ success: true, data: pasaporte });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener pasaporte' });
    }
};

// Insertar un nuevo pasaporte
export const insertarPasaporte = async (req, res) => {
    const { id_cliente, numero_pasaporte, pais_emision, fecha_expiracion } = req.body;
    try {
        await pasaporteModel.insertarPasaporte(id_cliente, numero_pasaporte, pais_emision, fecha_expiracion);
        res.status(201).json({ mensaje: 'Pasaporte insertado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar pasaporte' });
    }
};

// Actualizar un pasaporte existente
export const actualizarPasaporte = async (req, res) => {
    const { id_pasaporte } = req.params;
    const { id_cliente, numero_pasaporte, pais_emision, fecha_expiracion } = req.body;
    try {
        await pasaporteModel.actualizarPasaporte(id_pasaporte, id_cliente, numero_pasaporte, pais_emision, fecha_expiracion);
        res.status(200).json({ mensaje: 'Pasaporte actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar pasaporte' });
    }
};

// Eliminar un pasaporte (lógicamente)
export const eliminarPasaporte = async (req, res) => {
    const { id_pasaporte } = req.params;
    try {
        await pasaporteModel.eliminarPasaporte(id_pasaporte);
        res.status(200).json({ mensaje: 'Pasaporte eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar pasaporte' });
    }
};
