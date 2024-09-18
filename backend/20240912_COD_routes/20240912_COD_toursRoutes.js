import express from 'express';
import * as toursController from '../20240912_COD_controllers/20240912_COD_toursController.js';
import { verificarRol,verificarToken } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener tours (requiere token)
router.get('/', verificarToken, toursController.obtenerTours);

// Ruta protegida para insertar tour (requiere token y rol de administrador)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), toursController.insertarTour);

// Ruta protegida para actualizar tour (requiere token y rol de administrador)
router.put('/:id_tour', verificarToken, verificarRol(['admin', 'asesor']), toursController.actualizarTour);

// Ruta protegida para eliminar tour (requiere token y rol de administrador)
router.delete('/:id_tour', verificarToken, verificarRol(['admin', 'asesor']), toursController.eliminarTour);

export default router;
