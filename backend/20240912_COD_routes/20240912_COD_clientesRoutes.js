import express from 'express';
import * as clientesController from '../20240912_COD_controllers/20240912_COD_clientesController.js';
import { verificarRol,verificarToken } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener clientes (requiere token)
router.get('/', verificarToken, clientesController.obtenerClientes);

// Ruta protegida para insertar cliente (requiere token y rol de admin)
router.post('/', verificarToken, verificarRol(['admin','asesor']), clientesController.insertarCliente);

// Ruta protegida para actualizar cliente (requiere token y rol de admin)
router.put('/:id_cliente', verificarToken, verificarRol(['admin','asesor']), clientesController.actualizarCliente);

// Ruta protegida para eliminar cliente (requiere token y rol de admin)
router.delete('/:id_cliente', verificarToken, verificarRol(['admin','asesor']), clientesController.eliminarCliente);

export default router;
