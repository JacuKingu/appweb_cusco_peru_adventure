import jwt from 'jsonwebtoken';

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar el token JWT
export const verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Acceso denegado: No se proporcionó un token' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // Agregar los datos del usuario verificado al request
        next();
    } catch (error) {
        console.error('Token inválido:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar los roles de los usuarios
export const verificarRol = (rolesPermitidos) => (req, res, next) => {
    const { rol } = req.usuario;
    if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ message: 'Acceso denegado: No tienes permisos suficientes' });
    }
    next();
};

