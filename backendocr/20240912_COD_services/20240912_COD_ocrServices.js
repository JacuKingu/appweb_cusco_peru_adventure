import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { registrarProcesoOCR, actualizarEstadoOCR } from '../20240912_COD_models/20240912_COD_ocrModel.js';
import { insertarCliente } from '../20240912_COD_models/20240912_COD_clientesModel.js';
import { insertarPasaporte } from '../20240912_COD_models/20240912_COD_pasaporteModel.js';
import { obtenerPdfPorId } from '../20240912_COD_models/20240912_COD_pdfModel.js';

// Extraer imágenes del PDF
export const extraerImagenesDePDF = async (pdfPath) => {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const paginas = pdfDoc.getPages();
    let imagenes = [];

    for (let i = 0; i < paginas.length; i++) {
        const pagina = paginas[i];
        const xObjects = pagina.node.XObject || {};

        for (const [nombre, xObject] of Object.entries(xObjects)) {
            if (xObject.constructor.name === 'PDFImage') {
                const imagenBytes = xObject.imageData;
                const fileName = `imagen_extraida_${i}_${nombre}.png`;
                fs.writeFileSync(fileName, imagenBytes);
                imagenes.push(fileName);
            }
        }
    }
    return imagenes;
};

// Preprocesar imagen
export const preprocesarImagen = async (imagePath) => {
    const processedPath = `preprocesada_${imagePath}`;
    await sharp(imagePath)
        .grayscale()
        .normalize()
        .resize({ width: 1000 })
        .toFile(processedPath);
    return processedPath;
};

// Extraer texto de la imagen usando Tesseract
export const extraerTextoDeImagen = async (imagePath) => {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'spa', {
        logger: m => console.log(m)
    });
    return text;
};

// Mapear datos extraídos a los modelos
export const mapearDatosOCR = (texto) => {
    const datos = {};
    // Expresiones regulares para extraer los datos
    const nombreMatch = texto.match(/(?<=Nombre:)\s*(\w+)/i);
    const apellidoMatch = texto.match(/(?<=Apellido:)\s*(\w+)/i);
    const fechaNacimientoMatch = texto.match(/(?<=Fecha de Nacimiento:)\s*(\d{2}\/\d{2}\/\d{4})/i);
    const numeroPasaporteMatch = texto.match(/(?<=Número de Pasaporte:)\s*(\w+)/i);
    datos.nombre = nombreMatch ? nombreMatch[1] : null;
    datos.apellido = apellidoMatch ? apellidoMatch[1] : null;
    datos.fecha_nacimiento = fechaNacimientoMatch ? fechaNacimientoMatch[1] : null;
    datos.numero_pasaporte = numeroPasaporteMatch ? numeroPasaporteMatch[1] : null;
    return datos;
};

// Procesar el PDF completo
export const procesarPDFCompleto = async (pdfPath, id_pdf) => {
    try {
        console.log(`Procesando PDF con id_pdf: ${id_pdf}`);
        
        // Obtener la información del PDF a partir de su ID
        const pdf = await obtenerPdfPorId(id_pdf); // obtenerPdfPorId debe buscar el pdf en la base de datos
        if (!pdf) {
            throw new Error(`El PDF con id ${id_pdf} no existe o está inactivo.`);
        }

        // Verificar la ruta del PDF
        pdfPath = pdf.ruta; // Asigna la ruta del PDF desde la base de datos
        console.log(`Ruta del PDF: ${pdfPath}`);
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            throw new Error(`El archivo PDF en la ruta ${pdfPath} no existe.`);
        }

        const proceso = await registrarProcesoOCR(id_pdf, 'iniciado', 'Iniciando el proceso de OCR');
        console.log('Proceso OCR registrado:', proceso);

        // Extraer y preprocesar imágenes
        const imagenesExtraidas = await extraerImagenesDePDF(pdfPath);
        console.log('Imágenes extraídas:', imagenesExtraidas);

        for (const imagen of imagenesExtraidas) {
            const imagenPreprocesada = await preprocesarImagen(imagen);
            console.log(`Imagen preprocesada: ${imagenPreprocesada}`);
            const textoExtraido = await extraerTextoDeImagen(imagenPreprocesada);
            console.log(`Texto extraído: ${textoExtraido}`);

            const datos = mapearDatosOCR(textoExtraido);
            console.log('Datos mapeados del OCR:', datos);

            // Guardar los datos en la base de datos
            if (datos.nombre && datos.numero_pasaporte) {
                const cliente = await insertarCliente(datos.nombre, datos.apellido, null, null, datos.fecha_nacimiento, null);
                console.log('Cliente insertado:', cliente);
                await insertarPasaporte(cliente.id_cliente, datos.numero_pasaporte, 'Perú', '2030-01-01');
                console.log('Pasaporte insertado.');
            } else {
                console.warn('Datos incompletos para la inserción en la base de datos:', datos);
            }
        }

        await actualizarEstadoOCR(proceso.insertId, 'completado', 'Proceso OCR completado exitosamente');
        console.log('Proceso completado para todas las imágenes del PDF.');
    } catch (error) {
        console.error('Error al procesar el PDF:', error);
        throw new Error(`Error al procesar el PDF: ${error.message}`);
    }
};

