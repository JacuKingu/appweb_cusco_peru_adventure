import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const rolUser = localStorage.getItem('rolUser'); // Obtener el rol del usuario desde localStorage

    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
            <h1 className="text-xl font-bold mb-4">Menú Principal</h1>
            <ul>




                {['admin', 'asesor'].includes(rolUser) && (
                    <>
                        <li>
                            <Link to="/home" className="block py-2 px-4 hover:bg-gray-700">Inicio</Link>
                        </li>
                        <li>
                            <Link to="/clientes" className="block py-2 px-4 hover:bg-gray-700">Clientes</Link>
                        </li>
                        <li>
                            <Link to="/reservaciones" className="block py-2 px-4 hover:bg-gray-700">Reservaciones</Link>
                        </li>
                        <li>
                            <Link to="/grupos" className="block py-2 px-4 hover:bg-gray-700">Grupos</Link>
                        </li>
                        <li>
                            <Link to="/tour" className="block py-2 px-4 hover:bg-gray-700">Tour</Link>
                        </li>
                        <li>
                            <Link to="/pasaportes" className="block py-2 px-4 hover:bg-gray-700">Pasaportes</Link>
                        </li>
                        <li>
                            <Link to="/recomendaciones" className="block py-2 px-4 hover:bg-gray-700">Recomendaciones</Link>
                        </li>
                        <li>
                            <Link to="/pdf" className="block py-2 px-4 hover:bg-gray-700">Pdf</Link>
                        </li>
                    </>
                )}

                {rolUser === 'admin' && (
                    <li>
                        <Link to="/usuarios" className="block py-2 px-4 hover:bg-gray-700">Usuarios</Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
