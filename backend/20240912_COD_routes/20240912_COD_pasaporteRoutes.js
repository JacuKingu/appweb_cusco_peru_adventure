import express from 'express';
import * as pasaportesController from '../20240912_COD_controllers/20240912_COD_pasaporteController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener pasaportes (requiere token)
router.get('/', verificarToken, pasaportesController.obtenerPasaportes);

// Ruta protegida para insertar pasaporte (requiere token y rol de admin)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), pasaportesController.insertarPasaporte);

// Ruta protegida para actualizar pasaporte (requiere token y rol de admin)
router.put('/:id_pasaporte', verificarToken, verificarRol(['admin', 'asesor']), pasaportesController.actualizarPasaporte);

// Ruta protegida para eliminar pasaporte (requiere token y rol de admin)
router.delete('/:id_pasaporte', verificarToken, verificarRol(['admin', 'asesor']), pasaportesController.eliminarPasaporte);

export default router;
