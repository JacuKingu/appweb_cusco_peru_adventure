import api from './20240912_COD_Api';

// Servicio para obtener todos los clientes activos
export const obtenerClientesPorRol = async (rol) => {
    try {
        const response = await api.get('/cliente', { params: { rol } });
        return response.data; // Devuelve los clientes activos
    } catch (error) {
        console.error('Error en obtenerClientesPorRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener los clientes activos');
    }
};

// Servicio para obtener un cliente por ID considerando el rol
export const obtenerClientePorIdYRol = async (id_cliente, rol) => {
    try {
        const response = await api.get(`/cliente/${id_cliente}`, { params: { rol } });
        return response.data; // Devuelve el cliente
    } catch (error) {
        console.error('Error en obtenerClientePorIdYRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener el cliente por ID');
    }
};

// Servicio para insertar un nuevo cliente
export const insertarCliente = async (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) => {
    try {
        const response = await api.post('/cliente', { nombre, apellido, email, telefono, fecha_nacimiento, id_grupo });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en insertarCliente (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al insertar el cliente');
    }
};

// Servicio para actualizar un cliente existente
export const actualizarCliente = async (id_cliente, nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) => {
    try {
        const response = await api.put(`/cliente/${id_cliente}`, { nombre, apellido, email, telefono, fecha_nacimiento, id_grupo });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en actualizarCliente (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al actualizar el cliente');
    }
};

// Servicio para eliminar un cliente lógicamente
export const eliminarCliente = async (id_cliente) => {
    try {
        const response = await api.delete(`/cliente/${id_cliente}`);
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en eliminarCliente (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al eliminar el cliente');
    }
};
