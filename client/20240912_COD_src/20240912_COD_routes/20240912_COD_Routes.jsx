// 20240912_COD_Routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../20240912_COD_layouts/20240912_COD_MainLayout';
import Home from '@pages/20240912_COD_Home';
import Clientes from '@pages/20240912_COD_Clients';
import Tours from '@pages/20240912_COD_Tours';
import Groups from '@pages/20240912_COD_Groups';
import Reservations from '@pages/20240912_COD_Reservations';
import Recommendations from '@pages/20240912_COD_Recommendations';
import Passports from '@pages/20240912_COD_Passports';
import Admin from '@pages/20240912_COD_Admin';
import Login from '@pages/20240912_COD_Login';

const AppRoutes = () => {
    // Aquí puedes usar una variable o contexto para verificar si el usuario está autenticado
    const isAuthenticated = false; // Cambia esto según la lógica de autenticación de tu proyecto

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
                <Route path="home" element={<Home />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="tours" element={<Tours />} />
                <Route path="groups" element={<Groups />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="passports" element={<Passports />} />
                <Route path="admin" element={<Admin />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
