import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [features, setFeatures] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecciona un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setText(response.data.text);
            setFeatures(response.data.features);
            setError('');
        } catch (error) {
            console.error('Error al subir el archivo', error);
            setError('Error al subir el archivo.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='formulario'>
                <input type="file" accept=".pdf" onChange={handleFileChange} className='pdf'/>
                <button type="submit" className='btn'>Subir archivo</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {text && <div>
                <h3>Texto extraído:</h3>
                <p>{text}</p>
            </div>}
            {features && <div>
                <h3>Características Claves:</h3>
                <p>Voluntariado: {features.voluntariado ? 'Sí' : 'No'}</p>
                <p>Promedio: {features.promedio !== null ? features.promedio : 'No disponible'}</p>
                <p>Experiencia Laboral: {features.experiencia ? 'Sí' : 'No'}</p>
                <p>Habilidades: {features.habilidades.join(', ')}</p>
                <p>Certificaciones: {features.certificacion ? 'Si' : 'No'}</p>
                <p>Educacion: {features.educacion ? 'Si' : 'No'}</p>
                <p>Nombres: {features.nombres}</p>
                <p>Apellidos: {features.apellidos}</p>
            </div>}
        </div>
    );
}

export default FileUpload;
