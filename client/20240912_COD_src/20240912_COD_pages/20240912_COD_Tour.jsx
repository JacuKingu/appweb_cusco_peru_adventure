import React, { useState, useEffect } from 'react';
import {
  obtenerToursActivos,
  obtenerTourPorIdYRol,
  insertarTour,
  actualizarTour,
  eliminarTour
} from '@services/20240912_COD_TourService';
import SpineLoader from '@components/20240912_COD_LoadingSpinner';
import ConfirmarModal from '@components/20240912_COD_ConfirmarModal';

const Tour = () => {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tourActual, setTourActual] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    categoria: ''
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [tourSeleccionado, setTourSeleccionado] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const cargarToursSeguro = async () => {
      if (isMounted) {
        await cargarTours();
      }
    };
    cargarToursSeguro();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (tourActual) {
      setFormValuesFromTour(tourActual);
    } else {
      limpiarFormulario();
    }
  }, [tourActual]);

  const setFormValuesFromTour = (tour) => {
    setFormValues({
      nombre: tour.tour || '',
      descripcion: tour.descripcion || '',
      duracion: tour.duracion || '',
      precio: tour.precio || '',
      categoria: tour.categoria || ''
    });
  };

  const cargarTours = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerToursActivos(rol);
      if (response.success && Array.isArray(response.data)) {
        setTours(response.data);
      } else {
        setTours([]);
      }
    } catch (error) {
      setError('Error al cargar los tours: ' + error.message);
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
    if (tourActual) {
      // Actualizar cliente
      setModalAction('update');
    } else {
      // Insertar nuevo cliente
      setModalAction('add');
    }

    setModalOpen(true);
  };

  const obtenerMensajeModal = () => {
    if (modalAction === 'add') return '¿Estás seguro de que deseas agregar este tour?';
    if (modalAction === 'update') return '¿Estás seguro de que deseas actualizar este tour?';
    if (modalAction === 'delete') return '¿Estás seguro de que deseas eliminar este tour?';
    return '';
  };

  const confirmarAccion = async () => {
    const valoresLimpios = {
      nombre: formValues.nombre || null,
      descripcion: formValues.descripcion || null,
      duracion: formValues.duracion !== undefined ? formValues.duracion : null,
      precio: formValues.precio !== undefined ? formValues.precio : null,
      categoria: formValues.categoria || null
    };
    try {
      if (modalAction === 'add') {
        await insertarTour(...Object.values(valoresLimpios));
        setError('Tour agregado con éxito');
      } else if (modalAction === 'update') {
        await actualizarTour(tourActual.id_tour, ...Object.values(valoresLimpios));
        setError('Tour actualizado con éxito');
      } else if (modalAction === 'delete') {
        await eliminarTour(tourSeleccionado);
        setError('Tour eliminado con éxito');
      }
      await cargarTours(); // Recarga la lista de clientes
      limpiarFormulario();
    } catch (error) {
      setError('Error al procesar la acción: ' + error.message);
    } finally {
      setModalOpen(false);
      setTourSeleccionado(null);
    }
  };

  const manejarEdicion = async (id_tour) => {
    try {
      const rol = localStorage.getItem('rolUser');
      const tour = await obtenerTourPorIdYRol(id_tour, rol);
      if (tour.success && tour.data && tour.data.length > 0) {
        const datosTour = tour.data[0];
        setTourActual(datosTour);
        setFormValuesFromTour(datosTour);
      } else {
        setTourActual(null);
        setError('Error: No se encontraron datos para este tour.');
      }
    } catch (error) {
      setError('Error al cargar el tour: ' + error.message);
    }
  };

  const manejarEliminacion = async (id_tour) => {
    setTourSeleccionado(id_tour);
    setModalAction('delete');
    setModalOpen(true);
  };

  const limpiarFormulario = () => {
    setTourActual(null);
    setFormValues({
      nombre: '',
      descripcion: '',
      duracion: '',
      precio: '',
      categoria: ''
    });
  };

  if (loading) return <SpineLoader />;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tours</h1>
      {loading && <p className="text-center">Cargando...</p>}
      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{tourActual ? 'Actualizar Tour' : 'Agregar Tour'}</h2>
        <div className="mb-4">
          <input
            type="text"
            name="nombre"
            value={formValues.nombre}
            onChange={manejarCambio}
            placeholder="Nombre"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="descripcion"
            value={formValues.descripcion}
            onChange={manejarCambio}
            placeholder="Descripción"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="duracion"
            value={formValues.duracion}
            onChange={manejarCambio}
            placeholder="Duración (horas)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            name="precio"
            value={formValues.precio}
            onChange={manejarCambio}
            placeholder="Precio"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="categoria"
            value={formValues.categoria}
            onChange={manejarCambio}
            placeholder="Categoría"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {tourActual ? 'Actualizar' : 'Agregar'}
        </button>
        {tourActual && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 mt-4"
          >
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Descripción</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Duración (horas)</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Precio</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Categoría</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id_tour}>
              <td className="py-2 px-4 border-b border-gray-200">{tour.id_tour}</td>
              <td className="py-2 px-4 border-b border-gray-200">{tour.tour}</td>
              <td className="py-2 px-4 border-b border-gray-200">{tour.descripcion}</td>
              <td className="py-2 px-4 border-b border-gray-200">{tour.duracion}</td>
              <td className="py-2 px-4 border-b border-gray-200">{tour.precio}</td>
              <td className="py-2 px-4 border-b border-gray-200">{tour.categoria}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => manejarEdicion(tour.id_tour)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminacion(tour.id_tour)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmarModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarAccion}
        mensaje={obtenerMensajeModal()}
      />
    </div>
  );
};

export default Tour;
