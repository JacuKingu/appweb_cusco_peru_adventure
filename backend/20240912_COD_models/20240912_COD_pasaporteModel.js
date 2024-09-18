import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener pasaportes activos
export const obtenerPasaportesActivos = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerPasaportesActivos()');
    return rows;
  } catch (error) {
    console.error('Error al obtener pasaportes activos:', error);
    throw error;
  }
};

// Insertar un nuevo pasaporte
export const insertarPasaporte = async (id_cliente, numeroPasaporte, paisEmision, fechaExpiracion) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarPasaporte(?, ?, ?, ?)', [id_cliente, numeroPasaporte, paisEmision, fechaExpiracion]);
    return result;
  } catch (error) {
    console.error('Error al insertar pasaporte:', error);
    throw error;
  }
};

// Actualizar un pasaporte existente
export const actualizarPasaporte = async (id_pasaporte, id_cliente, numeroPasaporte, paisEmision, fechaExpiracion) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarPasaporte(?, ?, ?, ?, ?)', [id_pasaporte, id_cliente, numeroPasaporte, paisEmision, fechaExpiracion]);
    return result;
  } catch (error) {
    console.error('Error al actualizar pasaporte:', error);
    throw error;
  }
};

// Eliminar lógicamente un pasaporte
export const eliminarPasaporte = async (id_pasaporte) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarPasaporte(?)', [id_pasaporte]);
    return result;
  } catch (error) {
    console.error('Error al eliminar pasaporte:', error);
    throw error;
  }
};
