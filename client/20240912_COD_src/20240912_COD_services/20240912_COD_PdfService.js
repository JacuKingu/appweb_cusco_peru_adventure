import api from './20240912_COD_Api'; // Importa la instancia configurada de axios

// Servicio para obtener todos los PDFs activos basados en el rol
export const obtenerPdfsPorRol = async (rol) => {
    try {
        const response = await api.get('/pdf', { params: { rol } });
        return response.data; // Retorna los datos de los PDFs
    } catch (error) {
        console.error('Error en obtenerPdfsPorRol (Servicio):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener los PDFs activos');
    }
};

// Servicio para obtener un PDF por ID considerando el rol
export const obtenerPdfPorId = async (id_pdf, rol) => {
    try {
        const response = await api.get(`/pdf/${id_pdf}`, { params: { rol } });
        if (!response.data) {
            throw new Error('PDF no encontrado o no tienes permiso para verlo');
        }
        return response.data;
    } catch (error) {
        console.error('Error en obtenerPdfPorId (Servicio):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al obtener el PDF por ID');
    }
};

// Servicio para insertar un nuevo PDF
export const insertarPdf = async (nombre_archivo, contenido) => {
    try {
        // Verifica que el archivo y contenido no estén vacíos
        if (!nombre_archivo || !contenido) {
            throw new Error('El nombre del archivo y el contenido son requeridos');
        }

        const formData = new FormData();
        formData.append('archivo', contenido); // Aquí solo necesitas 'archivo'

        const response = await api.post('/pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Este header es opcional, ya que el navegador lo maneja
            },
        });

        return response.data.message; // Retorna el mensaje de éxito
    } catch (error) {
        console.error('Error en insertarPdf (Servicio):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al insertar el PDF');
    }
};



// Servicio para actualizar un PDF existente
export const actualizarPdf = async (id_pdf, nombre_archivo, contenido) => {
    try {
        const formData = new FormData();
        formData.append('nombre_archivo', nombre_archivo);
        formData.append('contenido', contenido);

        const response = await api.put(`/pdf/${id_pdf}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.message; // Retorna el mensaje de éxito
    } catch (error) {
        console.error('Error en actualizarPdf (Servicio):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al actualizar el PDF');
    }
};

// Servicio para eliminar un PDF lógicamente
export const eliminarPdf = async (id_pdf) => {
    try {
        const response = await api.delete(`/pdf/${id_pdf}`);
        return response.data.message; // Retorna el mensaje de éxito
    } catch (error) {
        console.error('Error en eliminarPdf (Servicio):', error);
        throw new Error(error.response ? error.response.data.message : 'Error al eliminar el PDF');
    }
};
