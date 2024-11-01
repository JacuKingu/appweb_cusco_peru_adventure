const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const stopwords = require('stopword');
const pdfPoppler = require('pdf-poppler'); // Asegúrate de tener esta dependencia instalada

const app = express();
const PORT = 5000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

// Función para convertir PDF a imágenes usando pdf-poppler
const pdfToImages = async (pdfPath) => {
    const outputPath = path.join(__dirname, 'images');
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

    const options = {
        format: 'jpeg',
        out_dir: outputPath,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null,
        dpi: 70,
    };

    await pdfPoppler.convert(pdfPath, options);
    return fs.readdirSync(outputPath).map(file => path.join(outputPath, file));
};

// Funcion para limpiar y preprocesar el texto
const preprocessText = (text) => {
    let cleanedText = text.toLowerCase().replace(/[^a-záéíóúüñ\s]/gi, '');
    let tokens = cleanedText.split(/\s+/);
    tokens = stopwords.removeStopwords(tokens, stopwords.es);
    return tokens;
};

// Funcion para extraer características clave
const extractKeyFeatures = (tokens, text) => {
    const keyFeatures = {
        nombres: '',
        apellidos: '',
        nacionalidad: '',
        fechaNacimiento: ''
    };

    const nombresRegex = /nombres?:\s*([a-zA-Z\s]+)/i;
    const apellidosRegex = /apellidos?:\s*([a-zA-Z\s]+)/i;
    const nacionalidadRegex = /nacionalidad:\s*([a-zA-Z\s]+)/i;
    const fechaNacimientoRegex = /fecha de nacimiento:\s*(\d{2}\/\d{2}\/\d{4})/i;

    const nombresMatch = text.match(nombresRegex);
    if (nombresMatch) keyFeatures.nombres = nombresMatch[1].trim();

    const apellidosMatch = text.match(apellidosRegex);
    if (apellidosMatch) keyFeatures.apellidos = apellidosMatch[1].trim();

    const nacionalidadMatch = text.match(nacionalidadRegex);
    if (nacionalidadMatch) keyFeatures.nacionalidad = nacionalidadMatch[1].trim();

    const fechaNacimientoMatch = text.match(fechaNacimientoRegex);
    if (fechaNacimientoMatch) keyFeatures.fechaNacimiento = fechaNacimientoMatch[1];

    console.log("Texto extraido de cada imagen: nombres"+nombresMatch);

    return keyFeatures;
};

// Ruta para manejar la subida de archivos
app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    if (fileType === 'application/pdf') {
        try {
            const images = await pdfToImages(filePath);
            const peopleData = [];

            for (const image of images) {
                const { data: { text } } = await Tesseract.recognize(image, 'spa');
                console.log("Texto extraído:", text); // Para depuración
                const tokens = preprocessText(text);
                const keyFeatures = extractKeyFeatures(tokens, text);
                peopleData.push(keyFeatures);
                fs.unlinkSync(image); // Eliminar la imagen procesada
            }
            
            res.json({ people: peopleData });
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al procesar el PDF.' });
        }
    } else {
        res.status(400).json({ error: 'Formato de archivo no válido. Solo se aceptan PDFs.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
