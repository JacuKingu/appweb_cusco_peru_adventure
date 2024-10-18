import express from 'express';
import * as usuarioController from '../20240912_COD_controllers/20240912_COD_usuariosController.js';
import * as verificar from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';
import * as validar from '../20240912_COD_middlewares/20240912_COD_validationMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener todos los usuarios activos (requiere token y rol)
router.get('/', verificar.verificarToken, verificar.verificarRol(['admin']), usuarioController.obtenerUsuarios);

// Ruta protegida para obtener un usuario por ID (requiere token y rol)
router.get('/:id_usuario', verificar.verificarToken, verificar.verificarRol(['admin']), usuarioController.obtenerUsuarioPorId);

// Ruta protegida para insertar un nuevo usuario con validación
router.post('/', verificar.verificarToken, verificar.verificarRol(['admin']), validar.validarUsuario, validar.manejarErroresDeValidacion, usuarioController.insertarUsuario);

// Ruta protegida para actualizar un usuario existente con validación
router.put('/:id_usuario', verificar.verificarToken, verificar.verificarRol(['admin']), validar.validarUsuario, validar.manejarErroresDeValidacion, usuarioController.actualizarUsuario);

// Ruta protegida para eliminar lógicamente un usuario
router.delete('/:id_usuario', verificar.verificarToken, verificar.verificarRol(['admin']), usuarioController.eliminarUsuario);

export default router;
