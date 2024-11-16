import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@context/20240912_COD_AuthContext';

const Header = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Eliminar el token de autenticación
        setAuth(false); // Actualizar el estado de autenticación
        navigate('/login'); // Redirigir al login
    };

    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-xl font-bold">Aplicación de Gestión</h1>
            <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Header;
