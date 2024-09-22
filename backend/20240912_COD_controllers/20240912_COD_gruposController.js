import * as gruposModel from '../20240912_COD_models/20240912_COD_gruposModel.js';

// Obtener todos los grupos activos
export const obtenerGrupos = async (req, res) => {
    try {
        const grupos = await gruposModel.obtenerGruposActivos();
        res.status(200).json({
            success: true,
            data: grupos
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener grupos' });
    }
};

// Obtener un grupo por ID
export const obtenerGrupoPorId = async (req, res) => {
    const { id_grupo } = req.params;
    const rol = req.usuario.rol
    try {
        const grupo = await gruposModel.obtenerGrupoPorId(id_grupo,rol);
        if (!grupo) {
            return res.status(404).json({ mensaje: 'Grupo no encontrado o no tienes permiso para verlo' });
        }
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener grupo' });
    }
};

// Insertar un nuevo grupo
export const insertarGrupo = async (req, res) => {
    const { id_pdf, nombre_grupo } = req.body;
    try {
        await gruposModel.insertarGrupo(id_pdf, nombre_grupo);
        res.status(201).json({ mensaje: 'Grupo insertado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar grupo' });
    }
};

// Actualizar un grupo existente
export const actualizarGrupo = async (req, res) => {
    const { id_grupo } = req.params;
    const { id_pdf, nombre_grupo } = req.body;
    try {
        await gruposModel.actualizarGrupo(id_grupo, id_pdf, nombre_grupo);
        res.status(200).json({ mensaje: 'Grupo actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar grupo' });
    }
};

// Eliminar un grupo (lógicamente)
export const eliminarGrupo = async (req, res) => {
    const { id_grupo } = req.params;
    try {
        await gruposModel.eliminarGrupo(id_grupo);
        res.status(200).json({ mensaje: 'Grupo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar grupo' });
    }
};
