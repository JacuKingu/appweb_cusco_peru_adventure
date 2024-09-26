import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../20240912_COD_context/20240912_COD_AuthContext';
import Login from '@pages/20240912_COD_Login';
import Home from '@pages/20240912_COD_Home';
import Cliente from '@pages/20240912_COD_Cliente';
import Reservas from '@pages/20240912_COD_Reservacion';
import Grupos from '@pages/20240912_COD_Grupo';
import Tour from '@pages/20240912_COD_Tour';
import Pasaportes from '@pages/20240912_COD_Pasaporte';
import Recomendaciones from '@pages/20240912_COD_Recomendacion';
import Usuarios from '@pages/20240912_COD_Usuario';
import Pdf from '@pages/20240912_COD_Pdf';
import MainLayout from '@layouts/20240912_COD_MainLayout';
import Registrar from '@pages/20240912_COD_Registrar';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Ruta pública para login */}
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />

            
            {/* Rutas protegidas dentro del MainLayout */}
            <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route path="home" element={<Home />} />
                <Route path="clientes" element={<Cliente />} />
                <Route path="reservaciones" element={<Reservas />} />
                <Route path="grupos" element={<Grupos />} />
                <Route path="tour" element={<Tour />} />
                <Route path="pasaportes" element={<Pasaportes />} />
                <Route path="recomendaciones" element={<Recomendaciones />} />
                <Route path="pdf" element={<Pdf />} />
                <Route path="usuarios" element={<Usuarios />} />
                {/* Puedes agregar más rutas aquí */}
            </Route>
            
            {/* Redirección a login si no se encuentra la ruta */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    </Router>
);

export default AppRoutes;
