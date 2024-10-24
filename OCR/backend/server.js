const express = require('express');
const multer = require('multer');
const pdfPoppler = require('pdf-poppler');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const stopwords = require('stopword');

const app = express();
const PORT = 5000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

// Función para convertir PDF a imágenes usando pdf-poppler
const pdfToImages = async (pdfPath) => {
    const outputDir = path.join(__dirname, 'images');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const options = {
        format: 'jpg',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null // Convertir todas las páginas
    };

    await pdfPoppler.convert(pdfPath, options);
    const images = fs.readdirSync(outputDir).map(file => path.join(outputDir, file));
    return images;
};

// Función para limpiar y preprocesar el texto
const preprocessText = (text) => {
    // Convertir a minúsculas
    let cleanedText = text.toLowerCase();

    // Eliminar caracteres especiales, pero mantener espacios y letras
    cleanedText = cleanedText.replace(/[^a-záéíóúüñ\s]/gi, '');

    // Tokenizar el texto
    let tokens = cleanedText.split(/\s+/);

    // Eliminar palabras vacías
    tokens = stopwords.removeStopwords(tokens, stopwords.es);

    // Imprimir texto limpio y tokens en consola
    console.log("Texto limpio:", cleanedText);
    console.log("Tokens:", tokens);

    return tokens;
};

// Función para extraer características claves
const extractKeyFeatures = (tokens, text) => {
    const keyFeatures = {
        voluntariado: false,
        promedio: null,
        experiencia: false,
        habilidades: [],
        certificacion: false,
        educacion: false,
        nombres: false,
        apellidos: false
    };

    const volunteerKeywords = ['voluntariado', 'voluntario'];
    const workExperienceKeywords = ['trabajo', 'experiencia', 'laboral'];
    const skillsKeywords = ['habilidad', 'competencia', 'destreza', 'aptitud', 'gestión'];
    const certificationsKeywords = ['certificación', 'certificaciones', 'certificado', 'scrum', 'pmp'];
    const educationKeywords = ['universidad', 'colegio', 'instituto', 'educación'];
    const apellidosKeywords = ['apellido','surname'];
    const nombresKeywords = ['Nombre', 'Nombres', 'Name'];

    // Identificar palabras clave en el texto
    tokens.forEach(token => {
        if (volunteerKeywords.includes(token)) {
            keyFeatures.voluntariado = true;
        }
        if (workExperienceKeywords.includes(token)) {
            keyFeatures.experiencia = true;
        }
        if (skillsKeywords.includes(token)) {
            keyFeatures.habilidades.push(token);
        }
        if (certificationsKeywords.includes(token)){
            keyFeatures.certificacion = true;
        }
        if (educationKeywords.includes(token)){
            keyFeatures.educacion = true;
        }
        if (apellidosKeywords.includes(token)) {
            keyFeatures.nombres = true;
        }
        if (nombresKeywords.includes(token)) {
            keyFeatures.nombres = true;
        }
    });

    // Eliminar duplicados en las habilidades
    keyFeatures.habilidades = [...new Set(keyFeatures.habilidades)];

    // Extraer el promedio (simulando la extracción aquí, se necesita una lógica más compleja)
    const promedioRegex = /promedio\s*:\s*(\d+(\.\d+)?)/i;
    const promedioMatch = text.match(promedioRegex);
    if (promedioMatch) {
        keyFeatures.promedio = parseFloat(promedioMatch[1]);
    }

    return keyFeatures;
};

// Ruta para manejar la subida de archivos
app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    if (fileType === 'application/pdf') {
        try {
            const images = await pdfToImages(filePath);
            let fullText = '';

            // Procesa cada imagen con Tesseract para extraer texto
            for (const image of images) {
                const { data: { text } } = await Tesseract.recognize(image, 'spa');
                fullText += text + '\n';
            }

            // Elimina las imágenes temporales
            images.forEach(image => fs.unlinkSync(image));

            // Preprocesar el texto extraído
            const tokens = preprocessText(fullText);

            // Extraer características claves
            const keyFeatures = extractKeyFeatures(tokens, fullText);

            res.json({ text: fullText, features: keyFeatures });
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
