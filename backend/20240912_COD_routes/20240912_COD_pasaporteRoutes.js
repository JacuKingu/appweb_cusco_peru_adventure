import express from 'express';
import * as pasaportesController from '../20240912_COD_controllers/20240912_COD_pasaporteController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todos los pasaportes activos (requiere token)
router.get('/', verificarToken, pasaportesController.obtenerPasaportes);

// Ruta protegida para obtener un pasaporte por ID (requiere token)
router.get('/:id_pasaporte', verificarToken, pasaportesController.obtenerPasaportePorId);

// Ruta protegida para insertar un pasaporte (requiere token y rol de admin o asesor)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), pasaportesController.insertarPasaporte);

// Ruta protegida para actualizar un pasaporte (requiere token y rol de admin o asesor)
router.put('/:id_pasaporte', verificarToken, verificarRol(['admin', 'asesor']), pasaportesController.actualizarPasaporte);

// Ruta protegida para eliminar un pasaporte (requiere token y rol de admin o asesor)
router.delete('/:id_pasaporte', verificarToken, verificarRol(['admin', 'asesor']), pasaportesController.eliminarPasaporte);

export default router;
