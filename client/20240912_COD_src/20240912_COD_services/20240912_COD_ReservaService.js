// 20240912_COD_reservasServices.js
import api from './20240912_COD_Api';

// Servicio para obtener todas las reservas activas
export const obtenerReservasPorRol = async (rol) => {
    try {
        const response = await api.get('/reserva', { params: { rol } });
        return response.data; // Devuelve las reservas activas
    } catch (error) {
        console.error('Error en obtenerReservasPorRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener las reservas activas');
    }
};

// Servicio para obtener una reserva por ID considerando el rol
export const obtenerReservaPorIdYRol = async (id_reserva, rol) => {
    try {
        const response = await api.get(`/reserva/${id_reserva}`, { params: { rol } });
        return response.data; // Devuelve la reserva
    } catch (error) {
        console.error('Error en obtenerReservaPorIdYRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener la reserva por ID');
    }
};

// Servicio para insertar una nueva reserva
export const insertarReserva = async (id_cliente, id_tour, estado) => {
    try {
        const response = await api.post('/reserva', { id_cliente, id_tour, estado });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en insertarReserva (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al insertar la reserva');
    }
};

// Servicio para actualizar una reserva existente
export const actualizarReserva = async (id_reserva, id_cliente, id_tour, estado) => {
    try {
        const response = await api.put(`/reserva/${id_reserva}`, { id_cliente, id_tour, estado });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en actualizarReserva (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al actualizar la reserva');
    }
};

// Servicio para eliminar una reserva lógicamente
export const eliminarReserva = async (id_reserva) => {
    try {
        const response = await api.delete(`/reserva/${id_reserva}`);
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en eliminarReserva (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al eliminar la reserva');
    }
};
