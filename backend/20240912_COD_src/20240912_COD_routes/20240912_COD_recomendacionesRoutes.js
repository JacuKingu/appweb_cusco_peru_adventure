import express from 'express';
import * as recomendacionesController from '../20240912_COD_controllers/20240912_COD_recomendacionesController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todas las recomendaciones (requiere token)
router.get('/', verificarToken, recomendacionesController.obtenerRecomendaciones);

// Ruta protegida para obtener una recomendación por ID (requiere token)
router.get('/:id_recomendacion', verificarToken, recomendacionesController.obtenerRecomendacionPorId);

// Ruta protegida para insertar una recomendación (requiere token y rol de admin o asesor)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), recomendacionesController.insertarRecomendacion);

// Ruta protegida para actualizar una recomendación (requiere token y rol de admin o asesor)
router.put('/:id_recomendacion', verificarToken, verificarRol(['admin', 'asesor']), recomendacionesController.actualizarRecomendacion);

// Ruta protegida para eliminar una recomendación (requiere token y rol de admin o asesor)
router.delete('/:id_recomendacion', verificarToken, verificarRol(['admin', 'asesor']), recomendacionesController.eliminarRecomendacion);

export default router;
