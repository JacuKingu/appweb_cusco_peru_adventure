import * as reservasService from '../20240912_COD_services/20240912_COD_reservasServices.js';

// Obtener todas las reservas activas basadas en el rol
export const obtenerReservas = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        const reservas = await reservasService.obtenerReservasPorRol(rol);
        res.status(200).json({
            success: true,
            data: reservas
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener reservas' });
    }
};

// Obtener una reserva por ID considerando el rol
export const obtenerReservaPorId = async (req, res) => {
    const { id_reserva } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const reserva = await reservasService.obtenerReservaPorIdYRol(id_reserva, rol);
        if (!reserva) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }
        res.status(200).json({ success: true, data: reserva });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener reserva' });
    }
};

// Insertar una nueva reserva
export const insertarReserva = async (req, res) => {
    const { id_cliente, id_tour, estado } = req.body;
    try {
        await reservasService.insertarReserva(id_cliente, id_tour, estado);
        res.status(201).json({ mensaje: 'Reserva insertada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar reserva' });
    }
};

// Actualizar una reserva existente
export const actualizarReserva = async (req, res) => {
    const { id_reserva } = req.params;
    const { id_cliente, id_tour, estado } = req.body;
    try {
        await reservasService.actualizarReserva(id_reserva, id_cliente, id_tour, estado);
        res.status(200).json({ mensaje: 'Reserva actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar reserva' });
    }
};

// Eliminar una reserva
export const eliminarReserva = async (req, res) => {
    const { id_reserva } = req.params;
    try {
        await reservasService.eliminarReserva(id_reserva);
        res.status(200).json({ mensaje: 'Reserva eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar reserva' });
    }
};
