import React, { useState, useEffect } from 'react';
import {
    obtenerRecomendacionesPorRol,
    obtenerRecomendacionPorIdYRol,
    insertarRecomendacion,
    actualizarRecomendacion,
    eliminarRecomendacion,
    obtenerYProcesarEdades
} from '@services/20240912_COD_RecomendacionService';
import { obtenerGruposPorRol } from '@services/20240912_COD_GrupoService';
import SpineLoader from '@components/20240912_COD_LoadingSpinner';

const Recomendaciones = () => {
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [grupos, setGrupos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [recomendacionActual, setRecomendacionActual] = useState(null);
    const [formValues, setFormValues] = useState({
        id_grupo: '',
        contenido: '',
        tipo_actividades: '',
        nivel_actividad: '',
        destino_preferido: '',
        presupuesto: '',
        duracion_viaje: 7, // Valor por defecto
        edades: [] // Para almacenar las edades procesadas
    });

    useEffect(() => {
        let isMounted = true;
        const cargarDatos = async () => {
            if (isMounted) {
                await cargarRecomendaciones();
                await cargarGrupos();
            }
        };
        cargarDatos();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (recomendacionActual) {
            setFormValues({
                id_grupo: recomendacionActual.id_grupo || '',
                contenido: recomendacionActual.contenido || '',
                tipo_actividades: recomendacionActual.tipo_actividades || '',
                nivel_actividad: recomendacionActual.nivel_actividad || '',
                destino_preferido: recomendacionActual.destino_preferido || '',
                presupuesto: recomendacionActual.presupuesto || '',
                duracion_viaje: recomendacionActual.duracion_viaje || 7,
                edades: recomendacionActual.edades || []
            });
        } else {
            limpiarFormulario();
        }
    }, [recomendacionActual]);

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

    const cargarRecomendaciones = async () => {
        setLoading(true);
        setError('');
        try {
            const rol = localStorage.getItem('rolUser');
            const response = await obtenerRecomendacionesPorRol(rol);
            if (response.success && Array.isArray(response.data)) {
                setRecomendaciones(response.data);
            } else {
                setRecomendaciones([]);
            }
        } catch (error) {
            setError('Error al cargar las recomendaciones: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const manejarCambioGrupo = async (e) => {
        const id_grupo = e.target.value;
        setFormValues({ ...formValues, id_grupo });

        if (id_grupo) {
            try {
                const response = await obtenerYProcesarEdades(id_grupo);
                if (response.success) {
                    const { edades } = response.data; // Suponiendo que el servicio devuelve un array de edades
                    setFormValues((prevFormValues) => ({
                        ...prevFormValues,
                        edades // Guardar las edades procesadas
                    }));
                } else {
                    setError('Error al procesar las edades.');
                }
            } catch (error) {
                setError('Error al obtener y procesar las edades: ' + error.message);
            }
        }
    };

    const manejarCambio = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (recomendacionActual) {
                await actualizarRecomendacion(recomendacionActual.id_recomendacion, formValues);
                setError('Recomendación actualizada con éxito');
            } else {
                await insertarRecomendacion(formValues);
                setError('Recomendación agregada con éxito');
            }
            cargarRecomendaciones();
            limpiarFormulario();
        } catch (error) {
            setError('Error al guardar la recomendación: ' + error.message);
        }
    };

    const manejarEdicion = async (id_recomendacion) => {
        try {
            const rol = localStorage.getItem('rolUser');
            const recomendacion = await obtenerRecomendacionPorIdYRol(id_recomendacion, rol);
            if (recomendacion.success && recomendacion.data && recomendacion.data.length > 0) {
                const datosRecomendacion = recomendacion.data[0];
                setRecomendacionActual(datosRecomendacion);
                setFormValues({
                    id_grupo: datosRecomendacion.id_grupo || '',
                    contenido: datosRecomendacion.contenido || '',
                    
                    edades: datosRecomendacion.edades || []
                });
            } else {
                setError('Error: No se encontraron datos para esta recomendación.');
            }
        } catch (error) {
            setError('Error al cargar la recomendación: ' + error.message);
        }
    };

    const manejarEliminacion = async (id_recomendacion) => {
        try {
            await eliminarRecomendacion(id_recomendacion);
            setError('Recomendación eliminada con éxito');
            cargarRecomendaciones();
        } catch (error) {
            setError('Error al eliminar la recomendación: ' + error.message);
        }
    };

    const limpiarFormulario = () => {
        setRecomendacionActual(null);
        setFormValues({
            id_grupo: '',
            contenido: '',
            
            edades: []
        });
    };

    if (loading) return <SpineLoader />;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestión de Recomendaciones</h1>
            {loading && <p className="text-center">Cargando...</p>}

            <form onSubmit={manejarSubmit} className="bg-white p-4 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">{recomendacionActual ? 'Actualizar Recomendación' : 'Agregar Recomendación'}</h2>

                <div className="mb-4">
                    <label htmlFor="id_grupo" className="block text-sm font-medium text-gray-700">Seleccionar Grupo</label>
                    <select
                        name="id_grupo"
                        value={formValues.id_grupo}
                        onChange={manejarCambioGrupo}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona un Grupo</option>
                        {grupos.map((grupo) => (
                            <option key={grupo.id_grupo} value={grupo.id_grupo}>
                                {grupo.grupo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <textarea
                        name="contenido"
                        value={formValues.contenido}
                        onChange={manejarCambio}
                        placeholder="Contenido de la Recomendación"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    />
                </div>

                

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600"
                >
                    {recomendacionActual ? 'Actualizar Recomendación' : 'Agregar Recomendación'}
                </button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Lista de Recomendaciones</h2>
                <ul>
                    {recomendaciones.map((recomendacion) => (
                        <li key={recomendacion.id_recomendacion} className="flex justify-between mb-2">
                            <span>{recomendacion.contenido}</span>
                            <div>
                                <button
                                    onClick={() => manejarEdicion(recomendacion.id_recomendacion)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => manejarEliminacion(recomendacion.id_recomendacion)}
                                    className="text-red-500 hover:underline ml-4"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Recomendaciones;
