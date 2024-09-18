import * as clientesModel from '../20240912_COD_models/20240912_COD_clientesModel.js';

// Obtener todos los clientes activos
export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await clientesModel.obtenerClientesActivos();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

// Insertar un nuevo cliente
export const insertarCliente = async (req, res) => {
    const { nombre, apellido, email, telefono, fechaNacimiento, id_grupo } = req.body;
    try {
        await clientesModel.insertarCliente(nombre, apellido, email, telefono, fechaNacimiento, id_grupo);
        res.status(201).json({ mensaje: 'Cliente insertado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar cliente' });
    }
};

// Actualizar un cliente
export const actualizarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    const { nombre, apellido, email, telefono, fechaNacimiento, id_grupo } = req.body;
    try {
        await clientesModel.actualizarCliente(id_cliente, nombre, apellido, email, telefono, fechaNacimiento, id_grupo);
        res.status(200).json({ mensaje: 'Cliente actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
};

// Eliminar un cliente 
export const eliminarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        await clientesModel.eliminarCliente(id_cliente);
        res.status(200).json({ mensaje: 'Cliente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
};
