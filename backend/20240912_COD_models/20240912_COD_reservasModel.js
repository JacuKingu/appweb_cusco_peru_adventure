import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js'

// Obtener reservas activas basadas en el rol
export const obtenerReservasActivas = async (rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerReservasActivas(?)', [rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener reservas activas:', error);
    throw error;
  }
};

// Obtener Reserva por ID
export const obtenerReservaPorId = async (id_reserva, rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerReservaPorId(?, ?)', [id_reserva, rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener reserva por ID:', error);
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
