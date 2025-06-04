import dayjs from 'dayjs';

//**
// Formatea una fecha (dayjs, string, timestamp, etC.) a "YYYY-MM-DD HH"
// Devuelve undefined si la fecha no es válida
// @ param {any} date - Fecha a formatear
//@returns {string | undefined} - Fecha formateada o undefined si no es válida
//  */
export const formatDate = (date) => {
    if (!date || typeof date === null || typeof date === "boolean") return undefined;

    const parsed = dayjs(date);
    // Verifica si la fecha es válida
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : undefined;
};