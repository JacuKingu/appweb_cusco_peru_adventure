import * as pdfModel from '../20240912_COD_models/20240912_COD_pdfModel.js';

// Servicio para obtener todos los PDFs activos basados en el rol
export const obtenerPdfsPorRol = async (rol) => {
    try {
        const pdfs = await pdfModel.obtenerPdfsActivos(rol);
        return pdfs;
    } catch (error) {
        console.error('Error en obtenerPdfsPorRol (Servicio):', error);
        throw new Error('Error al obtener los PDFs activos');
    }
};

// Servicio para obtener un PDF por ID considerando el rol
export const obtenerPdfPorId = async (id_pdf, rol) => {
    try {
        const pdf = await pdfModel.obtenerPdfPorId(id_pdf, rol);
        if (!pdf) {
            throw new Error('PDF no encontrado o no tienes permiso para verlo');
        }
        return pdf;
    } catch (error) {
        console.error('Error en obtenerPdfPorId (Servicio):', error);
        throw new Error('Error al obtener el PDF por ID');
    }
};


// Servicio para insertar un nuevo PDF
export const insertarPdf = async (nombre_archivo, contenido) => {
    try {
        await pdfModel.insertarPdf(nombre_archivo, contenido);
    } catch (error) {
        console.error('Error en insertarPdf (Servicio):', error);
        throw new Error('Error al insertar el PDF');
    }
};

// Servicio para eliminar un PDF lógicamente
export const eliminarPdf = async (id_pdf) => {
    try {
        await pdfModel.eliminarPdf(id_pdf);
    } catch (error) {
        console.error('Error en eliminarPdf (Servicio):', error);
        throw new Error('Error al eliminar el PDF');
    }
};
