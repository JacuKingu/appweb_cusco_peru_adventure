import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener grupos activos
export const obtenerGruposActivos = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerGruposActivos()');
    return rows;
  } catch (error) {
    console.error('Error al obtener grupos activos:', error);
    throw error;
  }
};

// Insertar un nuevo grupo
export const insertarGrupo = async (id_pdf, nombre_grupo) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarGrupo(?, ?)', [id_pdf, nombre_grupo]);
    return result;
  } catch (error) {
    console.error('Error al insertar grupo:', error);
    throw error;
  }
};

// Actualizar un grupo existente
export const actualizarGrupo = async (id_grupo, id_pdf, nombre_grupo) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarGrupo(?, ?, ?)', [id_grupo, id_pdf, nombre_grupo]);
    return result;
  } catch (error) {
    console.error('Error al actualizar grupo:', error);
    throw error;
  }
};

// Eliminar lógicamente un grupo
export const eliminarGrupo = async (id_grupo) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarGrupo(?)', [id_grupo]);
    return result;
  } catch (error) {
    console.error('Error al eliminar grupo:', error);
    throw error;
  }
};
