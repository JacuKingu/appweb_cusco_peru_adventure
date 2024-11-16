import * as usuariosModel from '../20240912_COD_models/20240912_COD_usuariosModel.js';
import bcrypt from 'bcrypt';

// Servicio para obtener usuarios basados en el rol
export const obtenerUsuariosPorRol = async (rol) => {
    try {
        // Llama al modelo para obtener los usuarios activos basados en el rol
        const usuarios = await usuariosModel.obtenerUsuariosActivos(rol);
        return usuarios;
    } catch (error) {
        console.error('Error en obtenerUsuariosPorRol:', error);
        throw new Error('Error al obtener usuarios por rol');
    }
};

// Servicio para obtener un usuario por ID considerando el rol
export const obtenerUsuarioPorIdYRol = async (id_usuario, rol) => {
    try {
        // Llama al modelo para obtener el usuario por ID y rol
        const usuario = await usuariosModel.obtenerUsuarioPorId(id_usuario, rol);
        if (!usuario) {
            throw new Error('Usuario no encontrado o no tienes permiso para verlo');
        }
        return usuario;
    } catch (error) {
        console.error('Error en obtenerUsuarioPorIdYRol:', error);
        throw new Error('Error al obtener el usuario por ID');
    }
};

// Servicio para insertar un nuevo usuario
export const insertarUsuario = async (nombre, contraseña, rol) => {
    try {
        // Encriptar la contraseña antes de insertarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);
        await usuariosModel.insertarUsuario(nombre, hashedPassword, rol);
    } catch (error) {
        console.error('Error en insertarUsuario:', error);
        throw new Error('Error al insertar usuario');
    }
};

// Servicio para actualizar un usuario existente
export const actualizarUsuario = async (id_usuario, nombre, contraseña, rol) => {
    try {
        // Encriptar la nueva contraseña antes de actualizar, si se proporciona
        let hashedPassword = contraseña;
        if (contraseña) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(contraseña, salt);
        }
        await usuariosModel.actualizarUsuario(id_usuario, nombre, hashedPassword, rol);
    } catch (error) {
        console.error('Error en actualizarUsuario:', error);
        throw new Error('Error al actualizar usuario');
    }
};

// Servicio para eliminar un usuario lógicamente
export const eliminarUsuario = async (id_usuario) => {
    try {
        await usuariosModel.eliminarUsuario(id_usuario);
    } catch (error) {
        console.error('Error en eliminarUsuario:', error);
        throw new Error('Error al eliminar usuario');
    }
};
