import React from 'react';
import AppRoutes from './20240912_COD_routes/20240912_COD_Routes';
import { AuthProvider } from './20240912_COD_context/20240912_COD_AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;
