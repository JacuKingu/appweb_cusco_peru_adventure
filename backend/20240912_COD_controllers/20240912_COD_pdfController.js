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
        const rol = req.usuario.rol;
        const pdf = await pdfService.obtenerPdfPorId(id_pdf, rol);
        res.status(200).json(pdf);
    } catch (error) {
        console.error('Error en obtenerPdfPorId:', error);
        res.status(500).json({ message: error.message });
    }
};


// Insertar un nuevo PDF
export const insertarPdf = async (req, res) => {
    const archivo = req.file; // Capturamos el archivo enviado por Multer   
    if (!archivo) {
        return res.status(400).json({ error: 'El archivo es requerido' });
    }

    const nombre_archivo = archivo.originalname; // El nombre original del archivo
    const contenido = archivo.buffer; // Contenido binario del archivo

    try {
        await pdfService.insertarPdf(nombre_archivo, contenido);
        res.status(201).json({ message: 'PDF insertado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar PDF' });
    }
};



// Eliminar un PDF 
export const eliminarPdf = async (req, res) => {
    const { id_pdf } = req.params;
    try {
        await pdfService.eliminarPdf(id_pdf);
        res.status(200).json({ message: 'PDF eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar PDF' });
    }
};

