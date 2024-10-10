import * as gruposService from '../20240912_COD_services/20240912_COD_gruposServices.js';

// Obtener todos los grupos activos basados en el rol
export const obtenerGrupos = async (req, res) => {
    try {
        const rol = req.usuario.rol; // Obtener el rol del usuario autenticado
        const grupos = await gruposService.obtenerGruposPorRol(rol);
        res.status(200).json({
            success: true,
            data: grupos
        });
    } catch (error) {
        console.error('Error al obtener grupos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener un grupo por ID considerando el rol
export const obtenerGrupoPorId = async (req, res) => {
    const { id_grupo } = req.params;
    const rol = req.usuario.rol; // Obtener el rol del usuario autenticado

    try {
        const grupo = await gruposService.obtenerGrupoPorIdYRol(id_grupo, rol);
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        console.error('Error al obtener grupo por ID:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Insertar un nuevo grupo
export const insertarGrupo = async (req, res) => {
    const { id_pdf, nombre_grupo } = req.body;
    try {
        await gruposService.insertarGrupo(id_pdf, nombre_grupo);
        res.status(201).json({ message: 'Grupo insertado exitosamente' });
    } catch (error) {
        console.error('Error al insertar grupo:', error);
        res.status(500).json({ message: error.message });
    }
};

export const insertarUltimoGrupo = async (req, res) => {
    const { id_pdf, nombre_grupo } = req.body;
    try {
        const grupo = await gruposService.insertarGrupo(id_pdf, nombre_grupo);
        console.log('este el ultimo grupo', grupo)
        res.status(200).json({ success: true, data: grupo });
    } catch (error) {
        console.error('Error al insertar grupo:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener las edades de los clientes de un grupo
export const obtenerEdadesPorGrupo = async (req, res) => {
    const { id_grupo } = req.params;  // Obtiene el ID del grupo desde los parámetros de la solicitud

    try {
        const edades = await gruposService.obtenerEdadesPorGrupo(id_grupo);
        res.status(200).json({ success: true, data: edades });
    } catch (error) {
        console.error('Error al obtener las edades por grupo:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controlador que coordina el GET para obtener edades y luego el POST para procesarlas
export const obtenerYProcesarEdades = async (req, res) => {
    const { id_grupo } = req.params;

    try {
        // Llamar al servicio GET para obtener las edades del grupo
        const resultado = await gruposService.obtenerEdadesPorGrupo(id_grupo);

        // Extraer solo el campo de edades (cadena)
        const edadesCadena = resultado[0].edades;

        // Transformar la cadena de edades "31, 34, 31" en un array de números [31, 34, 31]
        const edadesArray = edadesCadena.split(',').map(Number);

        // Ahora enviar el array de edades al microservicio POST
        const resultadoPost = await gruposService.procesarEdades(edadesArray);

        res.status(200).json({ success: true, data: resultadoPost });
    } catch (error) {
        console.error('Error en obtenerYProcesarEdades (Controlador):', error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// Actualizar un grupo existente
export const actualizarGrupo = async (req, res) => {
    const { id_grupo } = req.params;
    const { id_pdf, nombre_grupo } = req.body;
    try {
        await gruposService.actualizarGrupo(id_grupo, id_pdf, nombre_grupo);
        res.status(200).json({ message: 'Grupo actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar grupo:', error);
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un grupo lógicamente
export const eliminarGrupo = async (req, res) => {
    const { id_grupo } = req.params;
    try {
        await gruposService.eliminarGrupo(id_grupo);
        res.status(200).json({ message: 'Grupo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar grupo:', error);
        res.status(500).json({ message: error.message });
    }
};
