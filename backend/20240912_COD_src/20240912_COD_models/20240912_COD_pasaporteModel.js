import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener pasaportes activos basados en el rol
export const obtenerPasaportesActivos = async (rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerPasaportesActivos(?)', [rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener pasaportes activos:', error);
    throw error;
  }
};

// Obtener Pasaporte por ID
export const obtenerPasaportePorId = async (id_pasaporte, rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerPasaportePorId(?, ?)', [id_pasaporte, rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener pasaporte por ID:', error);
    throw error;
  }
};

// Insertar un nuevo pasaporte
export const insertarPasaporte = async (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarPasaporte(?, ?, ?, ?)', [id_cliente, numero_pasaporte, pais_emision, fecha_expiracion]);
    return result;
  } catch (error) {
    console.error('Error al insertar pasaporte:', error);
    throw error;
  }
};

// Actualizar un pasaporte existente
export const actualizarPasaporte = async (id_pasaporte, id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarPasaporte(?, ?, ?, ?, ?)', [id_pasaporte, id_cliente, numero_pasaporte, pais_emision, fecha_expiracion]);
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
