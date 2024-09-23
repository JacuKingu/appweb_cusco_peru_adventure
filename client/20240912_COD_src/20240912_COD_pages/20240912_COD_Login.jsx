// 20240912_COD_Login.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '@services/20240912_COD_AuthService';

const Login = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Manejo de errores
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para deshabilitar el botón
    const navigate = useNavigate(); // Hook para redirigir

    // Detectar si la página se ha recargado
    useEffect(() => {
        console.log('Componente Login montado o actualizado.');
    }, []); // [] asegura que este efecto solo se ejecute en el montaje del componente

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault(); // Prevenir la recarga del formulario
        setError(''); // Limpiar cualquier mensaje de error previo
        setIsSubmitting(true); // Deshabilitar el botón de envío

        try {
            // Llamada al servicio de autenticación
            const data = await loginUsuario(nombre, password);

            // Guardar el token en el almacenamiento local (localStorage)
            localStorage.setItem('authToken', data.token);
            console.log(data.message);
            console.log(data.token);

            // Redirigir al usuario a la página principal
            navigate('/home');
        } catch (error) {
            console.error('Error en la autenticación:', error);
            console.log('Autenticación fallida, manteniendo en la página de inicio de sesión');

            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Credenciales incorrectas'); // Mensaje del backend
            } else {
                setError('Error de conexión. Por favor, intente nuevamente.'); // Mensaje genérico
            }
        } finally {
            setIsSubmitting(false); // Habilitar el botón de nuevo
        }
    }, [nombre, password, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

                {/* Mostrar el mensaje de error si existe */}
                {error && (
                    <div className="mb-4 text-red-500 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de Usuario</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                            placeholder="Introduce tu nombre"
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring focus:border-blue-300`}
                            placeholder="Introduce tu contraseña"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting} // Deshabilitar el botón mientras se envía el formulario
                        >
                            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                a
                </form>
            </div>
        </div>
    );
};

export default Login;
