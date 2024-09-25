import { procesarPDFCompleto } from '../20240912_COD_services/20240912_COD_ocrServices.js';

export const procesarPDF = async (req, res) => {
    try {
        const id_pdf = req.body.id_pdf; // Solo se espera recibir el id_pdf
        if (!id_pdf) {
            return res.status(400).json({ error: 'El campo id_pdf es obligatorio.' });
        }
        console.log(`Iniciando procesamiento de PDF con id_pdf: ${id_pdf}`);
        await procesarPDFCompleto(null, id_pdf); // pdfPath ahora puede ser null o se omite
        res.status(200).json({ message: 'PDF procesado exitosamente' });
    } catch (error) {
        console.error('Error al procesar PDF:', error);
        res.status(500).json({ error: `Error al procesar PDF: ${error.message}` });
    }
};
