import { connection } from "../20240912_COD_db/20240912_COD_dbConnection.js";

// Obtener Clientes activos basados en el rol
export const obtenerClientesActivos = async (rol) => {
    try {
        const pool = await connection;
        const [rows] = await pool.execute('CALL obtenerClientesActivos(?)', [rol]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener clientes activos:', error);
        throw error;
    }
};

// Obtener Cliente por ID
export const obtenerClientePorId = async (id_cliente, rol) => {
    try {
        const pool = await connection;
        const [rows] = await pool.execute('CALL obtenerClientePorId(?, ?)', [id_cliente, rol]);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        throw error;
    }
};

// Insertar un nuevo Cliente
export const insertarCliente = async (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute(
            'CALL insertarCliente(?, ?, ?, ?, ?, ?)',
            [nombre, apellido, email, telefono, fecha_nacimiento, id_grupo]
        );
        return result[0];
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        throw error;
    }
};

// Actualizar un Cliente existente
export const actualizarCliente = async (id_cliente, nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute(
            'CALL actualizarCliente(?, ?, ?, ?, ?, ?, ?)',
            [id_cliente, nombre, apellido, email, telefono, fecha_nacimiento, id_grupo]
        );
        return result;
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        throw error;
    }
};

// Eliminar lógicamente un Cliente
export const eliminarCliente = async (id_cliente) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute('CALL eliminarCliente(?)', [id_cliente]);
        return result;
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        throw error;
    }
};
