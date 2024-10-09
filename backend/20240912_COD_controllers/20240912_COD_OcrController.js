import { procesarPdf, extraerDatosDelTexto } from '../20240912_COD_services/20240912_COD_OcrService.js';
import { insertarCliente } from '../20240912_COD_services/20240912_COD_clientesServices.js';
import { insertarPasaporte } from '../20240912_COD_services/20240912_COD_pasaporteServices.js';
import { obtenerPdfPorId } from '../20240912_COD_services/20240912_COD_pdfServices.js';


// Controlador para manejar el proceso OCR y guardar los datos extraídos
export const procesarOcrDePdf = async (req, res) => {
    try {
        const { id_pdf } = req.params;
        const rol = req.usuario.rol;

        // Obtener el PDF de la base de datos por ID
        const pdf = await obtenerPdfPorId(id_pdf, rol);
        if (!pdf) {
            return res.status(404).json({ message: 'PDF no encontrado' });
        }

        // Verifica el contenido del PDF
        if (!pdf.contenido) {
            return res.status(400).json({ message: 'El PDF no tiene contenido.' });
        }

        // Procesar el PDF a imágenes
        const imagenesProcesadas = await procesarPdf(pdf.contenido); // Convierte el PDF a imágenes

        // Procesar cada imagen individualmente y guardar los datos
        for (const imagenTexto of imagenesProcesadas) {
            // Realizar el OCR en cada imagen
            const datosExtraidos = extraerDatosDelTexto(imagenTexto);
            
            console.log('Texto procesado por OCR:', imagenTexto);
            console.log('Datos extraídos de la imagen:', datosExtraidos);

            // Si no se encuentran datos suficientes, pasar a la siguiente imagen
            if (!datosExtraidos.nombre || !datosExtraidos.apellido || !datosExtraidos.numero_pasaporte) {
                console.log('Datos insuficientes extraídos de esta imagen. Pasando a la siguiente.');
                continue;
            }

            // Guardar los datos extraídos (Cliente y Pasaporte)
            const nuevoCliente = await insertarCliente(
                datosExtraidos.nombre,
                datosExtraidos.apellido,
                null, // email si está disponible
                null, // teléfono si está disponible
                datosExtraidos.fecha_nacimiento,
                nuevoGrupo.id_grupo
            );

            console.log('Nuevo cliente creado:', nuevoCliente);

            // Insertar datos del pasaporte
            await insertarPasaporte(
                nuevoCliente.id_cliente,
                datosExtraidos.numero_pasaporte,
                datosExtraidos.pais_emision,
                datosExtraidos.fecha_expiracion
            );

            console.log('Datos del pasaporte insertados para el cliente:', nuevoCliente.id_cliente);
        }

        res.status(200).json({
            message: 'Proceso OCR completado y datos extraídos y guardados de cada imagen',
        });

    } catch (error) {
        console.error('Error durante el proceso OCR:', error);
        res.status(500).json({
            message: 'Error durante el proceso OCR',
            error: error.message,
        });
    }
};
