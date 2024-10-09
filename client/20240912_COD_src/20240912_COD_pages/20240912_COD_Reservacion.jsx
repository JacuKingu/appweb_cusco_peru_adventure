import React, { useState, useEffect } from 'react';
import {
  obtenerReservasPorRol,
  obtenerReservaPorIdYRol,
  insertarReserva,
  actualizarReserva,
  eliminarReserva
} from '@services/20240912_COD_ReservaService'; // Ajusta la ruta según tu estructura
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reservaActual, setReservaActual] = useState(null); // Para editar una reserva específica
  const [formValues, setFormValues] = useState({ // Valores del formulario
    id_cliente: '',
    id_tour: '',
    estado: ''
  });

  useEffect(() => {
    let isMounted = true;
    const cargarReservasSeguro = async () => {
      if (isMounted) {
        await cargarReservas();
      }
    };
    cargarReservasSeguro();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (reservaActual) {
      setFormValues({
        id_cliente: reservaActual.id_cliente || '',
        id_tour: reservaActual.id_tour || '',
        estado: reservaActual.estado || ''
      });
    } else {
      limpiarFormulario();
    }
  }, [reservaActual]);

  const cargarReservas = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerReservasPorRol(rol);
      console.log('Respuesta de la API:', response);
      if (response.success && Array.isArray(response.data)) {
        setReservas(response.data);
      } else {
        setReservas([]);
      }
    } catch (error) {
      setError('Error al cargar las reservas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const manejarCambio = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Verificar que todos los campos estén completos
    if (!formValues.id_cliente || !formValues.id_tour || !formValues.estado) {
      setError('Por favor, complete todos los campos antes de enviar.');
      return;
    }

    try {
      if (reservaActual) {
        // Actualizar reserva
        await actualizarReserva(reservaActual.id_reserva, ...Object.values(formValues));
        setError('Reserva actualizada con éxito');
      } else {
        // Insertar nueva reserva
        await insertarReserva(...Object.values(formValues));
        setError('Reserva agregada con éxito');
      }
      cargarReservas(); // Recargar la lista de reservas
      limpiarFormulario(); // Limpiar formulario
    } catch (error) {
      setError('Error al guardar la reserva: ' + error.message);
    }
  };

  const manejarEdicion = async (id_reserva) => {
    try {
      const rol = localStorage.getItem('rolUser');
      const reserva = await obtenerReservaPorIdYRol(id_reserva, rol);
      if (reserva.success && reserva.data && reserva.data.length > 0) {
        const datosReserva = reserva.data[0];
        setReservaActual(datosReserva);
        setFormValues({
          id_cliente: datosReserva.id_cliente || '',
          id_tour: datosReserva.id_tour || '',
          estado: datosReserva.estado || ''
        });
      } else {
        setError('Error: No se encontraron datos para esta reserva.');
      }
    } catch (error) {
      setError('Error al cargar la reserva: ' + error.message);
    }
  };

  const manejarEliminacion = async (id_reserva) => {
    try {
      await eliminarReserva(id_reserva);
      setError('Reserva eliminada con éxito');
      cargarReservas(); // Recargar la lista de reservas
    } catch (error) {
      setError('Error al eliminar la reserva: ' + error.message);
    }
  };

  const limpiarFormulario = () => {
    setReservaActual(null);
    setFormValues({
      id_cliente: '',
      id_tour: '',
      estado: ''
    });
  };

  if (loading) return <SpineLoader />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
      {loading && <p className="text-center">Cargando...</p>}
      {/* Formulario para agregar/actualizar reserva */}
      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{reservaActual ? 'Actualizar Reserva' : 'Agregar Reserva'}</h2>
        <div className="mb-4">
          <input
            type="text"
            name="id_cliente"
            value={formValues.id_cliente}
            onChange={manejarCambio}
            placeholder="ID del Cliente"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="id_tour"
            value={formValues.id_tour}
            onChange={manejarCambio}
            placeholder="ID del Tour"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <select
            name="estado"
            value={formValues.estado}
            onChange={manejarCambio}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar estado</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {reservaActual ? 'Actualizar' : 'Agregar'}
        </button>
        {reservaActual && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 mt-4"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tabla de reservas */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID Cliente</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID Tour</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Estado</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id_reserva}>
              <td className="py-2 px-4 border-b border-gray-200">{reserva.id_reserva}</td>
              <td className="py-2 px-4 border-b border-gray-200">{reserva.id_cliente}</td>
              <td className="py-2 px-4 border-b border-gray-200">{reserva.id_tour}</td>
              <td className="py-2 px-4 border-b border-gray-200">{reserva.estado}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => manejarEdicion(reserva.id_reserva)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminacion(reserva.id_reserva)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservas;
