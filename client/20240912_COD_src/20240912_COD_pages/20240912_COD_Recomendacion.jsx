import React, { useState, useEffect, useContext } from 'react';
import {
  obtenerRecomendacionesPorRol,
  obtenerRecomendacionPorIdYRol,
  insertarRecomendacion,
  actualizarRecomendacion,
  eliminarRecomendacion
} from '@services/20240912_COD_RecomendacionService'; // Ajusta la ruta según tu estructura
import { AuthContext } from '@context/20240912_COD_AuthContext'; // Ajusta la ruta según tu estructura
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Recomendaciones = () => {
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado del contexto
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [recomendacionActual, setRecomendacionActual] = useState(null); // Para editar una recomendación específica
  const [formValues, setFormValues] = useState({ // Valores del formulario
    id_cliente: '',
    id_tour: '',
    contenido: ''
  });

  useEffect(() => {
    let isMounted = true;
    const cargarRecomendacionesSeguro = async () => {
      if (isMounted) {
        await cargarRecomendaciones();
      }
    };
    cargarRecomendacionesSeguro();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (recomendacionActual) {
      setFormValues({
        id_cliente: recomendacionActual.id_cliente || '',
        id_tour: recomendacionActual.id_tour || '',
        contenido: recomendacionActual.contenido || ''
      });
    } else {
      limpiarFormulario();
    }
  }, [recomendacionActual]);

  const cargarRecomendaciones = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = user?.rol || 'admin'; // Obtiene el rol del usuario autenticado
      const response = await obtenerRecomendacionesPorRol(rol);
      console.log('Respuesta de la API:', response);
      if (response.success && Array.isArray(response.data)) {
        setRecomendaciones(response.data);
      } else {
        setRecomendaciones([]);
      }
    } catch (error) {
      setError('Error al cargar las recomendaciones: ' + error.message);
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
    try {
      if (recomendacionActual) {
        // Actualizar recomendación
        await actualizarRecomendacion(recomendacionActual.id_recomendacion, ...Object.values(formValues));
        setError('Recomendación actualizada con éxito');
      } else {
        // Insertar nueva recomendación
        await insertarRecomendacion(...Object.values(formValues));
        setError('Recomendación agregada con éxito');
      }
      cargarRecomendaciones(); // Recargar la lista de recomendaciones
      limpiarFormulario(); // Limpiar formulario
    } catch (error) {
      setError('Error al guardar la recomendación: ' + error.message);
    }
  };

  const manejarEdicion = async (id_recomendacion) => {
    try {
      const rol = user?.rol || 'admin'; // Obtiene el rol del usuario autenticado
      const recomendacion = await obtenerRecomendacionPorIdYRol(id_recomendacion, rol);
      if (recomendacion) {
        setRecomendacionActual(recomendacion);
        setFormValues({
          id_cliente: recomendacion.id_cliente || '',
          id_tour: recomendacion.id_tour || '',
          contenido: recomendacion.contenido || ''
        });
      } else {
        setError('Error: No se encontraron datos para esta recomendación.');
      }
    } catch (error) {
      setError('Error al cargar la recomendación: ' + error.message);
    }
  };

  const manejarEliminacion = async (id_recomendacion) => {
    try {
      await eliminarRecomendacion(id_recomendacion);
      setError('Recomendación eliminada con éxito');
      cargarRecomendaciones(); // Recargar la lista de recomendaciones
    } catch (error) {
      setError('Error al eliminar la recomendación: ' + error.message);
    }
  };

  const limpiarFormulario = () => {
    setRecomendacionActual(null);
    setFormValues({
      id_cliente: '',
      id_tour: '',
      contenido: ''
    });
  };

  if (loading) return <SpineLoader/>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Recomendaciones</h1>
      {loading && <p className="text-center">Cargando...</p>}
      {/* Formulario para agregar/actualizar recomendación */}
      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{recomendacionActual ? 'Actualizar Recomendación' : 'Agregar Recomendación'}</h2>
        <div className="mb-4">
          <input
            type="text"
            name="id_cliente"
            value={formValues.id_cliente}
            onChange={manejarCambio}
            placeholder="ID Cliente"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="id_tour"
            value={formValues.id_tour}
            onChange={manejarCambio}
            placeholder="ID Tour"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="contenido"
            value={formValues.contenido}
            onChange={manejarCambio}
            placeholder="Contenido de la Recomendación"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {recomendacionActual ? 'Actualizar' : 'Agregar'}
        </button>
        {recomendacionActual && (
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

      {/* Tabla de recomendaciones */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID Cliente</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID Tour</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Contenido</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recomendaciones.map((recomendacion) => (
            <tr key={recomendacion.id_recomendacion}>
              <td className="py-2 px-4 border-b border-gray-200">{recomendacion.id_recomendacion}</td>
              <td className="py-2 px-4 border-b border-gray-200">{recomendacion.id_cliente}</td>
              <td className="py-2 px-4 border-b border-gray-200">{recomendacion.id_tour}</td>
              <td className="py-2 px-4 border-b border-gray-200">{recomendacion.contenido}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => manejarEdicion(recomendacion.id_recomendacion)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminacion(recomendacion.id_recomendacion)}
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

export default Recomendaciones;
