import * as usuariosModel from '../20240912_COD_models/20240912_COD_usuariosModel.js';

// Obtener todos los usuarios activos
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosModel.obtenerUsuariosActivos();
    res.status(200).json({
      sucess: true,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Insertar un nuevo usuario
export const insertarUsuario = async (req, res) => {
  const { nombre, contraseña, rol } = req.body;
  try {
    await usuariosModel.insertarUsuario(nombre, contraseña, rol);
    res.status(201).json({ mensaje: 'Usuario insertado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (req, res) => {
  const { id_usuario } = req.params
  const { nombre, contraseña, rol } = req.body;
  try {
    await usuariosModel.actualizarUsuario(id_usuario, nombre, contraseña, rol);
    res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar un usuario 
export const eliminarUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    await usuariosModel.eliminarUsuario(id_usuario);
    res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};