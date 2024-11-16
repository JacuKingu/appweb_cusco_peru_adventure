import express from 'express';
import * as toursController from '../20240912_COD_controllers/20240912_COD_toursController.js';
import { verificarRol, verificarToken } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todos los tours (requiere token)
router.get('/', verificarToken, toursController.obtenerTours);

// Ruta protegida para obtener un tour por ID (requiere token)
router.get('/:id_tour', verificarToken, toursController.obtenerTourPorId);

// Ruta protegida para insertar un tour (requiere token y rol de admin o asesor)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), toursController.insertarTour);

// Ruta protegida para actualizar un tour (requiere token y rol de admin o asesor)
router.put('/:id_tour', verificarToken, verificarRol(['admin', 'asesor']), toursController.actualizarTour);

// Ruta protegida para eliminar un tour (requiere token y rol de admin o asesor)
router.delete('/:id_tour', verificarToken, verificarRol(['admin', 'asesor']), toursController.eliminarTour);

export default router;
