import { connection } from "../20240912_COD_db/20240912_COD_dbConnection.js";

// Obtener PDFs activos
export const obtenerPdfsActivos = async () => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerPdfsActivos()');
    return rows;
  } catch (error) {
    console.error('Error al obtener PDFs activos:', error);
    throw error;
  }
};

// Insertar un nuevo PDF
export const insertarPdf = async (nombreArchivo, contenido) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarPdf(?, ?)', [nombreArchivo, contenido]);
    return result;
  } catch (error) {
    console.error('Error al insertar PDF:', error);
    throw error;
  }
};

// Actualizar un PDF existente
export const actualizarPdf = async (id_pdf, nuevoNombreArchivo, nuevoContenido) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL actualizarPdf(?, ?, ?)', [id_pdf, nuevoNombreArchivo, nuevoContenido]);
    return result;
  } catch (error) {
    console.error('Error al actualizar PDF:', error);
    throw error;
  }
};

// Eliminar lógicamente un PDF
export const eliminarPdf = async (id_pdf) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL eliminarPdf(?)', [id_pdf]);
    return result;
  } catch (error) {
    console.error('Error al eliminar PDF:', error);
    throw error;
  }
};
