import React, { useState, useEffect, useContext } from 'react';
import {
  obtenerPasaportesPorRol,
  obtenerPasaportePorIdYRol,
  insertarPasaporte,
  actualizarPasaporte,
  eliminarPasaporte
} from '@services/20240912_COD_PasaporteService';
import { AuthContext } from '@context/20240912_COD_AuthContext';
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Pasaportes = () => {
  const { user } = useContext(AuthContext); // Obtener el usuario autenticado del contexto
  const [pasaportes, setPasaportes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pasaporteActual, setPasaporteActual] = useState(null); // Para editar un pasaporte específico
  const [formValues, setFormValues] = useState({ // Valores del formulario
    id_cliente: '',
    numero_pasaporte: '',
    pais_emision: '',
    fecha_expiracion: ''
  });

  // Cargar los pasaportes al montar el componente
  useEffect(() => {
    let isMounted = true; // Bandera para verificar si el componente está montado
    const cargarPasaportesSeguro = async () => {
      if (isMounted) {
        await cargarPasaportes(); // Llama a cargarPasaportes solo si el componente está montado
      }
    };
    cargarPasaportesSeguro();
    return () => {
      isMounted = false; // Limpia la bandera al desmontar el componente
    };
  }, []);

  // Actualizar el formulario si cambia el pasaporte actual
  useEffect(() => {
    if (pasaporteActual) {
      setFormValues({
        id_cliente: pasaporteActual.id_cliente || '',
        numero_pasaporte: pasaporteActual.numero_pasaporte || '',
        pais_emision: pasaporteActual.pais_emision || '',
        fecha_expiracion: pasaporteActual.fecha_expiracion || ''
      });
    } else {
      limpiarFormulario(); // Limpia el formulario si `pasaporteActual` es `null` o `undefined`
    }
  }, [pasaporteActual]);

  // Cargar pasaportes según el rol del usuario autenticado
  const cargarPasaportes = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = user?.rol || 'admin'; // Obtiene el rol del usuario autenticado
      const response = await obtenerPasaportesPorRol(rol);
      console.log('Respuesta de la API:', response);
      if (response.success && Array.isArray(response.data)) {
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

  // Manejar cambios en los inputs del formulario
  const manejarCambio = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const valoresLimpios = {
        id_cliente: formValues.id_cliente || null,
        numero_pasaporte: formValues.numero_pasaporte || null,
        pais_emision: formValues.pais_emision || null,
        fecha_expiracion: formValues.fecha_expiracion || null
      };
      console.log('Ingreso de datos:', valoresLimpios);

      if (pasaporteActual) {
        // Actualizar pasaporte
        await actualizarPasaporte(pasaporteActual.id_pasaporte, ...Object.values(valoresLimpios));
        setError('Pasaporte actualizado con éxito');
      } else {
        // Insertar nuevo pasaporte
        await insertarPasaporte(...Object.values(valoresLimpios));
        setError('Pasaporte agregado con éxito');
      }
      cargarPasaportes(); // Recargar la lista de pasaportes
      limpiarFormulario(); // Limpiar formulario
    } catch (error) {
      setError('Error al guardar el pasaporte: ' + error.message);
    }
  };

  // Manejar edición de un pasaporte
  const manejarEdicion = async (id_pasaporte) => {
    try {
      const rol = user?.rol || 'admin'; // Obtiene el rol del usuario autenticado
      const pasaporte = await obtenerPasaportePorIdYRol(id_pasaporte, rol);
      setPasaporteActual(pasaporte); // Establecer el pasaporte actual para edición
      setFormValues({
        id_cliente: pasaporte.id_cliente || '',
        numero_pasaporte: pasaporte.numero_pasaporte || '',
        pais_emision: pasaporte.pais_emision || '',
        fecha_expiracion: pasaporte.fecha_expiracion || ''
      });
    } catch (error) {
      setError('Error al cargar el pasaporte: ' + error.message);
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

  if (loading) return <SpineLoader/>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Pasaportes</h1>
      {loading && <p className="text-center">Cargando...</p>}
      {/* Formulario para agregar/actualizar pasaporte */}
      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{pasaporteActual ? 'Actualizar Pasaporte' : 'Agregar Pasaporte'}</h2>
        <div className="mb-4">
          <input
            type="number"
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
        {pasaporteActual && (
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

      {/* Tabla de pasaportes */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID Cliente</th>
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
              <td className="py-2 px-4 border-b border-gray-200">{pasaporte.id_cliente}</td>
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
