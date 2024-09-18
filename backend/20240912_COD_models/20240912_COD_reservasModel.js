import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener reservas activas
export const obtenerReservasActivas = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerReservasActivas()');
    return rows;
  } catch (error) {
    console.error('Error al obtener reservas activas:', error);
    throw error;
  }
};

// Insertar una nueva reserva
export const insertarReserva = async (id_cliente, id_tour, estado) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarReserva(?, ?, ?)', [id_cliente, id_tour, estado]);
    return result;
  } catch (error) {
    console.error('Error al insertar reserva:', error);
    throw error;
  }
};

// Actualizar una reserva existente
export const actualizarReserva = async (id_reserva, id_cliente, id_tour, estado) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarReserva(?, ?, ?, ?)', [id_reserva, id_cliente, id_tour, estado]);
    return result;
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    throw error;
  }
};

// Eliminar lógicamente una reserva
export const eliminarReserva = async (id_reserva) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarReserva(?)', [id_reserva]);
    return result;
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    throw error;
  }
};
