import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
//Middleware
import { errorHandler } from './20240912_COD_middlewares/20240912_COD_errorHandler.js';
//Rutas
import clientesRoutes from './20240912_COD_routes/20240912_COD_clientesRoutes.js'
import authRoutes from './20240912_COD_routes/20240912_COD_authRoutes.js';
import gruposRoutes from './20240912_COD_routes/20240912_COD_gruposRoutes.js';
import pasaporteRoutes from './20240912_COD_routes/20240912_COD_pasaporteRoutes.js'; 
import pdfRoutes from './20240912_COD_routes/20240912_COD_pdfRoutes.js';
import recomendacionesRoutes from './20240912_COD_routes/20240912_COD_recomendacionesRoutes.js';
import reservasRoutes from './20240912_COD_routes/20240912_COD_reservasRoutes.js';
import toursRoutes from './20240912_COD_routes/20240912_COD_toursRoutes.js';
import usuarioRoutes from './20240912_COD_routes/20240912_COD_usuariosRoutes.js';

dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Agregar dominios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200, // Para navegadores antiguos
    credentials: true // Habilitar cookies y headers con credenciales
};
app.use(cors(corsOptions));

// Seguridad con Helmet
app.use(helmet({
    contentSecurityPolicy: false, // Desactivar CSP si usas fuentes externas (opcional)
    crossOriginEmbedderPolicy: false // Necesario para algunos casos de CORS
}));

app.use(express.json({ limit: '10mb' }));

//Uso de rutas
app.use('/appweb/auth',authRoutes);
app.use('/appweb/cliente',clientesRoutes);
app.use('/appweb/grupo',gruposRoutes);
app.use('/appweb/pasaporte',pasaporteRoutes);
app.use('/appweb/pdf',pdfRoutes);
app.use('/appweb/recomendacion',recomendacionesRoutes);
app.use('/appweb/reserva',reservasRoutes);
app.use('/appweb/usuario',usuarioRoutes);
app.use('/appweb/tour',toursRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

//Manejo de errores
app.use(errorHandler);

//puerto
const PORT = process.env.PORT;
app.listen(PORT,()=>{
console.log(`Servidor corriendo en el puerto ${PORT}`);
});
