import React, { useState, useEffect } from 'react';
import {
  obtenerRecomendacionesPorRol,
  obtenerRecomendacionPorIdYRol,
  insertarRecomendacion,
  actualizarRecomendacion,
  eliminarRecomendacion,
  obtenerYProcesarEdades // Importar el servicio para procesar edades
} from '@services/20240912_COD_RecomendacionService'; 
import { obtenerGruposPorRol } from '@services/20240912_COD_GrupoService';
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Recomendaciones = () => {
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [grupos, setGrupos] = useState([]); // Estado para almacenar grupos
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [recomendacionActual, setRecomendacionActual] = useState(null); // Para editar una recomendación específica
  const [formValues, setFormValues] = useState({ // Valores del formulario
    id_grupo: '',
    contenido: ''
  });

  useEffect(() => {
    let isMounted = true;
    const cargarDatos = async () => {
      if (isMounted) {
        await cargarRecomendaciones();
        await cargarGrupos();
      }
    };
    cargarDatos();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (recomendacionActual) {
      setFormValues({
        id_grupo: recomendacionActual.id_grupo || '',
        contenido: recomendacionActual.contenido || ''
      });
    } else {
      limpiarFormulario();
    }
  }, [recomendacionActual]);

  // Cargar grupos para el select
  const cargarGrupos = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerGruposPorRol(rol);
      if (response.success && Array.isArray(response.data)) {
        setGrupos(response.data);
      } else {
        setGrupos([]);
      }
    } catch (error) {
      setError('Error al cargar los grupos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar recomendaciones
  const cargarRecomendaciones = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerRecomendacionesPorRol(rol);
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

  // Manejar el cambio del select para grupos y procesar edades
  const manejarCambioGrupo = async (e) => {
    const id_grupo = e.target.value;
    setFormValues({ ...formValues, id_grupo }); // Actualizar el id_grupo en el formulario

    if (id_grupo) {
      try {
        const response = await obtenerYProcesarEdades(id_grupo); // Llamar al servicio
        if (response.success) {
          const { tour_recomendado } = response.data;
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            contenido: tour_recomendado // Guardar el tour recomendado en contenido
          }));
        } else {
          setError('Error al procesar las edades.');
        }
      } catch (error) {
        setError('Error al obtener y procesar las edades: ' + error.message);
      }
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
      const rol = localStorage.getItem('rolUser');
      const recomendacion = await obtenerRecomendacionPorIdYRol(id_recomendacion, rol);
      if (recomendacion.success && recomendacion.data && recomendacion.data.length > 0) {
        const datosRecomendacion = recomendacion.data[0];
        setRecomendacionActual(datosRecomendacion);
        setFormValues({
          id_grupo: datosRecomendacion.id_grupo || '',
          contenido: datosRecomendacion.contenido || ''
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
      id_grupo: '',
      contenido: ''
    });
  };

  if (loading) return <SpineLoader/>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Recomendaciones</h1>
      {loading && <p className="text-center">Cargando...</p>}

      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{recomendacionActual ? 'Actualizar Recomendación' : 'Agregar Recomendación'}</h2>

        <div className="mb-4">
          <label htmlFor="id_grupo" className="block text-sm font-medium text-gray-700">Seleccionar Grupo</label>
          <select
            name="id_grupo"
            value={formValues.id_grupo}
            onChange={manejarCambioGrupo} // Actualizamos esta función para manejar el procesamiento
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un Grupo</option>
            {grupos.map((grupo) => (
              <option key={grupo.id_grupo} value={grupo.id_grupo}>
                {grupo.grupo}
              </option>
            ))}
          </select>
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

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Grupo</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Contenido</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recomendaciones.map((recomendacion) => (
            <tr key={recomendacion.id_recomendacion}>
              <td className="py-2 px-4 border-b border-gray-200">{recomendacion.id_recomendacion}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                {grupos.find(grupo => grupo.id_grupo === recomendacion.id_grupo)?.grupo}
              </td>
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
