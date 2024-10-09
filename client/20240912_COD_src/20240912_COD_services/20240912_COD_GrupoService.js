import api from './20240912_COD_Api';

// Servicio para obtener todos los grupos activos
export const obtenerGruposPorRol = async (rol) => {
    try {
        const response = await api.get('/grupo', { params: { rol } });
        return response.data; // Devuelve los grupos activos
    } catch (error) {
        console.error('Error en obtenerGruposPorRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener los grupos activos');
    }
};

// Servicio para obtener un grupo por ID considerando el rol
export const obtenerGrupoPorIdYRol = async (id_grupo, rol) => {
    try {
        const response = await api.get(`/grupo/${id_grupo}`, { params: { rol } });
        return response.data; // Devuelve el grupo
    } catch (error) {
        console.error('Error en obtenerGrupoPorIdYRol (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener el grupo por ID');
    }
};

// Servicio para insertar un nuevo grupo
export const insertarGrupo = async (id_pdf, nombre_grupo) => {
    try {
        const response = await api.post('/grupo', { id_pdf, nombre_grupo });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en insertarGrupo (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al insertar el grupo');
    }
};

// Servicio para actualizar un grupo existente
export const actualizarGrupo = async (id_grupo, id_pdf, nombre_grupo) => {
    try {
        const response = await api.put(`/grupo/${id_grupo}`, { id_pdf, nombre_grupo });
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en actualizarGrupo (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al actualizar el grupo');
    }
};

// Servicio para eliminar un grupo lógicamente
export const eliminarGrupo = async (id_grupo) => {
    try {
        const response = await api.delete(`/grupo/${id_grupo}`);
        return response.data.message; // Devuelve el mensaje de éxito
    } catch (error) {
        console.error('Error en eliminarGrupo (Frontend):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al eliminar el grupo');
    }
};
