import * as usuariosModel from '../20240912_COD_models/20240912_COD_usuariosModel.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios activos
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosModel.obtenerUsuariosActivos();
    res.status(200).json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const usuario = await usuariosModel.obtenerUsuarioPorId(id_usuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener usuario' });
  }
};

// Insertar un nuevo usuario
export const insertarUsuario = async (req, res) => {
  const { nombre, contraseña, rol } = req.body;
  try {
    // Encriptar la contraseña antes de insertar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    await usuariosModel.insertarUsuario(nombre, hashedPassword, rol);
    res.status(201).json({ mensaje: 'Usuario insertado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, contraseña, rol } = req.body;
  try {
    // Encriptar la nueva contraseña antes de actualizar, si se proporciona
    let hashedPassword = contraseña;
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(contraseña, salt);
    }
    await usuariosModel.actualizarUsuario(id_usuario, nombre, hashedPassword, rol);
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
