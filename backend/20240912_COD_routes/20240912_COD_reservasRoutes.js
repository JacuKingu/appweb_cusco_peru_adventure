import express from 'express';
import * as reservasController from '../20240912_COD_controllers/20240912_COD_reservasController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todas las reservas activas (requiere token)
router.get('/', verificarToken, reservasController.obtenerReservas);

// Ruta protegida para obtener una reserva por ID (requiere token)
router.get('/:id_reserva', verificarToken, reservasController.obtenerReservaPorId);

// Ruta protegida para insertar una reserva (requiere token y rol de admin o asesor)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), reservasController.insertarReserva);

// Ruta protegida para actualizar una reserva (requiere token y rol de admin o asesor)
router.put('/:id_reserva', verificarToken, verificarRol(['admin', 'asesor']), reservasController.actualizarReserva);

// Ruta protegida para eliminar una reserva (requiere token y rol de admin o asesor)
router.delete('/:id_reserva', verificarToken, verificarRol(['admin', 'asesor']), reservasController.eliminarReserva);

export default router;
