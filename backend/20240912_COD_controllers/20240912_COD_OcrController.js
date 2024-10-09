import * as pdfService from '../20240912_COD_services/20240912_COD_pdfServices.js';
import * as ocrService from '../20240912_COD_services/20240912_COD_OcrService.js';  // Importar el servicio de OCR
import path from 'path';
import fs from 'fs';
import { convert } from 'pdf-poppler';
import * as clientesService from '../20240912_COD_services/20240912_COD_clientesServices.js';
import * as pasaporteService from '../20240912_COD_services/20240912_COD_pasaporteServices.js';
import { fileURLToPath } from 'url';

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para limpiar texto extraído
const limpiarTexto = (texto) => {
    return texto ? texto.trim().replace(/\s+/g, ' ') : null;
};

// Función para extraer los datos del texto usando expresiones regulares
const extraerDatosDelTexto = (texto, mrzData) => {
    const datos = {
        nombre: '',
        apellido: '',
        fecha_nacimiento: ''
    };

    const regexNombre = /Pre Nombres\s*([A-Za-z\s]+)/i;
    const regexApellido = /Primer Apellido\s*([A-Za-z\s]+)/i;
    const regexFechaNacimiento = /Nacimiento\s*(\d{2}\s*[A-Za-z]+\s*\d{4})/i;

    // Extraer usando OCR fuera del MRZ
    const nombreMatch = texto.match(regexNombre);
    if (nombreMatch) datos.nombre = nombreMatch[1].trim();

    const apellidoMatch = texto.match(regexApellido);
    if (apellidoMatch) datos.apellido = apellidoMatch[1].trim();

    const fechaNacimientoMatch = texto.match(regexFechaNacimiento);
    if (fechaNacimientoMatch) datos.fecha_nacimiento = fechaNacimientoMatch[1].trim();

    // Si no se pudieron extraer bien los datos, usar los del MRZ
    if (!datos.nombre && mrzData && mrzData.names) {
        datos.nombre = mrzData.names.trim();
    }

    if (!datos.apellido && mrzData && mrzData.surname) {
        datos.apellido = mrzData.surname.trim();
    }

    // Si no se extrajo la fecha de nacimiento, usar la del MRZ
    if (!datos.fecha_nacimiento && mrzData && mrzData.date_of_birth) {
        datos.fecha_nacimiento = mrzData.date_of_birth; // Ajustar formato si es necesario
    }

    return datos;
};

export const procesarOcrDePdf = async (req, res) => {
    const { id_pdf } = req.params;

    try {
        // Recuperar el PDF desde la base de datos
        const pdf = await pdfService.obtenerPdfPorId(id_pdf, req.usuario.rol);
        if (!pdf) {
            return res.status(404).json({ message: 'PDF no encontrado' });
        }

        // Verificar si el directorio uploads existe, y crearlo si no
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        // Guardar el PDF temporalmente en el servidor para procesarlo
        const pdfPath = path.join(uploadDir, 'temp.pdf');
        fs.writeFileSync(pdfPath, pdf.contenido);

        // Convertir el PDF a imágenes usando pdf-poppler
        const options = {
            format: 'png',
            out_dir: path.dirname(pdfPath),
            out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
            page: null // Convertir todas las páginas
        };
        await convert(pdfPath, options);

        // Procesar las imágenes generadas
        const imagenes = fs.readdirSync(options.out_dir).filter(file => file.endsWith('.png'));
        let resultadosOcr = [];

        for (const imagen of imagenes) {
            const imagePath = path.join(options.out_dir, imagen);

            // Llamar al servicio para procesar la imagen usando la API Python
            const result = await ocrService.procesarImagenConOcr(imagePath);

            const mrzData = result.mrz_data;
            const ocrText = result.ocr_text;

            // Extraer los datos del texto OCR
            const { nombre, apellido, fecha_nacimiento } = extraerDatosDelTexto(ocrText);

            // Imprimir los datos extraídos para depuración
            console.log('Texto OCR completo:', ocrText);
            console.log('Nombre extraído:', nombre);
            console.log('Apellido extraído:', apellido);
            console.log('Fecha de nacimiento extraída:', fecha_nacimiento);
            console.log('Datos MRZ extraídos:', mrzData);

            // Validar los datos extraídos
            if (!nombre || !apellido) {
                console.warn('El nombre y apellido son obligatorios');
                return res.status(400).json({ message: 'El nombre y apellido son obligatorios' });
            }

            // Insertar los datos en la tabla clientes
            const nuevoCliente = await clientesService.insertarCliente(
                nombre, apellido, null, null, fecha_nacimiento, req.body.id_grupo
            );

            // Insertar los datos del pasaporte extraídos con PassportEye
            if (mrzData && mrzData['document_number']) {
                await pasaporteService.insertarPasaporte(
                    nuevoCliente.insertId,  // ID del cliente recién creado
                    mrzData['document_number'],
                    mrzData['country'],
                    mrzData['expiration_date']
                );
            }

            resultadosOcr.push({ nombre, apellido, mrzData });
        }

        res.status(200).json({
            message: 'OCR completado con éxito',
            data: resultadosOcr
        });

        // Eliminar archivos temporales
        fs.unlinkSync(pdfPath);

    } catch (error) {
        console.error('Error al procesar OCR de PDF:', error);
        res.status(500).json({ message: 'Error al procesar OCR de PDF' });
    }
};
