import { connection } from '../20240912_COD_db/20240912_COD_dbConnection.js';

//Obtener LoginUsuario
export const loginUsuario = async (nombre) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute(
            'CALL loginUsuario(?, @mensaje, @rol, @id_usuario, @contraseña_hash); SELECT @mensaje AS mensaje, @rol AS rol, @id_usuario AS id_usuario, @contraseña_hash AS contraseña_hash;',
            [nombre]
        );
        // Retornar los valores de salida del procedimiento almacenado
        return result[1][0];
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

//Obtener SignUpUsuario
export const signupUsuario = async (nombre, contraseña, rol) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute(
            'CALL signupUsuario(?, ?, ?, @mensaje); SELECT @mensaje AS mensaje;',
            [nombre, contraseña, rol]
        );
        // Retornar el mensaje de salida del procedimiento almacenado
        return result[1][0].mensaje;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
};
