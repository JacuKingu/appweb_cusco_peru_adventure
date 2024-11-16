import { body, validationResult } from 'express-validator';

// Validación de datos de usuario
export const validarUsuario = [
    body('nombre').isString().notEmpty().withMessage('El nombre es requerido y debe ser una cadena de texto.'),
    body('contraseña').isLength({ min: 12 }).withMessage('La contraseña debe tener al menos 12 caracteres.'),
    body('rol').isIn(['admin', 'asesor']).withMessage('El rol debe ser admin o asesor.'),
];

export const validarLogin = [
    body('nombre').isString().notEmpty().withMessage('El nombre de usuario es requerido.'),
    body('contraseña').isString().notEmpty().withMessage('La contraseña es requerida.')
]

// Middleware para manejar errores de validación
export const manejarErroresDeValidacion = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() });
    }
    next();
};
