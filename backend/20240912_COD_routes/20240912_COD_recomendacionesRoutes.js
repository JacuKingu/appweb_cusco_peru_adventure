import express from 'express';
import * as recomendacionesController from '../20240912_COD_controllers/20240912_COD_recomendacionesController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener recomendaciones (requiere token)
router.get('/', verificarToken, recomendacionesController.obtenerRecomendaciones);

// Ruta protegida para insertar recomendación (requiere token y rol de admin)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), recomendacionesController.insertarRecomendacion);

// Ruta protegida para actualizar recomendación (requiere token y rol de admin)
router.put('/:id_recomendacion', verificarToken, verificarRol(['admin', 'asesor']), recomendacionesController.actualizarRecomendacion);

// Ruta protegida para eliminar recomendación (requiere token y rol de admin)
router.delete('/:id_recomendacion', verificarToken, verificarRol(['admin', 'asesor']), recomendacionesController.eliminarRecomendacion);

export default router;
