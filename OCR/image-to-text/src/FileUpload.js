import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [people, setPeople] = useState([]);
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
            setPeople(response.data.people);
            setError('');
        } catch (error) {
            console.error('Error al subir el archivo', error);
            setError('Error al subir el archivo.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="application/pdf" />
                <button type="submit">Subir Archivo</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {people.map((person, index) => (
                <div key={index}>
                    <h3>Persona {index + 1}</h3>
                    <p>Nombres: {person.nombres || 'No disponible'}</p>
                    <p>Apellidos: {person.apellidos || 'No disponible'}</p>
                    <p>Nacionalidad: {person.nacionalidad || 'No disponible'}</p>
                    <p>Fecha de Nacimiento: {person.fechaNacimiento || 'No disponible'}</p>
                </div>
            ))}
        </div>
    );
}

export default FileUpload;
