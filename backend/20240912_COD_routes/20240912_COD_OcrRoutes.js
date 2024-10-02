import express from 'express';
import { procesarOcrDePdf } from '../20240912_COD_controllers/20240912_COD_OcrController.js';
import { verificarToken,verificarRol } from '../20240912_COD_middlewares/20240912_COD_authMiddleware.js';

const router = express.Router();

router.get('/procesar-ocr/:id_pdf', verificarToken, verificarRol(['admin', 'asesor']), procesarOcrDePdf);



export default router;
