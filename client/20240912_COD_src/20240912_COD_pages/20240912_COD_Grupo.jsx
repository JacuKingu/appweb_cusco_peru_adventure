import React, { useState, useEffect, useContext } from 'react';
import {
  obtenerGruposPorRol,
  obtenerGrupoPorIdYRol,
  insertarGrupo,
  actualizarGrupo,
  eliminarGrupo
} from '@services/20240912_COD_GrupoService'; // Ajusta la ruta según tu estructura
import { AuthContext } from '@context/20240912_COD_AuthContext'; // Ajusta la ruta según tu estructura

const Grupos = () => {
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado del contexto
  const [grupos, setGrupos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [grupoActual, setGrupoActual] = useState(null); // Para editar un grupo específico
  const [formValues, setFormValues] = useState({ // Valores del formulario
    id_pdf: '',
    nombre_grupo: ''
  });

  useEffect(() => {
    let isMounted = true;
    const cargarGruposSeguro = async () => {
      if (isMounted) {
        await cargarGrupos();
      }
    };
    cargarGruposSeguro();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (grupoActual) {
      setFormValues({
        id_pdf: grupoActual.id_pdf || '',
        nombre_grupo: grupoActual.nombre_grupo || ''
      });
    } else {
      limpiarFormulario();
    }
  }, [grupoActual]);

  const cargarGrupos = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = user?.rol || 'admin'; // Obtiene el rol del usuario autenticado
      const response = await obtenerGruposPorRol(rol);
      console.log('Respuesta de la API:', response);
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

  const manejarCambio = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (grupoActual) {
        // Actualizar grupo
        await actualizarGrupo(grupoActual.id_grupo, ...Object.values(formValues));
        setError('Grupo actualizado con éxito');
      } else {
        // Insertar nuevo grupo
        await insertarGrupo(...Object.values(formValues));
        setError('Grupo agregado con éxito');
      }
      cargarGrupos(); // Recargar la lista de grupos
      limpiarFormulario(); // Limpiar formulario
    } catch (error) {
      setError('Error al guardar el grupo: ' + error.message);
    }
  };

  const manejarEdicion = async (id_grupo) => {
    try {
      const rol = user?.rol || 'admin'; // Obtiene el rol del usuario autenticado
      const grupo = await obtenerGrupoPorIdYRol(id_grupo, rol);
      if (grupo) {
        setGrupoActual(grupo);
        setFormValues({
          id_pdf: grupo.id_pdf || '',
          nombre_grupo: grupo.nombre_grupo || ''
        });
      } else {
        setError('Error: No se encontraron datos para este grupo.');
      }
    } catch (error) {
      setError('Error al cargar el grupo: ' + error.message);
    }
  };

  const manejarEliminacion = async (id_grupo) => {
    try {
      await eliminarGrupo(id_grupo);
      setError('Grupo eliminado con éxito');
      cargarGrupos(); // Recargar la lista de grupos
    } catch (error) {
      setError('Error al eliminar el grupo: ' + error.message);
    }
  };

  const limpiarFormulario = () => {
    setGrupoActual(null);
    setFormValues({
      id_pdf: '',
      nombre_grupo: ''
    });
  };

  if (loading) return <p className="text-center mt-6">Cargando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Grupos</h1>
      {loading && <p className="text-center">Cargando...</p>}
      {/* Formulario para agregar/actualizar grupo */}
      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{grupoActual ? 'Actualizar Grupo' : 'Agregar Grupo'}</h2>
        <div className="mb-4">
          <input
            type="text"
            name="id_pdf"
            value={formValues.id_pdf}
            onChange={manejarCambio}
            placeholder="ID PDF"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="nombre_grupo"
            value={formValues.nombre_grupo}
            onChange={manejarCambio}
            placeholder="Nombre del Grupo"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {grupoActual ? 'Actualizar' : 'Agregar'}
        </button>
        {grupoActual && (
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

      {/* Tabla de grupos */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID PDF</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre del Grupo</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <tr key={grupo.id_grupo}>
              <td className="py-2 px-4 border-b border-gray-200">{grupo.id_grupo}</td>
              <td className="py-2 px-4 border-b border-gray-200">{grupo.id_pdf}</td>
              <td className="py-2 px-4 border-b border-gray-200">{grupo.nombre_grupo}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => manejarEdicion(grupo.id_grupo)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminacion(grupo.id_grupo)}
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

export default Grupos;
