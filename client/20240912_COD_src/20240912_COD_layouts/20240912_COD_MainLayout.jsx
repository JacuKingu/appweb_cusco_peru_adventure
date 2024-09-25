import React from 'react';
import Sidebar from '../20240912_COD_components/20240912_COD_Sidebar';
import Header from '../20240912_COD_components/20240912_COD_Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex flex-col">
            <Header /> {/* Header en la parte superior */}
            <div className="flex flex-grow">
                <Sidebar /> {/* Sidebar a la izquierda */}
                <div className="ml-64 p-4 w-full"> {/* Contenido principal ajustado */}
                    <Outlet /> {/* Renderiza las páginas según la ruta */}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
