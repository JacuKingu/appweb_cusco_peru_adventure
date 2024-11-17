import * as pdfService from '../20240912_COD_services/20240912_COD_pdfServices.js';
import * as ocrService from '../20240912_COD_services/20240912_COD_OcrService.js';
import path from 'path';
import fs from 'fs';
import { convert } from 'pdf-poppler';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const procesarOcrDePdf = async (req, res, grupo, nuevoPdf) => {
    /* const { id_pdf } = req.params; */

    try {
        // Recuperar el PDF desde la base de datos
        const pdf = await pdfService.obtenerPdfPorId(nuevoPdf, req.usuario.rol);
        if (!pdf) {
            return res.status(404).json({ message: 'PDF no encontrado' });
        }

        // Crear el directorio 'uploads' si no existe
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Guardar temporalmente el PDF para procesarlo
        const pdfPath = path.join(uploadDir, 'temp.pdf');
        fs.writeFileSync(pdfPath, pdf.contenido);

        // Convertir el PDF a imágenes JPEG usando pdf-poppler
        const options = {
            format: 'jpeg',  // Mantén 'jpeg' como formato
            out_dir: path.dirname(pdfPath),
            out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
            page: null // Convertir todas las páginas
        };

        // Realizar la conversión del PDF
        await convert(pdfPath, options);

        // Obtener la lista de imágenes generadas
        const imagenes = fs.readdirSync(options.out_dir)
            .filter(file => file.endsWith('.jpg'))  // Filtramos las imágenes .jpg
            .map(file => {
                // Renombrar las imágenes de .jpg a .jpeg
                const newFilePath = path.join(options.out_dir, file.replace('.jpg', '.jpeg'));
                const oldFilePath = path.join(options.out_dir, file);
                fs.renameSync(oldFilePath, newFilePath);  // Renombrar archivo
                return newFilePath;  // Retorna la ruta con la nueva extensión
            });

        // Mostrar las rutas de las imágenes renombradas
        console.log('Imágenes generadas y renombradas a .jpeg:', imagenes);

        // Llamar al servicio para procesar todas las imágenes generadas
        const resultadosOcr = await ocrService.procesarImagenes(imagenes);
        await ocrService.guardarClientesYPasaportes(resultadosOcr, grupo);
        console.log('este es el resultado ocr: ', resultadosOcr)

        // Eliminar el PDF temporal y las imágenes generadas después del procesamiento
        fs.unlinkSync(pdfPath);
        imagenes.forEach(imagen => fs.unlinkSync(imagen));

        // Enviar los resultados del OCR como respuesta
        res.status(200).json({
            message: 'Procesamiento OCR completado con éxito',
            data: resultadosOcr
        });

    } catch (error) {
        console.error('Error al procesar OCR de PDF:', error);
        res.status(500).json({ message: 'Error al procesar OCR de PDF' });
    }
};