import { connection } from "../20240912_COD_db/20240912_COD_dbConnection.js";

// Obtener tours activos
export const obtenerToursActivos = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerToursActivos()');
    return rows;
  } catch (error) {
    console.error('Error al obtener tours activos:', error);
    throw error;
  }
};

// Insertar un nuevo tour
export const insertarTour = async (nombre, descripcion, duracion, precio, categoria) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarTour(?, ?, ?, ?, ?)', [nombre, descripcion, duracion, precio, categoria]);
    return result;
  } catch (error) {
    console.error('Error al insertar tour:', error);
    throw error;
  }
};

// Actualizar un tour existente
export const actualizarTour = async (id_tour, nombre, descripcion, duracion, precio, categoria) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarTour(?, ?, ?, ?, ?, ?)', [id_tour, nombre, descripcion, duracion, precio, categoria]);
    return result;
  } catch (error) {
    console.error('Error al actualizar tour:', error);
    throw error;
  }
};

// Eliminar lógicamente un tour
export const eliminarTour = async (id_tour) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarTour(?)', [id_tour]);
    return result;
  } catch (error) {
    console.error('Error al eliminar tour:', error);
    throw error;
  }
};
