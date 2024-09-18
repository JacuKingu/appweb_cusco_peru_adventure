import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener usuarios activos
export const obtenerUsuariosActivos = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerUsuariosActivos()');
    return rows;
  } catch (error) {
    console.error('Error al obtener usuarios activos:', error);
    throw error;
  }
};

// Insertar un nuevo usuario
export const insertarUsuario = async (nombreUsuario, contraseña, rol) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarUsuario(?, ?, ?)', [nombreUsuario, contraseña, rol]);
    return result;
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    throw error;
  }
};

// Actualizar un usuario existente
export const actualizarUsuario = async (idUsuario, nombreUsuario, contraseña, rol) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarUsuario(?, ?, ?, ?)', [idUsuario, nombreUsuario, contraseña, rol]);
    return result;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Eliminar lógicamente un usuario
export const eliminarUsuario = async (idUsuario) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarUsuario(?)', [idUsuario]);
    return result;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
