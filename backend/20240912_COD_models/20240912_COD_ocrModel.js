import { connection } from "../20240912_COD_db/20240912_COD_dbConnection.js";

// Registrar un nuevo proceso OCR
export const registrarProcesoOCR = async (id_pdf, estado, mensaje) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute(
            'INSERT INTO ocr_procesos (id_pdf, estado, mensaje) VALUES (?, ?, ?)',
            [id_pdf, estado, mensaje]
        );
        return result;
    } catch (error) {
        console.error('Error al registrar proceso OCR:', error);
        throw error;
    }
};

// Actualizar estado del proceso OCR
export const actualizarEstadoOCR = async (id_proceso, estado, mensaje) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute(
            'UPDATE ocr_procesos SET estado = ?, mensaje = ? WHERE id_proceso = ?',
            [estado, mensaje, id_proceso]
        );
        return result;
    } catch (error) {
        console.error('Error al actualizar estado del proceso OCR:', error);
        throw error;
    }
};
