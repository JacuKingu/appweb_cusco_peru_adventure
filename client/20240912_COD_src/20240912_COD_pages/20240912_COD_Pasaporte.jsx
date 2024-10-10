import React, { useState, useEffect } from 'react';
import {
  obtenerPasaportesPorRol,
  obtenerPasaportePorIdYRol,
  insertarPasaporte,
  actualizarPasaporte,
  eliminarPasaporte
} from '@services/20240912_COD_PasaporteService';
import { obtenerClientesPorRol } from '@services/20240912_COD_ClienteService'; // Servicio para obtener clientes
import SpineLoader from '@components/20240912_COD_LoadingSpinner';
import { formatoFecha } from '@utils/20240912_COD_utils';

const Pasaportes = () => {
  const [pasaportes, setPasaportes] = useState([]);
  const [clientes, setClientes] = useState([]); // Estado para almacenar clientes
  const [pasaporteActual, setPasaporteActual] = useState(null); // Define el estado para el pasaporte actual
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    id_cliente: '',
    numero_pasaporte: '',
    pais_emision: '',
    fecha_expiracion: ''
  });

  // Cargar clientes y pasaportes al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      await cargarPasaportes();
      await cargarClientes();
    };
    cargarDatos();
  }, []);

  // Cargar clientes para el select
  const cargarClientes = async () => {
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerClientesPorRol(rol);
      if (response.success) {
        setClientes(response.data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      setError('Error al cargar los clientes: ' + error.message);
    }
  };

  // Cargar pasaportes según el rol del usuario
  const cargarPasaportes = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerPasaportesPorRol(rol);
      if (response.success) {
        setPasaportes(response.data);
      } else {
        setPasaportes([]);
      }
    } catch (error) {
      setError('Error al cargar los pasaportes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la edición de un pasaporte
  const manejarEdicion = async (id_pasaporte) => {
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerPasaportePorIdYRol(id_pasaporte, rol);
      if (response.success && response.data) {
        const pasaporte = response.data[0];
        setPasaporteActual(pasaporte);
        setFormValues({
          id_cliente: pasaporte.id_cliente,
          numero_pasaporte: pasaporte.numero_pasaporte,
          pais_emision: pasaporte.pais_emision,
          fecha_expiracion: formatoFecha(pasaporte.fecha_expiracion)
        });
      }
    } catch (error) {
      setError('Error al cargar el pasaporte para editar: ' + error.message);
    }
  };

  // Manejar eliminación de un pasaporte
  const manejarEliminacion = async (id_pasaporte) => {
    try {
      await eliminarPasaporte(id_pasaporte);
      setError('Pasaporte eliminado con éxito');
      cargarPasaportes(); // Recargar la lista de pasaportes
    } catch (error) {
      setError('Error al eliminar el pasaporte: ' + error.message);
    }
  };

  // Manejar cambios en los inputs del formulario
  const manejarCambio = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    try {
      const valoresLimpios = {
        id_cliente: formValues.id_cliente,
        numero_pasaporte: formValues.numero_pasaporte,
        pais_emision: formValues.pais_emision,
        fecha_expiracion: formValues.fecha_expiracion
      };

      if (pasaporteActual) {
        await actualizarPasaporte(pasaporteActual.id_pasaporte, ...Object.values(valoresLimpios));
        setError('Pasaporte actualizado con éxito');
      } else {
        await insertarPasaporte(...Object.values(valoresLimpios));
        setError('Pasaporte agregado con éxito');
      }
      cargarPasaportes(); // Recargar la lista de pasaportes
      limpiarFormulario();
    } catch (error) {
      setError('Error al guardar el pasaporte: ' + error.message);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setPasaporteActual(null);
    setFormValues({
      id_cliente: '',
      numero_pasaporte: '',
      pais_emision: '',
      fecha_expiracion: ''
    });
  };

  if (loading) return <SpineLoader />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Pasaportes</h1>


      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{pasaporteActual ? 'Actualizar Pasaporte' : 'Agregar Pasaporte'}</h2>


        <div className="mb-4">
          <select
            name="id_cliente"
            value={formValues.id_cliente}
            onChange={manejarCambio}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="numero_pasaporte"
            value={formValues.numero_pasaporte}
            onChange={manejarCambio}
            placeholder="Número de Pasaporte"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="pais_emision"
            value={formValues.pais_emision}
            onChange={manejarCambio}
            placeholder="País de Emisión"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="date"
            name="fecha_expiracion"
            value={formValues.fecha_expiracion}
            onChange={manejarCambio}
            placeholder="Fecha de Expiración"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {pasaporteActual ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}


      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID Pasaporte</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre Cliente</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Número de Pasaporte</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">País de Emisión</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Fecha de Expiración</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pasaportes.map((pasaporte) => (
            <tr key={pasaporte.id_pasaporte}>
              <td className="py-2 px-4 border-b border-gray-200">{pasaporte.id_pasaporte}</td>
              <td className="py-2 px-4 border-b border-gray-200">

                {clientes.find(cliente => cliente.id_cliente === pasaporte.id_cliente)?.nombre}{" "}
                {clientes.find(cliente => cliente.id_cliente === pasaporte.id_cliente)?.apellido}
              </td>
              <td className="py-2 px-4 border-b border-gray-200">{pasaporte.numero_pasaporte}</td>
              <td className="py-2 px-4 border-b border-gray-200">{pasaporte.pais_emision}</td>
              <td className="py-2 px-4 border-b border-gray-200">{pasaporte.fecha_expiracion}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => manejarEdicion(pasaporte.id_pasaporte)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminacion(pasaporte.id_pasaporte)}
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

export default Pasaportes;
