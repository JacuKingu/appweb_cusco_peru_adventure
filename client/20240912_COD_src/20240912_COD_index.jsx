// 20240912_COD_index.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './20240912_COD_App.jsx';  // Asegúrate de que esta ruta sea correcta
import './20240912_COD_styles/20240912_COD_tailwind.css'; // Estilos principales de Tailwind

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
