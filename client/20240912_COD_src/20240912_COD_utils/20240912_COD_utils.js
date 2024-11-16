/**
 * Convierte una fecha ISO a formato "yyyy-MM-dd"
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} - Fecha en formato "yyyy-MM-dd"
 */
export const formatoFecha = (isoDate) => {
    if (!isoDate) return ''; // Verificar si la fecha es nula o vacía
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Añadir cero inicial si es necesario
    const day = String(date.getDate()).padStart(2, '0'); // Añadir cero inicial si es necesario
    return `${year}-${month}-${day}`;
};
