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

export const insertarCliente = async (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) => {
    try {
        const pool = await connection;
        const [result] = await pool.execute(
            'CALL insertarCliente(?, ?, ?, ?, ?, ?)',
            [
                nombre || null,              // Si 'nombre' es undefined, pasa null
                apellido || null,            // Si 'apellido' es undefined, pasa null
                email || null,               // Si 'email' es undefined, pasa null
                telefono || null,            // Si 'telefono' es undefined, pasa null
                fecha_nacimiento || null,    // Si 'fecha_nacimiento' es undefined, pasa null
                id_grupo || null             // Si 'id_grupo' es undefined, pasa null
            ]
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
