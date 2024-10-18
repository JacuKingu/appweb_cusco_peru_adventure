import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js';

export const loginUsuario = async (nombre) => {
    try {
        const pool = await connection;

        await pool.execute('CALL loginUsuario(?, @mensaje, @rol, @id_usuario, @contraseña_hash);',[nombre]);

        const [result] = await pool.execute(
            'SELECT @mensaje AS mensaje, @rol AS rol, @id_usuario AS id_usuario, @contraseña_hash AS contraseña_hash;'
        );

        // Retornar el objeto con los valores de las variables de salida
        return result[0];
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

// Función para registrar un nuevo usuario
export const signupUsuario = async (nombre, contraseña, rol) => {
    try {
        const pool = await connection;
        
        // Llama al procedimiento almacenado para crear el usuario
        await pool.execute('CALL signupUsuario(?, ?, ?, @mensaje);', [nombre, contraseña, rol]);
        
        // Recupera el mensaje de salida
        const [result] = await pool.execute('SELECT @mensaje AS mensaje;');
        return result[0].mensaje; // Devuelve el mensaje de salida del procedimiento
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
};
