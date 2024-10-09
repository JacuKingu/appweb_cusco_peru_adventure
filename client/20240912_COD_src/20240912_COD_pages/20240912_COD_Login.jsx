import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../20240912_COD_services/20240912_COD_AuthService';
import { AuthContext } from '../20240912_COD_context/20240912_COD_AuthContext';
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Login = () => {
    const [nombre, setNombre] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [mostrarContraseña, setMostrarContraseña] = useState(false);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false); // Estado de carga
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true); // Iniciar carga
        try {
            const { token,rol } = await loginUsuario(nombre, contraseña);
            localStorage.setItem('authToken', token);
            localStorage.setItem('rolUser',rol)
            setAuth(true);
            navigate('/home');
        } catch (error) {
            setError('Error en el inicio de sesión: ' + error.message);
        } finally {
            setCargando(false); // Finalizar carga
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                <div className="mb-4">
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Nombre" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        autoComplete='username'
                    />
                </div>
                <div className="mb-6 relative">
                    <input 
                        type={mostrarContraseña ? "text" : "password"} 
                        value={contraseña} 
                        onChange={(e) => setContraseña(e.target.value)} 
                        placeholder="Contraseña" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        autoComplete='current-password'
                    />
                    <button 
                        type="button" 
                        onClick={() => setMostrarContraseña(!mostrarContraseña)} 
                        className="absolute right-3 top-2 text-gray-600"
                    >
                        {mostrarContraseña ? '🔓' : '🔒'} 
                    </button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button 
                    type="submit" 
                    className={`w-full py-2 rounded-lg ${cargando ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`} 
                    disabled={cargando} // Deshabilitar el botón mientras carga
                >
                    {cargando ? <SpineLoader /> : 'Iniciar Sesión'} {/* Mostrar el spinner o el texto */}
                </button>
                <div className="mt-4 text-center">
                    <Link to="/registrar" className="text-blue-500 hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
