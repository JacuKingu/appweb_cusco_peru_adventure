import * as gruposService from '../20240912_COD_services/20240912_COD_gruposServices.js';

// Obtener todos los grupos activos basados en el rol
export const obtenerGrupos = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        const grupos = await gruposService.obtenerGruposPorRol(rol);
        res.status(200).json({
            success: true,
            data: grupos
        });
    } catch (error) {
        console.error('Error al obtener grupos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener un grupo por ID considerando el rol
export const obtenerGrupoPorId = async (req, res) => {
    const { id_grupo } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const grupo = await gruposService.obtenerGrupoPorIdYRol(id_grupo, rol);
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        console.error('Error al obtener grupo por ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Insertar un nuevo grupo
export const insertarGrupo = async (req, res) => {
    const { id_pdf, nombre_grupo } = req.body;
    try {
        await gruposService.insertarGrupo(id_pdf, nombre_grupo);
        res.status(201).json({ message: 'Grupo insertado exitosamente' });
    } catch (error) {
        console.error('Error al insertar grupo:', error);
        res.status(500).json({ message: error.message });
    }
};

export const insertarUltimoGrupo = async (req, res) => {
    const { id_pdf, nombre_grupo } = req.body;
    try {
        const grupo = await gruposService.insertarGrupo(id_pdf, nombre_grupo);
        console.log('este el ultimo grupo',grupo)
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        console.error('Error al insertar grupo:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Actualizar un grupo existente
export const actualizarGrupo = async (req, res) => {
    const { id_grupo } = req.params;
    const { id_pdf, nombre_grupo } = req.body;
    try {
        await gruposService.actualizarGrupo(id_grupo, id_pdf, nombre_grupo);
        res.status(200).json({ message: 'Grupo actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar grupo:', error);
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un grupo lógicamente
export const eliminarGrupo = async (req, res) => {
    const { id_grupo } = req.params;
    try {
        await gruposService.eliminarGrupo(id_grupo);
        res.status(200).json({ message: 'Grupo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar grupo:', error);
        res.status(500).json({ message: error.message });
    }
};
