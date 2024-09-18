import * as pasaporteModel from '../20240912_COD_models/20240912_COD_pasaporteModel.js';

// Obtener todos los pasaportes activos
export const obtenerPasaportes = async (req, res) => {
    try {
        const pasaportes = await pasaporteModel.obtenerPasaportesActivos();
        res.status(200).json(pasaportes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pasaportes' });
    }
};

// Insertar un nuevo pasaporte
export const insertarPasaporte = async (req, res) => {
    const { id_cliente, numeroPasaporte, paisEmision, fechaExpiracion } = req.body;
    try {
        await pasaporteModel.insertarPasaporte(id_cliente, numeroPasaporte, paisEmision, fechaExpiracion);
        res.status(201).json({ mensaje: 'Pasaporte insertado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar pasaporte' });
    }
};

// Actualizar un pasaporte existente
export const actualizarPasaporte = async (req, res) => {
    const { id_pasaporte } = req.params;
    const { id_cliente, numeroPasaporte, paisEmision, fechaExpiracion } = req.body;
    try {
        await pasaporteModel.actualizarPasaporte(id_pasaporte, id_cliente, numeroPasaporte, paisEmision, fechaExpiracion);
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
