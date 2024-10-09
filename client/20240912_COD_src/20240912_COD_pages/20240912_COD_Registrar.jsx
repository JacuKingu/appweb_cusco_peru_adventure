import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUsuario } from '@services/20240912_COD_AuthService';

const Registrar = () => {
    const [nombre, setNombre] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [rol, setRol] = useState(''); // Inicialmente vacío para forzar la selección del rol
    const [mostrarContraseña, setMostrarContraseña] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        // Verificar que todos los campos estén completos
        if (!nombre || !contraseña || !rol) {
            setError('Por favor, complete todos los campos y seleccione un rol.');
            return;
        }
        try {
            // Hacer la solicitud para registrar el usuario
            const message = await signupUsuario(nombre, contraseña, rol);
            setExito(message); // Mostrar mensaje de éxito

            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>
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
                <div className="mb-4 relative">
                    <input 
                        type={mostrarContraseña ? "text" : "password"} 
                        value={contraseña} 
                        onChange={(e) => setContraseña(e.target.value)} 
                        placeholder="Contraseña" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        autoComplete='new-password'
                    />
                    <button 
                        type="button" 
                        onClick={() => setMostrarContraseña(!mostrarContraseña)} 
                        className="absolute right-3 top-2 text-gray-600"
                    >
                        {mostrarContraseña ? '🔓' : '🔒'}
                    </button>
                </div>
                <div className="mb-4">
                    <select 
                        value={rol} 
                        onChange={(e) => setRol(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {/* Opción inicial para seleccionar el rol */}
                        <option value="">Seleccionar rol</option>
                        <option value="admin">Administrador</option>
                        <option value="asesor">Asesor</option>
                    </select>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {exito && <p className="text-green-500 mb-4">{exito}</p>}
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                    Registrarse
                </button>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-blue-500 hover:underline">
                        ¿Ya tienes una cuenta? Inicia sesión aquí
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Registrar;
