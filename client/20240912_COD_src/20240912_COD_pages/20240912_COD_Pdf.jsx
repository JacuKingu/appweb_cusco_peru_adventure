import React, { useState, useEffect, useContext } from 'react';
import {
    obtenerPdfsPorRol,
    eliminarPdf
} from '@services/20240912_COD_PdfService';
import { AuthContext } from '@context/20240912_COD_AuthContext';

const Pdfs = () => {
    const { user } = useContext(AuthContext);
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [pdfActual, setPdfActual] = useState(null);
    const [formValues, setFormValues] = useState({
        nombre_archivo: '',
        contenido: ''
    });

    useEffect(() => {
        let isMounted = true;
        const cargarPdfsSeguro = async () => {
            if (isMounted) {
                await cargarPdfs();
            }
        };
        cargarPdfsSeguro();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (pdfActual) {
            setFormValues({
                nombre_archivo: pdfActual.nombre_archivo || '',
                contenido: pdfActual.contenido || ''
            });
        } else {
            limpiarFormulario();
        }
    }, [pdfActual]);

    const cargarPdfs = async () => {
        setLoading(true);
        setError('');
        try {
            const rol = user?.rol || 'admin';
            const response = await obtenerPdfsPorRol(rol);
            console.log('Respuesta de la API:', response);
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

    const limpiarFormulario = () => {
        setPdfActual(null);
        setFormValues({
            nombre_archivo: '',
            contenido: ''
        });
    };

    const generarUrlParaPdf = (contenido) => {
        if (contenido) {
            const blob = new Blob([contenido], { type: 'application/pdf' });
            return URL.createObjectURL(blob);
        }
        return null;
    };

    if (loading) return <p className="text-center mt-6">Cargando...</p>;

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
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Contenido</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pdfs.map((pdf) => (
                        <tr key={pdf.id_pdf}>
                            <td className="py-2 px-4 border-b border-gray-200">{pdf.id_pdf}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{pdf.archivo}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {/* Botón para ver el PDF */}
                                <a
                                    href={generarUrlParaPdf(pdf.contenido)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    Ver PDF
                                </a>
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
