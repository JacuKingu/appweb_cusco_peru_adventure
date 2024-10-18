import { connection } from "../20240912_COD_db/20240912_COD_dbConnection.js";

// Obtener PDFs activos basados en el rol
export const obtenerPdfsActivos = async (rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerPdfsActivos(?)', [rol]);
    return rows[0];
  } catch (error) {
    console.error('Error al obtener PDFs activos:', error);
    throw error;
  }
};

// Obtener PDF por ID
export const obtenerPdfPorId = async (id_pdf, rol) => {
  try {
    const pool = await connection;
    const [rows] = await pool.execute('CALL obtenerPdfPorId(?, ?)', [id_pdf, rol]);
    if (rows.length === 0) {
      throw new Error('PDF no encontrado');
    }

    const pdf = rows[0][0];
    
    // Verifica si el PDF es un buffer válido
    if (!Buffer.isBuffer(pdf.contenido)) {
      throw new Error('El PDF recuperado no es un buffer válido.');
    }

    return pdf; // Retornar el buffer del PDF
  } catch (error) {
    console.error('Error al obtener PDF por ID:', error);
    throw error;
  }
};

// Insertar un nuevo PDF
export const insertarPdf = async (nombre_archivo, contenido) => {
  try {
    const pool = await connection;
    const [result] = await pool.execute('CALL insertarPdf(?, ?)', [nombre_archivo, contenido]);
    return result;
  } catch (error) {
    console.error('Error al insertar PDF:', error);
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
