import { procesarPdf } from '../20240912_COD_services/20240912_COD_OcrService.js';
import { insertarCliente } from '../20240912_COD_services/20240912_COD_clientesServices.js';
import { insertarPasaporte } from '../20240912_COD_services/20240912_COD_pasaporteServices.js';
import { insertarUltimoGrupo, obtenerGruposPorRol } from '../20240912_COD_services/20240912_COD_gruposServices.js';
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

        // Crear un nuevo grupo para los datos extraídos
        const contarGrupos = async () => {
            const rol = req.usuario.rol;
            const grupos = await obtenerGruposPorRol(rol);
            return grupos.length;
        }

        // Obtener el número actual de grupos
        const numGrupos = await contarGrupos();

        console.log('NUmero de grupos: ', numGrupos);

        // Insertar un nuevo grupo con un número incremental
        const nuevoGrupo = await insertarUltimoGrupo(pdf.id_pdf, 'Grupo ' + (numGrupos + 1));
        console.log('el nuevo grupo: ', nuevoGrupo)
        if (!nuevoGrupo || !nuevoGrupo.id_grupo) {
            return res.status(500).json({ message: 'Error al crear el nuevo grupo.' });
        }

        console.log('Nuevo grupo creado: Grupo ' + (numGrupos + 1));


        // Procesar el PDF a imágenes y realizar el OCR
        const datosExtraidos = await procesarPdf(pdf.contenido); // Esta función convierte el PDF a imágenes y hace OCR
        console.log('estos son los dato extraidos: ', [
            datosExtraidos.nombre,
            datosExtraidos.apellido,
            datosExtraidos.fecha_nacimiento,
            datosExtraidos.fecha_expiracion,
            datosExtraidos.numero_pasaporte,
            datosExtraidos.pais_emision,
            nuevoGrupo.id_grupo
        ])

        // Guardar los datos extraídos en la base de datos (nombre, apellido, pasaporte, etc.)
        const nuevoCliente = await insertarCliente(
            datosExtraidos.nombre,
            datosExtraidos.apellido,
            null, // email si está disponible
            null, // teléfono si está disponible
            datosExtraidos.fecha_nacimiento,
            nuevoGrupo.id_grupo
        );
        console.log('el nuevo lciente con ocr: ', nuevoCliente);

        // Insertar datos del pasaporte
        await insertarPasaporte(
            nuevoCliente.id_cliente,
            datosExtraidos.numero_pasaporte,
            datosExtraidos.pais_emision,
            datosExtraidos.fecha_expiracion
        );

        res.status(200).json({
            message: 'Proceso OCR completado y datos extraídos y guardados',
            datos: datosExtraidos,
        });
    } catch (error) {
        console.error('Error durante el proceso OCR:', error);
        res.status(500).json({
            message: 'Error durante el proceso OCR',
            error: error.message,
        });
    }
};
