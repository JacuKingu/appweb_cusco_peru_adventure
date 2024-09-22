// 20240912_COD_App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '@routes/20240912_COD_Routes'; 
import './20240912_COD_styles/20240912_COD_globals.css';  // Importar estilos globales

const App = () => {
  return (
    <Router>
      <Routes />
    </Router>
  );
};

export default App;
