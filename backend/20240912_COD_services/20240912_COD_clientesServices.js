import * as clientesModel from '../20240912_COD_models/20240912_COD_clientesModel.js';

// Servicio para obtener todos los clientes activos basados en el rol
export const obtenerClientesPorRol = async (rol) => {
    try {
        const clientes = await clientesModel.obtenerClientesActivos(rol);
        return clientes;
    } catch (error) {
        console.error('Error en obtenerClientesPorRol (Servicio):', error);
        throw new Error('Error al obtener los clientes activos');
    }
};

// Servicio para obtener un cliente por ID considerando el rol
export const obtenerClientePorIdYRol = async (id_cliente, rol) => {
    try {
        const cliente = await clientesModel.obtenerClientePorId(id_cliente, rol);
        if (!cliente) {
            throw new Error('Cliente no encontrado o no tienes permiso para verlo');
        }
        return cliente;
    } catch (error) {
        console.error('Error en obtenerClientePorIdYRol (Servicio):', error);
        throw new Error('Error al obtener el cliente por ID');
    }
};

// Servicio para insertar un nuevo cliente
export const insertarCliente = async (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) => {
    try {
        await clientesModel.insertarCliente(nombre, apellido, email, telefono, fecha_nacimiento, id_grupo);
    } catch (error) {
        console.error('Error en insertarCliente (Servicio):', error);
        throw new Error('Error al insertar el cliente');
    }
};

// Servicio para actualizar un cliente existente
export const actualizarCliente = async (id_cliente, nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) => {
    try {
        await clientesModel.actualizarCliente(id_cliente, nombre, apellido, email, telefono, fecha_nacimiento, id_grupo);
    } catch (error) {
        console.error('Error en actualizarCliente (Servicio):', error);
        throw new Error('Error al actualizar el cliente');
    }
};

// Servicio para eliminar un cliente lógicamente
export const eliminarCliente = async (id_cliente) => {
    try {
        await clientesModel.eliminarCliente(id_cliente);
    } catch (error) {
        console.error('Error en eliminarCliente (Servicio):', error);
        throw new Error('Error al eliminar el cliente');
    }
};
