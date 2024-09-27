import React, { useState, useEffect, useContext } from 'react';
import { 
    obtenerClientesPorRol,
    obtenerClientePorIdYRol,
    insertarCliente,
    actualizarCliente,
    eliminarCliente 
} from '@services/20240912_COD_ClienteService';
import { AuthContext } from '@context/20240912_COD_AuthContext';
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Clientes = () => {
    const { user } = useContext(AuthContext); // Obtiene el usuario autenticado del contexto
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [clienteActual, setClienteActual] = useState(null); // Para editar un cliente específico
    const [formValues, setFormValues] = useState({ // Valores del formulario
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        id_grupo: ''
    });

    useEffect(() => {
        let isMounted = true;
        const cargarClienteSeguro = async () => {
            if (isMounted) {
                await cargarClientes();
            }
        };
        cargarClienteSeguro();
        return () => {
            isMounted = false;
        };
    },[]);

    useEffect(() => {
        if (clienteActual) {
          setFormValues({
            nombre: clienteActual.nombre || '',
            apellido: clienteActual.apellido || '',
            email: clienteActual.email || '',
            telefono: clienteActual.telefono || '',
            fecha_nacimiento: clienteActual.fecha_nacimiento || '',
            id_grupo: clienteActual.id_grupo || ''
          });
        } else {
          limpiarFormulario();
        }
      }, [clienteActual]);

    const cargarClientes = async () => {
        setLoading(true);
        setError('');
        try {
            const rol = user?.rol || 'admin'; // Usa el rol del usuario autenticado o admin por defecto
            const response = await obtenerClientesPorRol(rol);
            console.log('Respuesta de la API:', response);
            if (response.success && Array.isArray(response.data)) {
                setClientes(response.data);
            } else {
                setClientes([]);
            }
            
        } catch (error) {
            setError('Error al cargar los clientes: ' + error.message);
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
            const valoresLimpios = {
                nombre: formValues.nombre || null,
                apellido: formValues.apellido || null,
                email: formValues.email || null,
                telefono: formValues.telefono || null,
                fecha_nacimiento: formValues.fecha_nacimiento || null,
                id_grupo: formValues.id_grupo !== undefined ? formValues.id_grupo : null
            };
            console.log('Ingreso de datos:', valoresLimpios);

            if (clienteActual) {
                // Actualizar cliente
                await actualizarCliente(clienteActual.id_cliente, ...Object.values(valoresLimpios));
                setError('Cliente actualizado con éxito');
            } else {
                // Insertar nuevo cliente
                await insertarCliente(...Object.values(valoresLimpios));
                setError('Cliente agregado con éxito');
            }
            cargarClientes(); // Recargar la lista de clientes
            limpiarFormulario(); // Limpiar formulario
        } catch (error) {
            setError('Error al guardar el cliente: ' + error.message);
        }
    };

    const manejarEdicion = async (id_cliente) => {
        try {
            const rol = user?.rol || 'admin'; // Usa el rol del usuario autenticado o admin por defecto
            console.log("Este es el rol:", rol);
            const cliente = await obtenerClientePorIdYRol(id_cliente, rol);
            if (cliente) {
                setClienteActual(cliente);
                setFormValues({
                    nombre: cliente.nombre || '',
                    apellido: cliente.apellido || '',
                    email: cliente.email || '',
                    telefono: cliente.telefono || '',
                    fecha_nacimiento: cliente.fecha_nacimiento || '',
                    id_grupo: cliente.id_grupo || ''
                });
            } else {
                setError('Error: No se encontraron datos para este cliente.');
            }
        } catch (error) {
            setError('Error al cargar el cliente: ' + error.message);
        }
    };

    const manejarEliminacion = async (id_cliente) => {
        try {
            await eliminarCliente(id_cliente);
            setError('Cliente eliminado con éxito');
            cargarClientes(); // Recargar la lista de clientes
        } catch (error) {
            setError('Error al eliminar el cliente: ' + error.message);
        }
    };

    const limpiarFormulario = () => {
        setClienteActual(null);
        setFormValues({
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            fecha_nacimiento: '',
            id_grupo: ''
        });
    };

    if (loading) return <SpineLoader/>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>
            
            {/* Formulario para agregar/actualizar cliente */}
            <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">{clienteActual ? 'Actualizar Cliente' : 'Agregar Cliente'}</h2>
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
                        name="apellido" 
                        value={formValues.apellido} 
                        onChange={manejarCambio} 
                        placeholder="Apellido" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="email" 
                        name="email" 
                        value={formValues.email} 
                        onChange={manejarCambio} 
                        placeholder="Email" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="tel" 
                        name="telefono" 
                        value={formValues.telefono} 
                        onChange={manejarCambio} 
                        placeholder="Teléfono" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="date" 
                        name="fecha_nacimiento" 
                        value={formValues.fecha_nacimiento} 
                        onChange={manejarCambio} 
                        placeholder="Fecha de Nacimiento" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <div className="mb-4">
                    <input 
                        type="number" 
                        name="id_grupo" 
                        value={formValues.id_grupo} 
                        onChange={manejarCambio} 
                        placeholder="ID del Grupo" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    {clienteActual ? 'Actualizar' : 'Agregar'}
                </button>
                {clienteActual && (
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

            {/* Tabla de clientes */}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Apellido</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Email</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Teléfono</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Fecha de Nacimiento</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Grupo</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id_cliente}>
                            <td className="py-2 px-4 border-b border-gray-200">{cliente.id_cliente}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cliente.nombre}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cliente.apellido}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cliente.email}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cliente.telefono}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cliente.fecha_nacimiento}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cliente.id_grupo}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <button 
                                    onClick={() => manejarEdicion(cliente.id_cliente)} 
                                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => manejarEliminacion(cliente.id_cliente)} 
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

export default Clientes;
