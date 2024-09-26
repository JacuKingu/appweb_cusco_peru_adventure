import * as toursModel from '../20240912_COD_models/20240912_COD_toursModel.js';

// Servicio para obtener todos los tours activos basados en el rol
export const obtenerToursActivos = async (rol) => {
    try {
        const tours = await toursModel.obtenerToursActivos(rol);
        console.log('Tours obtenidos:', tours); // Verificar los datos obtenidos
        return tours;
    } catch (error) {
        console.error('Error en obtenerToursActivos:', error);
        throw new Error('Error al obtener los tours activos');
    }
};

// Servicio para obtener un tour por ID considerando el rol
export const obtenerTourPorIdYRol = async (id_tour, rol) => {
    try {
        const tour = await toursModel.obtenerTourPorId(id_tour, rol);
        if (!tour) {
            throw new Error('Tour no encontrado o no tienes permiso para verlo');
        }
        return tour;
    } catch (error) {
        console.error('Error en obtenerTourPorIdYRol:', error);
        throw new Error('Error al obtener el tour por ID');
    }
};

// Servicio para insertar un nuevo tour
export const insertarTour = async (nombre, descripcion, duracion, precio, categoria) => {
    try {
        console.log('recepcion de dato la ingresar tour: ',{
            nombre, descripcion,duracion,precio,categoria
        })
        await toursModel.insertarTour(nombre, descripcion, duracion, precio, categoria);
    } catch (error) {
        console.error('Error en insertarTour:', error);
        throw new Error('Error al insertar el tour');
    }
};

export const cargarPdf = async (archivo) => {
    try {
        // Crear un FormData para enviar el archivo
        const formData = new FormData();
        formData.append('archivo', archivo);

        // Enviar el archivo al backend usando axios
        const response = await api.post('/pdf/cargar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.mensaje; // Retorna el mensaje de éxito
    } catch (error) {
        console.error('Error al cargar el PDF (Frontend):', error);
        throw new Error(error.response ? error.response.data.error : 'Error al cargar el PDF');
    }
};

// Servicio para actualizar un tour existente
export const actualizarTour = async (id_tour, nombre, descripcion, duracion, precio, categoria) => {
    try {
        await toursModel.actualizarTour(id_tour, nombre, descripcion, duracion, precio, categoria);
    } catch (error) {
        console.error('Error en actualizarTour:', error);
        throw new Error('Error al actualizar el tour');
    }
};

// Servicio para eliminar un tour lógicamente
export const eliminarTour = async (id_tour) => {
    try {
        await toursModel.eliminarTour(id_tour);
    } catch (error) {
        console.error('Error en eliminarTour:', error);
        throw new Error('Error al eliminar el tour');
    }
};
