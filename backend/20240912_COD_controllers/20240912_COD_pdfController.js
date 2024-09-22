import * as pdfService from '../20240912_COD_services/20240912_COD_pdfServices.js';

// Obtener todos los PDFs activos basados en el rol
export const obtenerPdfs = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        const pdfs = await pdfService.obtenerPdfsPorRol(rol);
        res.status(200).json({
            success: true,
            data: pdfs
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener PDFs' });
    }
};

// Obtener un PDF por ID considerando el rol
export const obtenerPdfPorId = async (req, res) => {
    const { id_pdf } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const pdf = await pdfService.obtenerPdfPorIdYRol(id_pdf, rol);
        if (!pdf) {
            return res.status(404).json({ mensaje: 'PDF no encontrado o no tienes permiso para verlo' });
        }
        res.status(200).json({ success: true, data: pdf });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener PDF' });
    }
};

// Insertar un nuevo PDF
export const insertarPdf = async (req, res) => {
    const { nombre_archivo, contenido } = req.body;
    if (!nombre_archivo || !contenido) {
        return res.status(400).json({ error: 'El nombre y el contenido del archivo son requeridos' });
    }
    try {
        await pdfService.insertarPdf(nombre_archivo, contenido);
        res.status(201).json({ mensaje: 'PDF insertado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar PDF' });
    }
};

// Actualizar un PDF
export const actualizarPdf = async (req, res) => {
    const { id_pdf } = req.params;
    const { nombre_archivo, contenido } = req.body;
    try {
        await pdfService.actualizarPdf(id_pdf, nombre_archivo, contenido);
        res.status(200).json({ mensaje: 'PDF actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar PDF' });
    }
};

// Eliminar un PDF 
export const eliminarPdf = async (req, res) => {
    const { id_pdf } = req.params;
    try {
        await pdfService.eliminarPdf(id_pdf);
        res.status(200).json({ mensaje: 'PDF eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar PDF' });
    }
};
