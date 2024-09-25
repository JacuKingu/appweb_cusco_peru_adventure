import winston from 'winston';

// Configuración del logger con Winston
export const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log' }), // Guarda errores en logs/error.log
        new winston.transports.Console() // Muestra errores en la consola también
    ]
});

// Middleware de manejo de errores
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    // Registrar el error en los logs
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // Responder con el error
    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {} // Mostrar el stack solo en desarrollo
    });
};
