import * as Usuario from '../20240912_COD_models/20240912_COD_usuariosModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Iniciar sesión (Login)
// Iniciar sesión (Login)
export const login = async (req, res) => {
    const { nombre, contraseña } = req.body;
    const usuarios = await Usuario.obtenerUsuariosActivos();

    try {
        console.log('Datos recibidos para login:', { nombre, contraseña });

        // Obtener todos los usuarios activos (con la corrección en `obtenerUsuariosActivos`)
        
        console.log('Usuarios obtenidos desde la base de datos:', usuarios);

        // Verificar la estructura de cada usuario obtenido
        usuarios.forEach((usuario, index) => {
            console.log(`Usuario ${index}:`, usuario); // Muestra cada usuario y su estructura completa
        });

        // Verificar todos los nombres de usuario obtenidos
        const nombresUsuarios = usuarios.map(u => u.nombre);
        console.log('Nombres de usuario obtenidos:', nombresUsuarios);

        // Buscar el usuario por nombre (insensible a mayúsculas)
        const usuario = usuarios.find(u => u.nombre === nombre);
        console.log('Usuario encontrado:', usuario);

        if (!usuario) {
            console.log('Usuario no encontrado en la base de datos con el nombre:', nombre);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
        console.log('Comparación de contraseña:', isMatch);

        if (!isMatch) {
            console.log('Contraseña incorrecta para el usuario:', nombre);
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id_usuario: usuario.id_usuario, rol: usuario.rol }, JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generado:', token);

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};



// Registrar un nuevo usuario (opcional, si quieres permitir el registro)
export const signup = async (req, res) => {
    const { nombre, contraseña, rol } = req.body;

    try {
        console.log('Datos recibidos para registro:', { nombre, rol }); // Verifica los datos recibidos

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);
        console.log('Contraseña encriptada:', hashedPassword); // Verifica que la contraseña se encripta correctamente

        // Insertar el usuario en la base de datos con la contraseña encriptada
        const result = await Usuario.insertarUsuario(nombre, hashedPassword, rol);
        console.log('Resultado de la inserción en la base de datos:', result); // Verifica si la inserción fue exitosa

        res.status(201).json({ message: 'Usuario registrado exitosamente', result });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};
