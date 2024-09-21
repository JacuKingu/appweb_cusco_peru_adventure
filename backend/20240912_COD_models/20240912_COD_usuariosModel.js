import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener usuarios activos basados en el rol
export const obtenerUsuariosActivos = async (rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerUsuariosActivos(?)', [rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener usuarios activos:', error);
    throw error;
  }
};

// Obtener Usuario por ID
export const obtenerUsuarioPorId = async (id_usuario, rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerUsuarioPorId(?, ?)', [id_usuario, rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

// Insertar un nuevo usuario
export const insertarUsuario = async (nombre, contraseña, rol) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarUsuario(?, ?, ?)', [nombre, contraseña, rol]);
    return result;
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (id_usuario, nombre, contraseña, rol) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarUsuario(?, ?, ?, ?)', [id_usuario, nombre, contraseña, rol]);
    return result;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Eliminar lógicamente un usuario
export const eliminarUsuario = async (id_usuario) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarUsuario(?)', [id_usuario]);
    return result;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
