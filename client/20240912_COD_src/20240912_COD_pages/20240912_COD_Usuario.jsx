import React, { useState, useEffect } from 'react';
import {
  obtenerUsuariosPorRol,
  obtenerUsuarioPorIdYRol,
  insertarUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '@services/20240912_COD_UsuarioService'; // Ajusta la ruta según tu estructura
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [usuarioActual, setUsuarioActual] = useState(null); // Para editar un usuario específico
  const [formValues, setFormValues] = useState({ // Valores del formulario
    nombre: '',
    contraseña: '',
    rol: 'usuario' // Rol predeterminado para el formulario
  });

  useEffect(() => {
    let isMounted = true;
    const cargarUsuariosSeguro = async () => {
      if (isMounted) {
        await cargarUsuarios();
      }
    };
    cargarUsuariosSeguro();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (usuarioActual) {
      setFormValues({
        nombre: usuarioActual.nombre || '',
        contraseña: '',
        rol: usuarioActual.rol || 'usuario'
      });
    } else {
      limpiarFormulario();
    }
  }, [usuarioActual]);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const rol = localStorage.getItem('rolUser');
      const response = await obtenerUsuariosPorRol(rol);
      console.log('Respuesta de la API:', response);
      if (response.success && Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      setError('Error al cargar los usuarios: ' + error.message);
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
      if (usuarioActual) {
        // Actualizar usuario
        await actualizarUsuario(usuarioActual.id_usuario, ...Object.values(formValues));
        setError('Usuario actualizado con éxito');
      } else {
        // Insertar nuevo usuario
        await insertarUsuario(...Object.values(formValues));
        setError('Usuario agregado con éxito');
      }
      cargarUsuarios(); // Recargar la lista de usuarios
      limpiarFormulario(); // Limpiar formulario
    } catch (error) {
      setError('Error al guardar el usuario: ' + error.message);
    }
  };

  const manejarEdicion = async (id_usuario) => {
    try {
      const rol = localStorage.getItem('rolUser');
      const usuario = await obtenerUsuarioPorIdYRol(id_usuario, rol);
      if (usuario.success && usuario.data && usuario.data.length > 0) {
        const datosUsuario = usuario.data[0];
        setUsuarioActual(datosUsuario);
        setFormValues({
          nombre: datosUsuario.nombre,
          contraseña:  '',
          rol: datosUsuario.rol
        });
      } else {
        setError('Error: No se encontraron datos para este usuario.');
      }
    } catch (error) {
      setError('Error al cargar el usuario: ' + error.message);
    }
  };

  const manejarEliminacion = async (id_usuario) => {
    try {
      await eliminarUsuario(id_usuario);
      setError('Usuario eliminado con éxito');
      cargarUsuarios(); // Recargar la lista de usuarios
    } catch (error) {
      setError('Error al eliminar el usuario: ' + error.message);
    }
  };

  const limpiarFormulario = () => {
    setUsuarioActual(null);
    setFormValues({
      nombre: '',
      contraseña: '',
      rol: ''
    });
  };

  if (loading) return <SpineLoader/>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      {loading && <p className="text-center">Cargando...</p>}
      {/* Formulario para agregar/actualizar usuario */}
      <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">{usuarioActual ? 'Actualizar Usuario' : 'Agregar Usuario'}</h2>
        <div className="mb-4">
          <input
            type="text"
            name="nombre"
            value={formValues.nombre}
            onChange={manejarCambio}
            placeholder="Nombre"
            className="w-full px-4 py-2 border rouned-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete='username'
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="contraseña"
            value={formValues.contraseña}
            onChange={manejarCambio}
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete='new-password'
          />
        </div>
        <div className="mb-4">
          <select
            name="rol"
            value={formValues.rol}
            onChange={manejarCambio}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar</option>
            <option value="asesor">Asesor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {usuarioActual ? 'Actualizar' : 'Agregar'}
        </button>
        {usuarioActual && (
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

      {/* Tabla de usuarios */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Rol</th>
            <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td className="py-2 px-4 border-b border-gray-200">{usuario.id_usuario}</td>
              <td className="py-2 px-4 border-b border-gray-200">{usuario.nombre}</td>
              <td className="py-2 px-4 border-b border-gray-200">{usuario.rol}</td>
              <td className="py-2 px-4 border-b border-gray-200">
                <button
                  onClick={() => manejarEdicion(usuario.id_usuario)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminacion(usuario.id_usuario)}
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

export default Usuarios;
