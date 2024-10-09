import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const procesarImagenConOcr = async (imagePath) => {
    try {
        const formData = new FormData();
        formData.append('imagen', fs.createReadStream(imagePath));

        // Llamar a la API Python para procesar la imagen
        const response = await axios.post('http://localhost:5000/procesar', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // Devolver los datos procesados (MRZ + OCR)
        return response.data;

    } catch (error) {
        console.error('Error procesando imagen con OCR:', error);
        throw new Error('Error procesando imagen con OCR');
    }
};
