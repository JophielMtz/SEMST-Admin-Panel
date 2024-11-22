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

// Renderizador de estado para AG Grid
export const statusRenderer = (params) => {
  const span = document.createElement("span");
  span.textContent = params.value;
  span.classList.add("btn-status");

  // Reemplaza espacios por guiones bajos para las clases CSS
  const statusClass = getStatusClass(params.value).replace(/\s+/g, "_");
  span.classList.add(statusClass);

  return span;
};

//Funcion de estatus
export const createValidatedValueSetter = (validValues) => {
  return (params) => {
    const normalizedValue = params.newValue?.trim();
    if (validValues.includes(normalizedValue)) {
      params.data[params.colDef.field] = normalizedValue; // Asigna dinámicamente el valor
      return true; // Actualización exitosa
    } else {
      alert(`Valor inválido. Seleccione un valor de la lista: ${validValues.join(", ")}`);
      return false; // Rechaza la actualización
    }
  };
};

// Generador genérico de configuración de columnas select
export const createSelectColumnProps = (validValues) => {
  return {
    cellRenderer: statusRenderer,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: validValues },
    valueSetter: createValidatedValueSetter(validValues),
  };
};

// Col Fecha configurada
export const colFecha = (editMode) => ({
  headerName: "Fecha",
  field: "fecha",
  editable: () => editMode, // Configuración dinámica de edición
  width: 115,
  cellEditor: "agDateCellEditor",
  valueFormatter: (params) => {
    const date = new Date(params.value);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Monterrey",
    });
  },
});





/**
 * Función genérica para hacer una petición POST o PUT al servidor.
 * @param {string} endpoint - Endpoint del servidor.
 * @param {string} personal_id - ID de la fila.
 * @param {string} field - Campo que se está actualizando.
 * @param {any} value - Nuevo valor del campo.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const funcionPost = async (endpoint, personal_id, np, field, value) => {
  try {
    // Construir el cuerpo dinámicamente sin campos innecesarios
    const bodyData = {
      field,
      value,
    };

    // Solo incluir `personal_id` si está definido
    if (personal_id) {
      bodyData.personal_id = personal_id;
    }

    // Solo incluir `np` si está definido
    if (np) {
      bodyData.np = np;
    }

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
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


/**
 * Maneja la lógica de actualización de celdas en la tabla.
 * @param {Object} event - Evento de cambio de valor en la celda.
 */
export const editarCelda = async (event) => {
  const { data, colDef, newValue, oldValue } = event;

  if (!data || !colDef || newValue === oldValue) return;

  const { endpoint } = event.context || {};
  if (!endpoint) {
    console.error("Endpoint no configurado en el contexto:", event.context);
    return;
  }

  // Obtener los identificadores y el campo
  const np = data.np || null; // Asigna el valor de np
  const personal_id = data.personal_id || null; // Asigna el valor de personal_id si existe
  const field = colDef.field; // El campo a actualizar
  const value = newValue; // El nuevo valor

  // Validar que al menos uno de los identificadores esté presente
  if (!np && !personal_id) {
    console.error("No se encontró un identificador válido en los datos de la fila:", data);
    return;
  }

  // Llamar a la función POST con los valores correctos
  const result = await funcionPost(endpoint, personal_id, np, field, value);

  if (!result.success) {
    alert(result.message || "Error desconocido al actualizar la celda.");
    event.node.setDataValue(field, oldValue); // Revertir el valor si hay error
  }
};

// Módulo para configurar cellEditorParams y lógica relacionada
export const municipioCellEditorParams = (params) => {
  const values = params.context.municipios.map((m) => m.nombre_municipio);

  const valueSetter = (params) => {
      console.log("[FRONTEND] Municipio seleccionado:", params.newValue);

      const municipioObj = params.context.municipios.find(
          (m) => m.nombre_municipio === params.newValue
      );

      if (municipioObj) {
          console.log("[FRONTEND] Municipio encontrado:", municipioObj);

          params.data.municipio_id = municipioObj.municipio_id;
          params.data.municipio_sale = municipioObj.nombre_municipio;

          // Actualizamos las comunidades disponibles
          params.context.currentComunidades = municipioObj.comunidades || [];
          params.context.currentCCTs = [];
          console.log("[FRONTEND] Comunidades actualizadas:", params.context.currentComunidades);

          return true;
      }

      console.error("[FRONTEND] Municipio inválido:", params.newValue);
      return false;
  };

  return { values, valueSetter };
};

export const comunidadCellEditorParams = (params) => {
  const values = params.context.currentComunidades.map((c) => c.nombre_comunidad);

  const valueSetter = async (params) => {
      console.log("[FRONTEND] Comunidad seleccionada:", params.newValue);

      const comunidadObj = params.context.currentComunidades.find(
          (c) => c.nombre_comunidad === params.newValue
      );

      if (comunidadObj) {
          console.log("[FRONTEND] Comunidad encontrada:", comunidadObj);

          params.data.comunidad_id = comunidadObj.comunidad_id;
          params.data.comunidad_sale = comunidadObj.nombre_comunidad;

          try {
              const ccts = await fetchCCTs(params.data.municipio_id, comunidadObj.comunidad_id);
              console.log("[FRONTEND] CCTs recibidos:", ccts);

              params.context.currentCCTs = ccts || [];
              return true;
          } catch (error) {
              console.error("[FRONTEND] Error al cargar CCTs:", error);
              return false;
          }
      }

      console.error("[FRONTEND] Comunidad inválida:", params.newValue);
      return false;
  };

  return { values, valueSetter };
};

export const cctCellEditorParams = (params) => {
  const values = params.context.currentCCTs.map((c) => c.centro_clave_trabajo);

  const valueSetter = (params) => {
      console.log("[FRONTEND] CCT seleccionado:", params.newValue);

      const cctObj = params.context.currentCCTs.find(
          (c) => c.centro_clave_trabajo === params.newValue
      );

      if (cctObj) {
          console.log("[FRONTEND] CCT encontrado:", cctObj);

          params.data.cct_id = cctObj.cct_id;
          params.data.cct_sale = cctObj.centro_clave_trabajo;
          return true;
      }

      console.error("[FRONTEND] CCT inválido:", params.newValue);
      return false;
  };

  return { values, valueSetter };
};


// Funcion borrar
export const borrarColumna = (apiEndpoint) => {
  return {
      field: "Accion",
      headerName: "Acción",
      width: 90,
      editable: false, // No editable porque es una acción
      cellRenderer: (params) => {
          // Verificar si los datos son válidos antes de renderizar
          if (!params.data || !params.data.np) {
              console.error("Datos insuficientes para renderizar la columna:", params.data);
              return null;
          }

          // Crear el ícono de eliminar
          const deleteIcon = document.createElement('i');
          deleteIcon.className = 'fas fa-trash btn-secondary';
          deleteIcon.style.fontSize = '15px';
          deleteIcon.style.cursor = 'pointer';
          deleteIcon.title = 'Eliminar';

          // Agregar evento al ícono
          deleteIcon.addEventListener('click', async () => {
              const confirmDelete = confirm(`¿Deseas eliminar esta fila?`);
              if (confirmDelete) {
                  try {
                      const np = params.data.np; // Identificador único
                      const tabla = params.data.tabla || "default"; // Tabla asociada (asegúrate de incluirla)

                      if (!np || !tabla) {
                          alert('Error: Datos insuficientes para eliminar el registro.');
                          console.error('Datos insuficientes:', { np, tabla });
                          return;
                      }

                      const response = await fetch(apiEndpoint, {
                          method: 'DELETE',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ np, tabla }),
                      });

                      if (response.ok) {
                          params.api.applyTransaction({ remove: [params.node.data] });
                          alert('Registro eliminado exitosamente.');
                      } else {
                          const error = await response.json();
                          alert(`Error: ${error.message}`);
                      }
                  } catch (err) {
                      console.error('Error al eliminar el registro:', err);
                      alert('Error al comunicarse con el servidor.');
                  }
              }
          });

          return deleteIcon;
      },
  };
};




