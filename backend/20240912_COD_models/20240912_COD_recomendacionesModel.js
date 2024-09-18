import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener recomendaciones activas
export const obtenerRecomendacionesActivas = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerRecomendacionesActivas()');
    return rows;
  } catch (error) {
    console.error('Error al obtener recomendaciones activas:', error);
    throw error;
  }
};

// Insertar una nueva recomendación
export const insertarRecomendacion = async (id_cliente, id_tour, contenido) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarRecomendacion(?, ?, ?)', [id_cliente, id_tour, contenido]);
    return result;
  } catch (error) {
    console.error('Error al insertar recomendación:', error);
    throw error;
  }
};

// Actualizar una recomendación existente
export const actualizarRecomendacion = async (id_recomendacion, id_cliente, id_tour, contenido) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarRecomendacion(?, ?, ?, ?)', [id_recomendacion, id_cliente, id_tour, contenido]);
    return result;
  } catch (error) {
    console.error('Error al actualizar recomendación:', error);
    throw error;
  }
};

// Eliminar lógicamente una recomendación
export const eliminarRecomendacion = async (id_recomendacion) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarRecomendacion(?)', [id_recomendacion]);
    return result;
  } catch (error) {
    console.error('Error al eliminar recomendación:', error);
    throw error;
  }
};
