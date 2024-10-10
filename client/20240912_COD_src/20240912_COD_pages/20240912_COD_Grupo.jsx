import React, { useState, useEffect } from 'react';
import { obtenerGruposPorRol, insertarGrupo, actualizarGrupo, eliminarGrupo } from '@services/20240912_COD_GrupoService';
import { obtenerPdfsPorRol } from '@services/20240912_COD_PdfService'; // Servicio para PDFs
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Grupos = () => {
    const [grupos, setGrupos] = useState([]);
    const [pdfs, setPdfs] = useState([]); // Estado para almacenar la lista de PDFs
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [formValues, setFormValues] = useState({
        id_pdf: '',
        grupo: ''
    });
    const [grupoActual, setGrupoActual] = useState(null); // Para actualizar un grupo específico

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const rol = localStorage.getItem('rolUser');
                const [gruposResponse, pdfsResponse] = await Promise.all([obtenerGruposPorRol(rol), obtenerPdfsPorRol(rol)]);

                if (gruposResponse.success) setGrupos(gruposResponse.data);
                if (pdfsResponse.success) setPdfs(pdfsResponse.data); // Guardar los PDFs en el estado
            } catch (error) {
                setError('Error al cargar los datos: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Función para obtener el nombre del PDF basado en el id_pdf
    const obtenerNombrePdf = (id_pdf) => {
      const pdf = pdfs.find((p) => p.id_pdf === id_pdf);
      return pdf ? pdf.archivo : 'PDF no encontrado';
  };

    const manejarCambio = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (formValues.id_pdf && formValues.grupo) {
                if (grupoActual) {
                    // Actualizar grupo
                    await actualizarGrupo(grupoActual.id_grupo, formValues.id_pdf, formValues.grupo);
                    setError('Grupo actualizado con éxito');
                } else {
                    // Insertar nuevo grupo
                    await insertarGrupo(formValues.id_pdf, formValues.grupo);
                    setError('Grupo agregado con éxito');
                }
                cargarGrupos(); // Recargar la lista de grupos
                limpiarFormulario(); // Limpiar formulario
            } else {
                setError('Por favor, completa todos los campos');
            }
        } catch (error) {
            setError('Error al guardar el grupo: ' + error.message);
        }
    };

    const manejarEdicion = (id_grupo) => {
        const grupo = grupos.find((g) => g.id_grupo === id_grupo);
        if (grupo) {
            setGrupoActual(grupo);
            setFormValues({ id_pdf: grupo.id_pdf, grupo: grupo.grupo });
        }
    };

    const manejarEliminacion = async (id_grupo) => {
        try {
            await eliminarGrupo(id_grupo);
            setError('Grupo eliminado con éxito');
            cargarGrupos(); // Recargar la lista de grupos
        } catch (error) {
            setError('Error al eliminar el grupo: ' + error.message);
        }
    };

    const limpiarFormulario = () => {
        setGrupoActual(null);
        setFormValues({
            id_pdf: '',
            grupo: ''
        });
    };

    const cargarGrupos = async () => {
        setLoading(true);
        setError('');
        try {
            const rol = localStorage.getItem('rolUser');
            const response = await obtenerGruposPorRol(rol);
            if (response.success && Array.isArray(response.data)) {
                setGrupos(response.data);
            } else {
                setGrupos([]);
            }
        } catch (error) {
            setError('Error al cargar los grupos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SpineLoader />;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestión de Grupos</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}


            <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">{grupoActual ? 'Actualizar Grupo' : 'Agregar Grupo'}</h2>


                <div className="mb-4">
                    <select
                        name="id_pdf"
                        value={formValues.id_pdf}
                        onChange={manejarCambio}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un PDF</option>
                        {pdfs.map((pdf) => (
                            <option key={pdf.id_pdf} value={pdf.id_pdf}>
                                {pdf.archivo}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="mb-4">
                    <input
                        type="text"
                        name="grupo"
                        value={formValues.grupo}
                        onChange={manejarCambio}
                        placeholder="Nombre del Grupo"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    {grupoActual ? 'Actualizar' : 'Agregar'}
                </button>
                {grupoActual && (
                    <button
                        type="button"
                        onClick={limpiarFormulario}
                        className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 mt-4"
                    >
                        Cancelar
                    </button>
                )}
            </form>


            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">ID</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre del PDF</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Nombre del Grupo</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {grupos.map((grupo) => (
                        <tr key={grupo.id_grupo}>
                            <td className="py-2 px-4 border-b border-gray-200">{grupo.id_grupo}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{obtenerNombrePdf(grupo.id_pdf)}</td> 
                            <td className="py-2 px-4 border-b border-gray-200">{grupo.grupo}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                <button
                                    onClick={() => manejarEdicion(grupo.id_grupo)}
                                    className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 mr-2"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => manejarEliminacion(grupo.id_grupo)}
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

export default Grupos;
