import React, { useState, useEffect, useContext } from 'react';
import {
    obtenerPdfsPorRol,
    eliminarPdf
} from '@services/20240912_COD_PdfService';
import { AuthContext } from '@context/20240912_COD_AuthContext';
import SpineLoader from '@components/20240912_COD_LoadingSpinner';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min.mjs';

const Pdfs = () => {
    const { user } = useContext(AuthContext);
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPdfsSeguro = async () => {
            await cargarPdfs();
        };
        cargarPdfsSeguro();
    }, []);

    const cargarPdfs = async () => {
        setLoading(true);
        setError('');
        try {
            const rol = localStorage.getItem('rolUser');
            const response = await obtenerPdfsPorRol(rol);
            console.log('Respuesta de la API:', response.data);

            if (response.success && Array.isArray(response.data)) {
                setPdfs(response.data);
            } else {
                setPdfs([]);
            }
        } catch (error) {
            setError('Error al cargar los PDFs: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const manejarEliminacion = async (id_pdf) => {
        try {
            await eliminarPdf(id_pdf);
            setError('PDF eliminado con éxito');
            cargarPdfs();
        } catch (error) {
            setError('Error al eliminar el PDF: ' + error.message);
        }
    };

    const abrirPdfEnNuevaPestana = async (contenido) => {
        if (contenido && contenido.type === 'Buffer' && Array.isArray(contenido.data)) {
            try {
                // Convertir el array de datos (contenido.data) en un Uint8Array
                const byteArray = new Uint8Array(contenido.data);
                
                // Usar pdfjsLib para cargar el documento PDF
                const loadingTask = pdfjsLib.getDocument({ data: byteArray });
                const pdf = await loadingTask.promise;
    
                // Generar una URL para el archivo PDF
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
    
                // Abrir el PDF en una nueva pestaña
                window.open(url, '_blank');
            } catch (error) {
                console.error('Error al cargar el PDF:', error);
            }
        } else {
            console.error('Formato de contenido no válido o incompleto');
        }
    };
    

    const descargarPdf = (contenido) => {
        if (contenido && contenido.type === 'Buffer' && Array.isArray(contenido.data)) {
            try {
                const byteArray = new Uint8Array(contenido.data);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                // Crear un enlace temporal para descargar el archivo
                const a = document.createElement('a');
                a.href = url;
                a.download = 'archivo.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error) {
                console.error('Error al descargar el PDF:', error);
            }
        }
    };

    const abrirPdfEstático = () => {
        const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        window.open(url, '_blank');
    };


    if (loading) return <SpineLoader />;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestión de PDFs</h1>
            {loading && <p className="text-center">Cargando...</p>}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre del Archivo</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pdfs.map((pdf) => (
                        <tr key={pdf.id_pdf}>
                            <td className="py-2 px-4 border-b border-gray-200">{pdf.id_pdf}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{pdf.archivo}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {/* Previsualizar PDF */}
                                <button
                                    onClick={() => abrirPdfEnNuevaPestana(pdf.contenido)}
                                    className="text-blue-500 underline mr-4"
                                >
                                    Previsualizar PDF
                                </button>
                                {/* Descargar PDF */}
                                <button
                                    onClick={() => descargarPdf(pdf.contenido)}
                                    className="text-blue-500 underline"
                                >
                                    Descargar PDF
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <button
                                    onClick={() => manejarEliminacion(pdf.id_pdf)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Pdfs;
