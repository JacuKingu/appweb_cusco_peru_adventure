import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../20240912_COD_context/20240912_COD_AuthContext';
import Login from '@pages/20240912_COD_Login';
import Home from '@pages/20240912_COD_Home';
import Cliente from '@pages/20240912_COD_Cliente';
import Reservacion from '@pages/20240912_COD_Reservacion';
import Grupo from '@pages/20240912_COD_Grupo';
import Tour from '@pages/20240912_COD_Tour';
import Pasaporte from '@pages/20240912_COD_Pasaporte';
import Recomendacion from '@pages/20240912_COD_Recomendacion';
import Usuario from '@pages/20240912_COD_Usuario';
import MainLayout from '@layouts/20240912_COD_MainLayout';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Ruta pública para login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas dentro del MainLayout */}
            <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route path="home" element={<Home />} />
                <Route path="clientes" element={<Cliente />} />
                <Route path="reservaciones" element={<Reservacion />} />
                <Route path="grupos" element={<Grupo />} />
                <Route path="tour" element={<Tour />} />
                <Route path="pasaportes" element={<Pasaporte />} />
                <Route path="recomendaciones" element={<Recomendacion />} />
                <Route path="usuarios" element={<Usuario />} />
                {/* Puedes agregar más rutas aquí */}
            </Route>
            
            {/* Redirección a login si no se encuentra la ruta */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    </Router>
);

export default AppRoutes;
