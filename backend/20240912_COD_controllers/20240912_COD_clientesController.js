import * as clientesService from '../20240912_COD_services/20240912_COD_clientesServices.js';

// Obtener todos los clientes activos basados en el rol
export const obtenerClientes = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        const clientes = await clientesService.obtenerClientesPorRol(rol);
        res.status(200).json({
            success: true,
            data: clientes
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener un cliente por ID considerando el rol
export const obtenerClientePorId = async (req, res) => {
    const { id_cliente } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const cliente = await clientesService.obtenerClientePorIdYRol(id_cliente, rol);
        res.status(200).json({ success: true, data: cliente });
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const insertarCliente = async (req, res) => {
    const { nombre, apellido, email, telefono, fecha_nacimiento, id_grupo } = req.body;

    try {
        if (!nombre || !apellido) {
            return res.status(400).json({ message: 'El nombre y apellido son obligatorios' });
        }

        await clientesService.insertarCliente(nombre, apellido, email, telefono, fecha_nacimiento, id_grupo);
        res.status(201).json({ message: 'Cliente insertado exitosamente' });
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        res.status(500).json({ message: error.message });
    }
};


// Actualizar un cliente existente
export const actualizarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    const { nombre, apellido, email, telefono, fecha_nacimiento, id_grupo } = req.body;
    try {
        await clientesService.actualizarCliente(id_cliente, nombre, apellido, email, telefono, fecha_nacimiento, id_grupo);
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un cliente lógicamente
export const eliminarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        await clientesService.eliminarCliente(id_cliente);
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: error.message });
    }
};
