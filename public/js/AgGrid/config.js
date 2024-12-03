// ./AgGrid/config.js
const notyf = new Notyf();

const STATUS_CLASSES = {
  "Atendido": "btn-atendido",
  "Cubierta": "btn-cubierta",
  "Entregado a SETEL": "btn-entregado-a-setel",
  "En proceso": "btn-en-proceso",
  "Inseguridad": "btn-inseguridad",
  "No se atiende": "btn-no-se-atiende",
  "No se justifica": "btn-no-se-justifica",
  "Salud": "btn-salud",
  "Sin CT": "btn-sin-ct",
  "Sin cubrir": "btn-sin-cubrir",
  "Terminado": "btn-terminado",
  "default": "btn-secondary"
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

  if (!data || !colDef || newValue === oldValue) return; // No hay cambio

  const field = colDef.field; // Campo de la celda
  if (!data[field]) {
      console.log("El valor no fue validado correctamente, no se enviará al servidor.");
      return; // No se envía al servidor si el valor no es válido
  }

  const { endpoint } = event.context || {};
  if (!endpoint) {
      console.error("Endpoint no configurado en el contexto:", event.context);
      return;
  }

  // Obtener identificadores
  const np = data.np || null;
  const personal_id = data.personal_id || null;

  if (!np && !personal_id) {
      console.error("No se encontró un identificador válido en los datos de la fila:", data);
      return;
  }

  // Llamar a la función POST
  const result = await funcionPost(endpoint, personal_id, np, field, newValue);

  if (!result.success) {
      alert(result.message || "Error desconocido al actualizar la celda.");
      event.node.setDataValue(field, oldValue); // Revertir valor si hay error
  }
};

export const toggleEditMode = {
  element: document.querySelector("#toggleEditMode"),
  init() {
      this.element.addEventListener("click", async () => {
          const button = this.element;

          if (editMode) {
              if (confirm("¿Estás seguro de los cambios?")) {
                  editMode = false;
                  button.innerHTML = '<i class="fas fa-edit me-2"></i>Activar Edición';
                  gridApi.refreshCells({ force: true });
                  await reloadData();
              }
          } else {
              editMode = true;
              button.innerHTML = '<i class="fas fa-times me-2"></i>Finalizar Edición';
              gridApi.refreshCells({ force: true });
          }
      });
  }
};




// Funcion borrar
// Definir Notyf
export const borrarColumna = (apiEndpoint) => {
  return {
    field: "Accion",
    headerName: "Acción",
    width: 90,
    editable: false,
    cellRenderer: (params) => {
      if (!params.data || (!params.data.np && !params.data.personal_id)) {
        console.error("Datos insuficientes para renderizar la columna:", params.data);
        return null;
      }

      // Crear el contenedor del botón
      const deleteButton = document.createElement('a');
      deleteButton.className = 'btn btn-sm btn-icon text-primary';
      deleteButton.setAttribute('data-bs-toggle', 'tooltip');
      deleteButton.setAttribute('title', 'Delete User');
      deleteButton.style.cursor = 'pointer';

      // Insertar el SVG dentro del botón
      deleteButton.innerHTML = `
        <span class="btn-inner">
            <svg class="icon-20" width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                <path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M20.708 6.23975H3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </span>
      `;

      // Agregar evento al botón
      deleteButton.addEventListener('click', async () => {
        // Mostrar la confirmación usando SweetAlert2
        const result = await Swal.fire({
          title: '¿Deseas eliminar esta fila?',
          text: 'Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        });

        if (result.isConfirmed) {
          try {
            const np = params.data.np; // Identificador único (np)
            const personalId = params.data.personal_id; // Identificador alternativo
            const tabla = params.data.tabla || "default"; // Tabla asociada

            if (!np && !personalId) {
              alert('Error: Datos insuficientes para eliminar el registro.');
              console.error('Datos insuficientes:', { np, personalId, tabla });
              return;
            }

            // Enviar el identificador al servidor
            const response = await fetch(apiEndpoint, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ np: np || personalId, tabla })
            });

            if (response.ok) {
              params.api.applyTransaction({ remove: [params.node.data] });

              // Mostrar notificación de éxito con Notyf
              notyf.success({
                message: 'Registro borrado exitosamente',
                duration: 2000,  // Duración de 2 segundos
                position: { x: 'right', y: 'top' }  // Posición en la pantalla
              });
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

      return deleteButton;
    },
  };
};





