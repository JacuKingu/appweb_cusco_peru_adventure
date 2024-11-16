import express from 'express';
import * as clientesController from '../20240912_COD_controllers/20240912_COD_clientesController.js';
import { verificarRol, verificarToken } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todos los clientes (requiere token)
router.get('/', verificarToken, clientesController.obtenerClientes);

// Ruta protegida para obtener un cliente por ID
router.get('/:id_cliente', verificarToken, clientesController.obtenerClientePorId);

// Ruta protegida para insertar un cliente (requiere token y rol de admin o asesor)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), clientesController.insertarCliente);

// Ruta protegida para actualizar un cliente (requiere token y rol de admin o asesor)
router.put('/:id_cliente', verificarToken, verificarRol(['admin', 'asesor']), clientesController.actualizarCliente);

// Ruta protegida para eliminar un cliente (requiere token y rol de admin o asesor)
router.delete('/:id_cliente', verificarToken, verificarRol(['admin', 'asesor']), clientesController.eliminarCliente);

export default router;
