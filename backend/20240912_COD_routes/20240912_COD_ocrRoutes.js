import express from 'express';
import { procesarPDF } from '../20240912_COD_controllers/20240912_COD_ocrController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Ruta para procesar un PDF con OCR
router.post('/procesar-pdf', upload.single('pdf'), procesarPDF);

export default router;
