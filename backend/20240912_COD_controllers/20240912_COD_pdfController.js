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
    try {
        const { id_pdf } = req.params;
        const { rol } = req.query;
        const pdf = await pdfService.obtenerPdfPorIdYRol(id_pdf, rol);
        res.status(200).json(pdf);
    } catch (error) {
        console.error('Error en obtenerPdfPorId:', error);
        res.status(500).json({ message: error.message });
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

// Cargar un nuevo PDF y guardarlo en la base de datos
export const cargarPdf = async (req, res) => {
    try {
        const archivo = req.file.originalname; // Nombre del archivo
        const contenido = req.file.buffer; // Contenido del archivo en formato BLOB

        // Insertar el archivo en la base de datos
        await pdfService.insertarPdf(archivo, contenido);

        res.status(201).json({ mensaje: 'PDF cargado exitosamente' });
    } catch (error) {
        console.error('Error al cargar PDF:', error);
        res.status(500).json({ error: 'Error al cargar PDF' });
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
