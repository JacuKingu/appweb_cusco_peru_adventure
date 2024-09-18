import express from 'express';
import { login,signup } from '../20240912_COD_controllers/20240912_COD_authController.js';
import rateLimit from 'express-rate-limit'; // Importa express-rate-limit

const router = express.Router();

// Limitar el número de intentos de inicio de sesión
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutos
    max: 5, // Limitar a 5 intentos por IP cada 15 minutos
    message: 'Demasiados intentos de inicio de sesión. Por favor, inténtelo de nuevo después de 5 minutos.',
    standardHeaders: true, // Retorna la información de limitación en los headers `RateLimit-*`
    legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
});

// Ruta para iniciar sesión con limitador de intentos
router.post('/login', loginLimiter, login);

// Ruta para registrar un nuevo usuario (opcional)
router.post('/signup', signup);

export default router;
