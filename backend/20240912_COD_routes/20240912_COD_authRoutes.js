import express from 'express';
import { login, signup } from '../20240912_COD_controllers/20240912_COD_authController.js';
import rateLimit from 'express-rate-limit'; 
import { body } from 'express-validator';
import { validarUsuario, validarLogin } from '../20240912_COD_middlewares/20240912_COD_validationMiddleware.js'

const router = express.Router();

// Limitar el número de intentos de inicio de sesión
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 15, // Limitar a 15 intentos por IP cada 5 minutos
    message: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo de nuevo después de 5 minutos.',
    standardHeaders: true, // Retorna la información de limitación en los headers `RateLimit-*`
    legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
});

// Ruta para iniciar sesión con limitador de intentos
router.post('/login', loginLimiter, validarLogin , login);

// Ruta para registrar un nuevo usuario con validaciones
router.post('/signup', validarUsuario , signup);

export default router;
