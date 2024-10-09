import * as usuariosService from '../20240912_COD_services/20240912_COD_usuariosServices.js';


// Obtener todos los usuarios activos basados en el rol
export const obtenerUsuarios = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Rol del usuario autenticado
        const usuarios = await usuariosService.obtenerUsuariosPorRol(rol);
        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener un usuario por ID considerando el rol
export const obtenerUsuarioPorId = async (req, res) => {
    const { id_usuario } = req.params;
    const rol = req.usuario.rol; // Rol del usuario autenticado

    try {
        const usuario = await usuariosService.obtenerUsuarioPorIdYRol(id_usuario, rol);
        res.status(200).json({ success: true, data: usuario });
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Insertar un nuevo usuario
export const insertarUsuario = async (req, res) => {
    const { nombre, contraseña, rol } = req.body;
    try {
        await usuariosService.insertarUsuario(nombre, contraseña, rol);
        res.status(201).json({ message: 'Usuario insertado exitosamente' });
    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    const { nombre, contraseña, rol } = req.body;
    try {
        await usuariosService.actualizarUsuario(id_usuario, nombre, contraseña, rol);
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un usuario lógicamente
export const eliminarUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        await usuariosService.eliminarUsuario(id_usuario);
        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: error.message });
    }
};
