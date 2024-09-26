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
// pdfServices.js - Codificar el contenido en base64 antes de enviarlo
export const obtenerPdfPorIdYRol = async (id_pdf, rol) => {
    try {
        const pdf = await pdfModel.obtenerPdfPorId(id_pdf, rol);
        if (!pdf) {
            throw new Error('PDF no encontrado o no tienes permiso para verlo');
        }
        // Codificar el contenido binario en base64 antes de enviarlo
        pdf.contenido = Buffer.from(pdf.contenido).toString('base64');
        return pdf;
    } catch (error) {
        console.error('Error en obtenerPdfPorIdYRol (Servicio):', error);
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

// Servicio para actualizar un PDF existente
export const actualizarPdf = async (id_pdf, nombre_archivo, contenido) => {
    try {
        await pdfModel.actualizarPdf(id_pdf, nombre_archivo, contenido);
    } catch (error) {
        console.error('Error en actualizarPdf (Servicio):', error);
        throw new Error('Error al actualizar el PDF');
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
