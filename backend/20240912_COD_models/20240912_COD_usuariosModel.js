import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener usuarios activos
export const obtenerUsuariosActivos = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerUsuariosActivos()');
    const formato = rows[0].map(usuario =>{
      return{
        ...usuario,
        activo: usuario.activo[0] === 1
      };
    });
    return formato;
  } catch (error) {
    console.error('Error al obtener usuarios activos:', error);
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
