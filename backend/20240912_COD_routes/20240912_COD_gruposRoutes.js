import express from 'express';
import * as gruposController from '../20240912_COD_controllers/20240912_COD_gruposController.js';
import { verificarToken, verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todos los grupos (requiere token)
router.get('/', verificarToken, gruposController.obtenerGrupos);

// Ruta protegida para insertar un grupo (requiere token y rol de admin)
router.post('/', verificarToken, verificarRol(['admin', 'asesor']), gruposController.insertarGrupo);

// Ruta protegida para actualizar un grupo (requiere token y rol de admin)
router.put('/:id_grupo', verificarToken, verificarRol(['admin', 'asesor']), gruposController.actualizarGrupo);

// Ruta protegida para eliminar un grupo (requiere token y rol de admin)
router.delete('/:id_grupo', verificarToken, verificarRol(['admin', 'asesor']), gruposController.eliminarGrupo);

export default router;
