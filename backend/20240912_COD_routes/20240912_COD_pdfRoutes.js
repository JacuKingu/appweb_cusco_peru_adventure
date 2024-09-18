import express from 'express';
import * as pdfController from '../20240912_COD_controllers/20240912_COD_pdfController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener PDFs (requiere token)
router.get('/', verificarToken, pdfController.obtenerPdfs);

// Ruta protegida para insertar PDF (requiere token y rol de admin)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), pdfController.insertarPdf);

// Ruta protegida para actualizar PDF (requiere token y rol de admin)
router.put('/:id_pdf', verificarToken, verificarRol(['admin', 'asesor']), pdfController.actualizarPdf);

// Ruta protegida para eliminar PDF (requiere token y rol de admin)
router.delete('/:id_pdf', verificarToken, verificarRol(['admin', 'asesor']), pdfController.eliminarPdf);

export default router;
