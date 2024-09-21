import express from 'express';
import { login,signup } from '../20240912_COD_controllers/20240912_COD_authController.js';
import rateLimit from 'express-rate-limit'; 
import { body } from 'express-validator';

const router = express.Router();

// Limitar el número de intentos de inicio de sesión
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5, // Limitar a 5 intentos por IP cada 5 minutos
    message: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo de nuevo después de 5 minutos.',
    standardHeaders: true, // Retorna la información de limitación en los headers `RateLimit-*`
    legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
});

// Ruta para iniciar sesión con limitador de intentos
router.post('/login', loginLimiter, [
    body('nombre').isString().notEmpty().withMessage('El nombre de usuario es requerido.'),
    body('contraseña').isString().notEmpty().withMessage('La contraseña es requerida.')
], login);

// Ruta para registrar un nuevo usuario con validaciones
router.post('/signup', [
    body('nombre').isString().notEmpty().withMessage('El nombre de usuario es requerido.'),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('rol').isIn(['admin', 'asesor']).withMessage('Rol no válido. Debe ser "admin" o "asesor".')
], signup);

export default router;
