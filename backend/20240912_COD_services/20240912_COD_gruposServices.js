import * as gruposModel from '../20240912_COD_models/20240912_COD_gruposModel.js';
import axios from 'axios';

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

export const insertarUltimoGrupo = async (id_pdf, nombre_grupo) => {
    try {
        const ultimo = await gruposModel.insertarUltimoGrupo(id_pdf, nombre_grupo);
        return ultimo[0]
    } catch (error) {
        console.error('Error en insertarGrupo (Servicio):', error);
        throw new Error('Error al insertar el grupo');
    }
};

// Servicio para obtener las edades de los clientes de un grupo
export const obtenerEdadesPorGrupo = async (id_grupo) => {
    try {
        const edades = await gruposModel.obtenerEdadesPorGrupo(id_grupo);
        return edades;
    } catch (error) {
        console.error('Error en obtenerEdadesPorGrupo (Servicio):', error);
        throw new Error('Error al obtener las edades del grupo');
    }
};

// Servicio para hacer el POST al microservicio que ingresa las edades
export const procesarEdades = async (edades) => {
    try {
        const response = await axios.post('http://localhost:5000/recomendar_tour', { edades });
        return response.data;
    } catch (error) {
        console.error('Error al ingresar edades (Servicio):', error);
        throw new Error('Error al comunicarse con el microservicio POST');
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
