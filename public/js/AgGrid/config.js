// ./AgGrid/config.js
const STATUS_CLASSES = {
  "Atendido": "btn-atendido",
  "En proceso": "btn-en-proceso",
  "Sin atender": "btn-sin-atender",
  "Salud": "btn-salud",
  "Sin CT": "btn-sin-ct",
  "Inseguridad": "btn-inseguridad",
  "Cubierta": "btn-cubierta",
  "Sin cubrir": "btn-sin-cubrir",
  "No se justifica": "btn-no-se-justifica",
  "default": "btn-secondary", // Clase por defecto para valores desconocidos
};

export const getStatusClass = (status) => {
  return STATUS_CLASSES[status] || STATUS_CLASSES["default"];
};


//Formateo de fecha 
export const dateFormatter = (params) => {
  const date = new Date(params.value);
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Monterrey",
  });
};

/**
 * Función genérica para actualizar una celda en el servidor.
 * @param {string} endpoint - Endpoint del servidor.
 * @param {string} personal_id - ID de la fila.
 * @param {string} field - Campo que se está actualizando.
 * @param {any} value - Nuevo valor del campo.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const editarCelda = async (endpoint, personal_id, field, value) => {
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personal_id, field, value }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`Error: ${result.message}`);
      return { success: false, message: result.message };
    }

    console.log("Celda actualizada correctamente:", result.message);
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error al actualizar la celda:", error);
    return { success: false, message: "Error al actualizar la celda." };
  }
};