import { body, validationResult } from 'express-validator';

// Validación de datos de usuario
export const validarUsuario = [
    body('nombre').isString().notEmpty().withMessage('El nombre es requerido y debe ser una cadena de texto.'),
    body('apellido').isString().notEmpty().withMessage('El apellido es requerido y debe ser una cadena de texto.'),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('rol').isIn(['admin', 'asesor']).withMessage('El rol debe ser admin o asesor.'),
];

// Middleware para manejar errores de validación
export const manejarErroresDeValidacion = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() });
    }
    next();
};
