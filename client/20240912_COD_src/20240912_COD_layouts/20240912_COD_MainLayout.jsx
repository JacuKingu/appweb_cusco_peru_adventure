// 20240912_COD_MainLayout.jsx
import React from 'react';
import Sidebar from '@components/20240912_COD_Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar en el lado izquierdo */}
            <Sidebar />
            {/* Contenido principal */}
            <main className="flex-grow p-4 bg-gray-100 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
