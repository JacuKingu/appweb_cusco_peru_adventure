import sharp from 'sharp';
import { convert } from 'pdf-poppler';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

        await convert(pdfPath, options);

        const imagenes = fs.readdirSync(options.out_dir).filter(file => file.endsWith('.png'));

        let resultadosOcr = [];
        for (const imagen of imagenes) {
            const imagenProcesada = path.join(options.out_dir, 'processed_' + imagen);
            await procesarImagen(path.join(options.out_dir, imagen), imagenProcesada);

            const resultadoOCR = await Tesseract.recognize(imagenProcesada, 'eng+spa', {
                logger: (m) => console.log(m),
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            });
            resultadosOcr.push(resultadoOCR.data.text);
        }

        fs.unlinkSync(pdfPath);

        return resultadosOcr.join('\n');
    } catch (error) {
        console.error('Error durante la conversión o el OCR:', error);
        throw error;
    }
};



// Función para procesar un PDF y extraer los datos
export const procesarOcr = async (contenidoPdf) => {
    try {
        const resultadoOCR = await Tesseract.recognize(contenidoPdf, 'eng+spa', {
            logger: (m) => console.log(m), // Opcional: para ver el progreso
        });

        const textoExtraido = resultadoOCR.data.text;

        // Procesar el texto extraído y convertirlo en un formato útil
        const datosExtraidos = extraerDatosDelTexto(textoExtraido);

        return datosExtraidos; // Devolver los datos extraídos
    } catch (error) {
        console.error('Error durante el proceso OCR:', error);
        throw error;
    }
};

// Función para convertir el texto extraído en datos utilizables
const extraerDatosDelTexto = (texto) => {
    // Inicializar los datos a extraer
    const datos = {
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        numero_pasaporte: '',
        pais_emision: '',
        fecha_expiracion: '',
    };

    // Dividir el texto en líneas
    const lineas = texto.split('\n');

    // Expresiones regulares para diferentes patrones
    const regexNombre = /Nombre:\s*(.+)/i;
    const regexApellido = /Apellido:\s*(.+)/i;
    const regexFechaNacimiento = /Fecha de Nacimiento:\s*(\d{2}\/\d{2}\/\d{4})/i;
    const regexNumeroPasaporte = /Número de Pasaporte:\s*([A-Za-z0-9]+)/i;
    const regexPaisEmision = /País de Emisión:\s*(.+)/i;
    const regexFechaExpiracion = /Fecha de Expiración:\s*(\d{2}\/\d{2}\/\d{4})/i;

    // Recorrer las líneas y buscar coincidencias
    lineas.forEach((linea) => {
        // Buscar nombre
        const nombreMatch = linea.match(regexNombre);
        if (nombreMatch) {
            datos.nombre = nombreMatch[1].trim();
        }

        // Buscar apellido
        const apellidoMatch = linea.match(regexApellido);
        if (apellidoMatch) {
            datos.apellido = apellidoMatch[1].trim();
        }

        // Buscar fecha de nacimiento
        const fechaNacimientoMatch = linea.match(regexFechaNacimiento);
        if (fechaNacimientoMatch) {
            datos.fecha_nacimiento = fechaNacimientoMatch[1].trim();
        }

        // Buscar número de pasaporte
        const numeroPasaporteMatch = linea.match(regexNumeroPasaporte);
        if (numeroPasaporteMatch) {
            datos.numero_pasaporte = numeroPasaporteMatch[1].trim();
        }

        // Buscar país de emisión
        const paisEmisionMatch = linea.match(regexPaisEmision);
        if (paisEmisionMatch) {
            datos.pais_emision = paisEmisionMatch[1].trim();
        }

        // Buscar fecha de expiración
        const fechaExpiracionMatch = linea.match(regexFechaExpiracion);
        if (fechaExpiracionMatch) {
            datos.fecha_expiracion = fechaExpiracionMatch[1].trim();
        }
    });

    return datos;
};
