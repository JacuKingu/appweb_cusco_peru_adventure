import * as pdfService from '../20240912_COD_services/20240912_COD_pdfServices.js';
import * as ocrService from '../20240912_COD_services/20240912_COD_OcrService.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const procesarOcrDePdf = async (req, res, grupo, nuevoPdf) => {
    const imagenPaths = []; // Almacenar rutas de imágenes para limpieza posterior
    try {
        // Recuperar el PDF desde la base de datos
        const pdf = await pdfService.obtenerPdfPorId(nuevoPdf, req.usuario.rol);
        if (!pdf) {
            return res.status(404).json({ message: 'PDF no encontrado' });
        }

        // Enviar el contenido del PDF como un archivo binario al microservicio en Python
        const microservicioUrl = 'https://appweb-turismo-pdf.onrender.com/convert-pdf';  // URL de tu microservicio Python

        const response = await axios.post(microservicioUrl, pdf.contenido, {
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            responseType: 'json', // Esperamos una respuesta JSON con las imágenes en base64
        });

        // Verificar si el microservicio devolvió imágenes
        if (response.data.images) {
            const imagenesBase64 = response.data.images;

            // Guardar las imágenes recibidas en Base64 en el servidor
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            // Guardar cada imagen en el directorio 'uploads'
            for (let i = 0; i < imagenesBase64.length; i++) {
                const imageBuffer = Buffer.from(imagenesBase64[i], 'base64');
                const imagePath = path.join(uploadDir, `imagen_${i + 1}.jpeg`);
                fs.writeFileSync(imagePath, imageBuffer);
                imagenPaths.push(imagePath);
            }

            // Aquí llamas a tu servicio de OCR (con la lista de imágenes generadas)
            const resultadosOcr = await ocrService.procesarImagenes(imagenPaths);
            await ocrService.guardarClientesYPasaportes(resultadosOcr, grupo);

            // Enviar los resultados del OCR como respuesta
            res.status(200).json({
                message: 'Procesamiento OCR completado con éxito',
                data: resultadosOcr
            });
        } else {
            return res.status(500).json({ message: 'Error al procesar las imágenes del PDF' });
        }
    }  
    catch (error) {
        console.error('Error al procesar OCR de PDF:', error);
        return res.status(500).json({ message: 'Error al procesar OCR de PDF' });
    }  
    finally {
        // Eliminar las imágenes generadas después de usarlas
        for (const imagePath of imagenPaths) {
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath); // Elimina el archivo
                }
            } catch (err) {
                console.error(`Error al eliminar la imagen ${imagePath}:`, err);
            }
        }
    }
};
