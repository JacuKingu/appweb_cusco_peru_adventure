import axios from 'axios';

// URL base de la API (cambiar a la URL de tu backend en producción)
const API_BASE_URL = 'http://localhost:3001/appweb';

// Crear una instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Tiempo de espera para las solicitudes
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token de autenticación a cada solicitud
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejo global de errores
        if (error.response && error.response.status === 401) {
            // Redirigir al login si el token es inválido o ha expirado
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
