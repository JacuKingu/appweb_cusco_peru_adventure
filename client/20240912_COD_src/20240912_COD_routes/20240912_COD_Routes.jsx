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

// Componente para rutas privadas basado en autenticación y rol
const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const rolUsuario = localStorage.getItem('rolUser'); // Obtiene el rol del usuario del localStorage

    // Verifica si el usuario está autenticado y tiene el rol adecuado
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Si se proporcionan roles específicos, verifica si el usuario tiene uno de esos roles
    if (roles && !roles.includes(rolUsuario)) {
        return <Navigate to="/home" />; // Redirige si no tiene el rol adecuado
    }

    return children;
};

// Definición de las rutas
const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/registrar" element={<Registrar />} /> */}
            <Route
                    path="/registrar"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <Registrar />
                        </PrivateRoute>
                    }
                />

            {/* Rutas protegidas */}
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }
            >
                <Route
                    path="home"
                    element={
                        <PrivateRoute roles={['admin', 'asesor']}>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="clientes"
                    element={
                        <PrivateRoute roles={['admin', 'asesor']}>
                            <Cliente />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="reservaciones"
                    element={
                        <PrivateRoute roles={['admin', 'asesor']}>
                            <Reservas />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="grupos"
                    element={
                        <PrivateRoute roles={['admin', 'asesor']}>
                            <Grupos />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="tour"
                    element={
                        <PrivateRoute roles={['admin', 'asesor']}>
                            <Tour />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="pasaportes"
                    element={
                        <PrivateRoute roles={['admin', 'asesor']}>
                            <Pasaportes />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="recomendaciones"
                    element={
                        <PrivateRoute roles={['admin', 'asesor']}>
                            <Recomendaciones />
                        </PrivateRoute>
                    }
                />
                <Route path="pdf" element={<Pdf />} />
                <Route
                    path="usuarios"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <Usuarios />
                        </PrivateRoute>
                    }
                />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    </Router>
);

export default AppRoutes;
