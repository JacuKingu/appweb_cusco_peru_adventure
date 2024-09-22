// 20240912_COD_Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    // Definir las rutas del menú según las páginas disponibles
    const menuItems = [
        { name: 'Home', path: '/home' },
        { name: 'Clients', path: '/clients' },
        { name: 'Tours', path: '/tours' },
        { name: 'Groups', path: '/groups' },
        { name: 'Reservations', path: '/reservations' },
        { name: 'Recommendations', path: '/recommendations' },
        { name: 'Passports', path: '/passports' },
        { name: 'Admin', path: '/admin', role: 'admin' }, // Solo visible para usuarios con rol 'admin'
    ];

    // Supongamos que tienes un contexto de autenticación con el rol del usuario
    const userRole = 'admin'; // Este valor vendría de un contexto o de la autenticación real

    return (
        <aside className="w-64 h-full bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-lg font-bold">App Menu</div>
            <nav className="flex-grow">
                <ul>
                    {menuItems.map((item, index) => {
                        // Mostrar solo los items que coinciden con el rol del usuario
                        if (item.role && item.role !== userRole) return null;

                        return (
                            <li key={index}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `block py-2 px-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-4">
                <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded">
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
