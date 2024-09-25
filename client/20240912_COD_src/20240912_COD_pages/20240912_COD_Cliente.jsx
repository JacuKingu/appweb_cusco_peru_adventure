import React, { useState, useEffect } from 'react';
import { 
    obtenerClientesPorRol, 
    obtenerClientePorIdYRol, 
    insertarCliente, 
    actualizarCliente, 
    eliminarCliente 
} from '@services/20240912_COD_ClienteService';

const Clientes = () => {
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
        cargarClientes(); // Cargar clientes al montar el componente
    }, []);

    const cargarClientes = async () => {
        setLoading(true);
        setError('');
        try {
            const rol = 'admin'; // Cambia según tu lógica de roles
            const response = await obtenerClientesPorRol(rol);
            setClientes(response);
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
            if (clienteActual) {
                // Actualizar cliente
                await actualizarCliente(clienteActual.id_cliente, ...Object.values(formValues));
                setError('Cliente actualizado con éxito');
            } else {
                // Insertar nuevo cliente
                await insertarCliente(...Object.values(formValues));
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
            const rol = 'admin'; // Cambia según tu lógica de roles
            const cliente = await obtenerClientePorIdYRol(id_cliente, rol);
            setClienteActual(cliente); // Establecer el cliente actual para edición
            setFormValues(cliente); // Llenar el formulario con los datos del cliente
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

    if (loading) return <p className="text-center mt-6">Cargando...</p>;

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
