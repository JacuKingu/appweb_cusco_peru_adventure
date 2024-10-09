import React, { useState } from 'react'; 
import { insertarPdf } from '@services/20240912_COD_PdfService'; 

const Home = () => {
    const [archivo, setArchivo] = useState(null); // Inicializado como null en vez de una cadena vacía
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setArchivo(e.target.files[0]); // Capturar el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        if (!archivo) {
            setError('Por favor, selecciona un archivo PDF.');
            return;
        }

        try {
            // Llamar al servicio para cargar el PDF, pasando nombre y archivo
            const mensajeExito = await insertarPdf(archivo.name, archivo); 
            console.log('este es el mensaje: ', mensajeExito)
            setMensaje(mensajeExito);
        } catch (error) {
            setError('Error al cargar el archivo: ' + error.message);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Cargar PDF</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handleFileChange} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Subir PDF
                </button>
                {mensaje && <p className="text-green-500 mt-4">{mensaje}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default Home;
