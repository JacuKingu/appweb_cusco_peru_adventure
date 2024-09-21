import express from 'express';
import * as pdfController from '../20240912_COD_controllers/20240912_COD_pdfController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todos los PDFs activos (requiere token)
router.get('/', verificarToken, pdfController.obtenerPdfs);

// Ruta protegida para obtener un PDF por ID (requiere token)
router.get('/:id_pdf', verificarToken, pdfController.obtenerPdfPorId);

// Ruta protegida para insertar un PDF (requiere token y rol de admin o asesor)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), pdfController.insertarPdf);

// Ruta protegida para actualizar un PDF (requiere token y rol de admin o asesor)
router.put('/:id_pdf', verificarToken, verificarRol(['admin', 'asesor']), pdfController.actualizarPdf);

// Ruta protegida para eliminar un PDF (requiere token y rol de admin o asesor)
router.delete('/:id_pdf', verificarToken, verificarRol(['admin', 'asesor']), pdfController.eliminarPdf);

export default router;
