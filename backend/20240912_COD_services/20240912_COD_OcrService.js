import sharp from 'sharp';
import { convert } from 'pdf-poppler';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import { path, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const procesarImagen = async (inputPath, outputPath) => {
    await sharp(inputPath)
        .greyscale() // Convertir a escala de grises
        .normalize() // Normalizar la imagen para mayor claridad
        .toFile(outputPath);
};

export const procesarPdf = async (pdfBuffer) => {
    try {
        const pdfPath = path.join(__dirname, 'temp.pdf');
        fs.writeFileSync(pdfPath, pdfBuffer);

        const options = {
            format: 'png',
            out_dir: path.dirname(pdfPath),
            out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
            page: null,
        };

        // Convertir el PDF a imágenes PNG
        await convert(pdfPath, options);

        // Obtener los nombres de las imágenes generadas
        const imagenes = fs.readdirSync(options.out_dir).filter(file => file.endsWith('.png'));

        let resultadosOcr = [];
        for (const imagen of imagenes) {
            const imagenProcesada = path.join(options.out_dir, 'processed_' + imagen);
            await procesarImagen(path.join(options.out_dir, imagen), imagenProcesada);

            // Realizar OCR en la imagen procesada
            const resultadoOCR = await Tesseract.recognize(imagenProcesada, 'eng+spa', {
                logger: (m) => console.log(m),
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            });
            resultadosOcr.push(resultadoOCR.data.text);

            // Eliminar la imagen después del procesamiento
            fs.unlinkSync(imagenProcesada);
            fs.unlinkSync(path.join(options.out_dir, imagen)); // Eliminar la imagen original
        }

        // Eliminar el archivo PDF temporal
        fs.unlinkSync(pdfPath);

        return resultadosOcr.join('\n'); // Retornar el texto extraído
    } catch (error) {
        console.error('Error durante la conversión o el OCR:', error);
        throw error;
    }
};

// Función para convertir el texto extraído en datos utilizables
export const extraerDatosDelTexto = (texto) => {
    const datos = {
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        numero_pasaporte: '',
        pais_emision: '',
        fecha_expiracion: '',
    };

    // Expresiones regulares mejoradas para DNI/Pasaporte
    const regexNombre = /Pre Nombres\s*([A-Za-z\s]+)/i;
    const regexApellido = /Primer Apellido\s*([A-Za-z\s]+)\nSegundo Apellido\s*([A-Za-z\s]+)/i;
    const regexFechaNacimiento = /Nacimiento:\s*(\d{2}\/\d{2}\/\d{4})/i;
    const regexNumeroPasaporte = /DNI\s*(\d+)/i;
    const regexPaisEmision = /País de Emisión\s*([A-Za-z]+)/i;
    const regexFechaExpiracion = /Fecha Caducidad\s*(\d{2}\/\d{2}\/\d{4})/i;

    // Aplicar expresiones regulares
    const nombreMatch = texto.match(regexNombre);
    if (nombreMatch) datos.nombre = nombreMatch[1].trim();

    const apellidoMatch = texto.match(regexApellido);
    if (apellidoMatch) datos.apellido = `${apellidoMatch[1].trim()} ${apellidoMatch[2].trim()}`;

    const fechaNacimientoMatch = texto.match(regexFechaNacimiento);
    if (fechaNacimientoMatch) datos.fecha_nacimiento = fechaNacimientoMatch[1];

    const numeroPasaporteMatch = texto.match(regexNumeroPasaporte);
    if (numeroPasaporteMatch) datos.numero_pasaporte = numeroPasaporteMatch[1];

    const paisEmisionMatch = texto.match(regexPaisEmision);
    if (paisEmisionMatch) datos.pais_emision = paisEmisionMatch[1];

    const fechaExpiracionMatch = texto.match(regexFechaExpiracion);
    if (fechaExpiracionMatch) datos.fecha_expiracion = fechaExpiracionMatch[1];

    return datos;
};

