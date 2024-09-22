import * as reservasModel from '../20240912_COD_models/20240912_COD_reservasModel.js';

// Servicio para obtener todas las reservas activas basadas en el rol
export const obtenerReservasPorRol = async (rol) => {
    try {
        const reservas = await reservasModel.obtenerReservasActivas(rol);
        return reservas;
    } catch (error) {
        console.error('Error en obtenerReservasPorRol (Servicio):', error);
        throw new Error('Error al obtener las reservas activas');
    }
};

// Servicio para obtener una reserva por ID considerando el rol
export const obtenerReservaPorIdYRol = async (id_reserva, rol) => {
    try {
        const reserva = await reservasModel.obtenerReservaPorId(id_reserva, rol);
        if (!reserva) {
            throw new Error('Reserva no encontrada o no tienes permiso para verla');
        }
        return reserva;
    } catch (error) {
        console.error('Error en obtenerReservaPorIdYRol (Servicio):', error);
        throw new Error('Error al obtener la reserva por ID');
    }
};

// Servicio para insertar una nueva reserva
export const insertarReserva = async (id_cliente, id_tour, estado) => {
    try {
        await reservasModel.insertarReserva(id_cliente, id_tour, estado);
    } catch (error) {
        console.error('Error en insertarReserva (Servicio):', error);
        throw new Error('Error al insertar la reserva');
    }
};

// Servicio para actualizar una reserva existente
export const actualizarReserva = async (id_reserva, id_cliente, id_tour, estado) => {
    try {
        await reservasModel.actualizarReserva(id_reserva, id_cliente, id_tour, estado);
    } catch (error) {
        console.error('Error en actualizarReserva (Servicio):', error);
        throw new Error('Error al actualizar la reserva');
    }
};

// Servicio para eliminar una reserva lógicamente
export const eliminarReserva = async (id_reserva) => {
    try {
        await reservasModel.eliminarReserva(id_reserva);
    } catch (error) {
        console.error('Error en eliminarReserva (Servicio):', error);
        throw new Error('Error al eliminar la reserva');
    }
};
