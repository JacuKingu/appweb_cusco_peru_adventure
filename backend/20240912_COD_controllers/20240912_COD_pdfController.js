import * as pdfModel from '../20240912_COD_models/20240912_COD_pdfModel.js';

// Obtener todos los PDFs activos
export const obtenerPdfs = async (req, res) => {
    try {
        const pdfs = await pdfModel.obtenerPdfsActivos();
        res.status(200).json(pdfs);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener PDFs' });
    }
};

// Insertar un nuevo PDF
export const insertarPdf = async (req, res) => {
    const { nombre_archivo, contenido } = req.body;
    try {
        await pdfModel.insertarPdf(nombre_archivo, contenido);
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
        await pdfModel.actualizarPdf(id_pdf, nombre_archivo, contenido);
        res.status(200).json({ mensaje: 'PDF actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar PDF' });
    }
};

// Eliminar un PDF 
export const eliminarPdf = async (req, res) => {
    const { id_pdf } = req.params;
    try {
        await pdfModel.eliminarPdf(id_pdf);
        res.status(200).json({ mensaje: 'PDF eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar PDF' });
    }
};
