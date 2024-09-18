import express from 'express';
import * as usuarioController from '../20240912_COD_controllers/20240912_COD_usuariosController.js';
import * as verificar from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';
import * as validar from '../20240912_COD_middlewares/20240912_COD_validationMiddleware.js';

const router = express.Router();

// Ruta para obtener todos los usuarios activos
router.get('/',  usuarioController.obtenerUsuarios);

// Ruta para insertar un nuevo usuario con validación
router.post('/', verificar.verificarToken, verificar.verificarRol(['admin']), validar.validarUsuario, validar.manejarErroresDeValidacion, usuarioController.insertarUsuario);

// Ruta para actualizar un usuario existente
router.put('/:id_usuario', verificar.verificarToken, verificar.verificarRol(['admin']), validar.validarUsuario, validar.manejarErroresDeValidacion, usuarioController.actualizarUsuario);

// Ruta para eliminar lógicamente un usuario
router.delete('/:id_usuario', verificar.verificarToken, verificar.verificarRol(['admin']), usuarioController.eliminarUsuario);

export default router; 
