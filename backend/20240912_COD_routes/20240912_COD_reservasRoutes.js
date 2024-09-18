import express from 'express';
import * as reservasController from '../20240912_COD_controllers/20240912_COD_reservasController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener reservas (requiere token)
router.get('/', verificarToken, reservasController.obtenerReservas);

// Ruta protegida para insertar reserva (requiere token y rol de administrador)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), reservasController.insertarReserva);

// Ruta protegida para actualizar reserva (requiere token y rol de administrador)
router.put('/:id_reserva', verificarToken, verificarRol(['admin', 'asesor']), reservasController.actualizarReserva);

// Ruta protegida para eliminar reserva (requiere token y rol de administrador)
router.delete('/:id_reserva', verificarToken, verificarRol(['admin', 'asesor']), reservasController.eliminarReserva);

export default router;
