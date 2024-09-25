import * as gruposModel from '../20240912_COD_models/20240912_COD_gruposModel.js';

// Servicio para obtener todos los grupos activos basados en el rol
export const obtenerGruposPorRol = async (rol) => {
    try {
        const grupos = await gruposModel.obtenerGruposActivos(rol);
        return grupos;
    } catch (error) {
        console.error('Error en obtenerGruposPorRol (Servicio):', error);
        throw new Error('Error al obtener los grupos activos');
    }
};

// Servicio para obtener un grupo por ID considerando el rol
export const obtenerGrupoPorIdYRol = async (id_grupo, rol) => {
    try {
        const grupo = await gruposModel.obtenerGrupoPorId(id_grupo, rol);
        if (!grupo) {
            throw new Error('Grupo no encontrado o no tienes permiso para verlo');
        }
        return grupo;
    } catch (error) {
        console.error('Error en obtenerGrupoPorIdYRol (Servicio):', error);
        throw new Error('Error al obtener el grupo por ID');
    }
};

// Servicio para insertar un nuevo grupo
export const insertarGrupo = async (id_pdf, nombre_grupo) => {
    try {
        await gruposModel.insertarGrupo(id_pdf, nombre_grupo);
    } catch (error) {
        console.error('Error en insertarGrupo (Servicio):', error);
        throw new Error('Error al insertar el grupo');
    }
};

// Servicio para actualizar un grupo existente
export const actualizarGrupo = async (id_grupo, id_pdf, nombre_grupo) => {
    try {
        await gruposModel.actualizarGrupo(id_grupo, id_pdf, nombre_grupo);
    } catch (error) {
        console.error('Error en actualizarGrupo (Servicio):', error);
        throw new Error('Error al actualizar el grupo');
    }
};

// Servicio para eliminar un grupo lógicamente
export const eliminarGrupo = async (id_grupo) => {
    try {
        await gruposModel.eliminarGrupo(id_grupo);
    } catch (error) {
        console.error('Error en eliminarGrupo (Servicio):', error);
        throw new Error('Error al eliminar el grupo');
    }
};
