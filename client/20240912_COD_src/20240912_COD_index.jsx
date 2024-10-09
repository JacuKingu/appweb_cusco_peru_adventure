import React from 'react';
import { createRoot } from 'react-dom/client'; // Importar createRoot
import App from './20240912_COD_App';
import './20240912_COD_styles/20240912_COD_globals.css'; 

// Obtener el elemento contenedor
const container = document.getElementById('root');

// Crear un root y renderizar la aplicación
const root = createRoot(container);
root.render(<App />);
