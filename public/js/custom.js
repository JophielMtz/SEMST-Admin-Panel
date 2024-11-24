// 1. Funciones auxiliares

function actualizarSelect(selectId, items, defaultText, valueKey, textKey) {
  let select = document.getElementById(selectId);
  select.innerHTML = `<option value="">${defaultText}</option>`;

  items.forEach(item => {
      // Verificar que los valores no sean nulos o indefinidos
      if (item[valueKey] && item[textKey]) {
          let option = document.createElement('option');
          option.value = item[valueKey];
          option.textContent = item[textKey];
          select.appendChild(option);
      }
  });

  // Habilitar el select si tiene opciones
  select.disabled = items.length === 0;
}

function updateZonas(sectorId) {
  if (!sectorId) {
      limpiarSelect('zona_id', 'Selecciona una zona');
      limpiarSelect('comunidad_id', 'Selecciona una comunidad');
      limpiarSelect('municipio_id', 'Selecciona un municipio');
      limpiarSelect('cct_id', 'Clave CCT');
      return;
  }

  // Realizar la solicitud al backend para obtener las zonas filtradas por sector
  fetch(`/obtener-datos-sector/${encodeURIComponent(sectorId)}`)
      .then(response => response.json())
      .then(data => {
          if (!data || !data.zonas || !data.comunidades || !data.municipios || !data.ccts) {
              throw new Error('Datos incompletos recibidos del servidor');
          }

          // Actualizar los selectores correspondientes
          actualizarSelect('zona_id', data.zonas, 'Selecciona una zona', 'zona_id', 'numero_zona');
          actualizarSelect('comunidad_id', data.comunidades, 'Selecciona una comunidad', 'comunidad_id', 'nombre_comunidad');
          actualizarSelect('municipio_id', data.municipios, 'Selecciona un municipio', 'municipio_id', 'nombre_municipio');
          actualizarSelect('cct_id', data.ccts, 'Clave CCT', 'cct_id', 'centro_clave_trabajo');

          // Asignar eventos nuevamente para los nuevos elementos
          asignarEventos();
      })
      .catch(error => console.error('Error al obtener datos del sector:', error));
}


function limpiarSelect(selectId, defaultText) {
  let select = document.getElementById(selectId);
  select.innerHTML = `<option value="">${defaultText}</option>`;
  select.disabled = true;
}

// 2. Funciones de actualización

function actualizarComunidadesPorMunicipio(municipioId) {
  const sectorId = document.getElementById('sector_id').value;

  if (!sectorId) {
      console.error('Sector ID es requerido para obtener las comunidades.');
      limpiarSelect('comunidad_id', 'Selecciona una comunidad');
      return;
  }

  fetch(`/obtener-comunidades-por-municipio/${encodeURIComponent(municipioId)}?sectorId=${encodeURIComponent(sectorId)}`)
      .then(response => response.json())
      .then(data => {
          if (!data.comunidades) {
              throw new Error('Datos incompletos recibidos del servidor');
          }

          // Actualizar el select de comunidades
          actualizarSelect('comunidad_id', data.comunidades, 'Selecciona una comunidad', 'comunidad_id', 'nombre_comunidad');
      })
      .catch(error => {
          console.error('Error al obtener comunidades por municipio y sector:', error);
          limpiarSelect('comunidad_id', 'Error al cargar comunidades');
      });
}

function updateMunicipiosComunidadesCCT(zonaId) {
  const sectorId = document.getElementById('sector_id').value;

  if (!sectorId) {
      console.error('Sector ID es requerido para obtener municipios y comunidades.');
      limpiarSelect('municipio_id', 'Selecciona un municipio');
      limpiarSelect('comunidad_id', 'Selecciona una comunidad');
      limpiarSelect('cct_id', 'Clave CCT');
      return;
  }

  fetch(`/obtener-comunidad-municipio/${encodeURIComponent(zonaId)}?sectorId=${encodeURIComponent(sectorId)}`)
      .then(response => response.json())
      .then(data => {
          if (!data.comunidades || !data.municipios || !data.ccts) {
              throw new Error('Datos incompletos recibidos del servidor');
          }

          // Actualizar los selects correspondientes
          actualizarSelect('comunidad_id', data.comunidades, 'Selecciona una comunidad', 'comunidad_id', 'nombre_comunidad');
          actualizarSelect('municipio_id', data.municipios, 'Selecciona un municipio', 'municipio_id', 'nombre_municipio');
          actualizarSelect('cct_id', data.ccts, 'Clave CCT', 'cct_id', 'centro_clave_trabajo');

          // Asignar eventos
          asignarEventos();
      })
      .catch(error => {
          console.error('Error al obtener comunidades y municipios por zona y sector:', error);
          limpiarSelect('comunidad_id', 'Error al cargar comunidades');
          limpiarSelect('municipio_id', 'Error al cargar municipios');
          limpiarSelect('cct_id', 'Clave CCT');
      });
}

function actualizarCCTs() {
  let sectorId = document.getElementById('sector_id').value;
  let zonaId = document.getElementById('zona_id').value;
  let comunidadId = document.getElementById('comunidad_id').value;
  let municipioId = document.getElementById('municipio_id').value;

  console.log(`Actualizando CCTs con: {sectorId: '${sectorId}', zonaId: '${zonaId}', comunidadId: '${comunidadId}', municipioId: '${municipioId}'}`);

  if (!sectorId || !zonaId || !comunidadId || !municipioId) {
      limpiarSelect('cct_id', 'Clave CCT');
      return;
  }

  // Construir la URL con los parámetros necesarios
  let url = `/obtener-ccts?sectorId=${encodeURIComponent(sectorId)}&zonaId=${encodeURIComponent(zonaId)}&comunidadId=${encodeURIComponent(comunidadId)}&municipioId=${encodeURIComponent(municipioId)}`;

  console.log(`Fetch URL: ${url}`);

  fetch(url)
      .then(response => response.json())
      .then(data => {
          console.log('Datos recibidos:', data);
          if (!data.ccts) {
              throw new Error('Datos incompletos recibidos del servidor');
          }

          // Reemplaza la limpieza y agregado manual con actualizarSelect
          actualizarSelect('cct_id', data.ccts, 'Clave CCT', 'cct_id', 'centro_clave_trabajo');
      })
      .catch(error => {
          console.error('Error al obtener CCTs:', error);
          limpiarSelect('cct_id', 'Error al cargar CCTs');
      });
}


// 3. Manejadores de eventos

function cctChangeHandler(event) {
  let cctId = event.target.value;
  if (cctId) {
      console.log("Centro de Trabajo seleccionado con ID:", cctId);
      // Lógica adicional cuando se selecciona un CCT
  } else {
      console.log("No se ha seleccionado ningún Centro de Trabajo.");
      // Lógica para manejar la selección de un valor vacío
  }
}

function comunidadChangeHandler() {
  let comunidadId = this.value;
  console.log("Comunidad seleccionada con ID:", comunidadId);
  if (comunidadId) {
      actualizarCCTs();
  } else {
      limpiarSelect('cct_id', 'Clave CCT');
  }
}

function municipioChangeHandler() {
  let municipioId = this.value;
  const sectorId = document.getElementById('sector_id').value;
  
  console.log("Municipio seleccionado:", municipioId);
  console.log("Sector ID actual:", sectorId);
  
  if (municipioId) {
      actualizarComunidadesPorMunicipio(municipioId);
      actualizarCCTs();
  } else {
      limpiarSelect('cct_id', 'Clave CCT');
      limpiarSelect('comunidad_id', 'Selecciona una comunidad');
  }
}

function zonaChangeHandler() {
  let zonaId = this.value;
  const sectorId = document.getElementById('sector_id').value;
  
  console.log("Zona seleccionada con ID:", zonaId);
  console.log("Sector ID actual:", sectorId);
  
  if (zonaId) {
      updateMunicipiosComunidadesCCT(zonaId);
  } else {
      limpiarSelect('comunidad_id', 'Selecciona una comunidad');
      limpiarSelect('municipio_id', 'Selecciona un municipio');
      limpiarSelect('cct_id', 'Clave CCT');
  }
}

// 4. Funciones auxiliares (ya definidas arriba)

// 5. Función para asignar eventos a los selects

function asignarEventos() {
  console.log("Asignando eventos...");

  // Asignar evento al select de zona
  let zonaSelect = document.getElementById('zona_id');
  zonaSelect.removeEventListener('change', zonaChangeHandler);
  zonaSelect.addEventListener('change', zonaChangeHandler);

  // Asignar evento al select de comunidad
  let comunidadSelect = document.getElementById('comunidad_id');
  comunidadSelect.removeEventListener('change', comunidadChangeHandler);
  comunidadSelect.addEventListener('change', comunidadChangeHandler);

  // Asignar evento al select de municipio
  let municipioSelect = document.getElementById('municipio_id');
  municipioSelect.removeEventListener('change', municipioChangeHandler);
  municipioSelect.addEventListener('change', municipioChangeHandler);

  // Asignar evento al select de CCT
  let cctSelect = document.getElementById('cct_id');
  cctSelect.removeEventListener('change', cctChangeHandler);
  cctSelect.addEventListener('change', cctChangeHandler);

  console.log("Eventos asignados correctamente.");
}

// 6. Asignar eventos una vez que el DOM haya cargado

document.addEventListener('DOMContentLoaded', () => {
  // Asignar evento al select de sector
  let sectorSelect = document.getElementById('sector_id');
  if (sectorSelect) {
      sectorSelect.addEventListener('change', function () {
          updateZonas(this.value);
      });
  }

  // Asignar evento al select de CCT
  let cctSelect = document.getElementById('cct_id');
  if (cctSelect) {
      cctSelect.addEventListener('change', cctChangeHandler);
  }

  // Inicializar los selects como deshabilitados excepto sector
  limpiarSelect('zona_id', 'Selecciona una zona');
  limpiarSelect('comunidad_id', 'Selecciona una comunidad');
  limpiarSelect('municipio_id', 'Selecciona un municipio');
  limpiarSelect('cct_id', 'Clave CCT');
});

//Funcion delete
async function confirmarEliminacion(id) {
    const confirmar = confirm("¿Está seguro de que desea eliminar este registro?");
    if (confirmar) {
      try {
        const response = await fetch(`/personal/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
          location.reload(); // Recarga la página para reflejar los cambios
        }
      } catch (error) {
        alert('Error al intentar eliminar el registro');
      }
    }
  }


  document.getElementById("btnMostrarConfirmacion").addEventListener("click", function() {
    const formRegistro = document.querySelector("#formRegistro");
    const seccionConfirmacion = document.getElementById("seccionConfirmacion");

    // Añade la clase de fade-out al formulario
    formRegistro.classList.add("fade-out");

    // Espera a que termine la animación para ocultar el formulario
    setTimeout(() => {
        formRegistro.style.display = "none";  // Oculta el formulario
        formRegistro.classList.remove("fade-out"); // Limpia la clase para reiniciar el estado

        // Muestra la sección de confirmación con fade-in
        seccionConfirmacion.classList.add("fade-in");
        seccionConfirmacion.style.display = "block";
    }, 1000);  // Tiempo de espera coincide con la duración de la animación (1s)

    // Genera el resumen de datos
    const datos = {
      personal_id: document.getElementById("personal_id")?.value || "No encontrado",
      nombre_docente: document.getElementById("nombre_docente")?.value || "No encontrado",
      fecha: document.getElementById("fecha")?.value || "No encontrado",
      antiguedad: document.getElementById("antiguedad")?.value || "No encontrado",
      telefono: document.getElementById("telefono")?.value || "No encontrado",
      estatus: document.getElementById("estatus")?.value || "No encontrado",
      situacion: document.getElementById("situacion")?.value || "No encontrado",
      municipio_sale: document.getElementById("municipio_sale")?.value || "No encontrado",
      comunidad_sale: document.getElementById("comunidad_sale")?.value || "No encontrado",
      cct_sale: document.getElementById("cct_sale")?.value || "No encontrado",
      municipio_entra: document.getElementById("municipio_entra")?.options[document.getElementById("municipio_entra")?.selectedIndex]?.text || "No encontrado",
      comunidad_entra: document.getElementById("comunidad_entra")?.options[document.getElementById("comunidad_entra")?.selectedIndex]?.text || "No encontrado",
      cct_entra: document.getElementById("cct_entra")?.options[document.getElementById("cct_entra")?.selectedIndex]?.text || "No encontrado",
      estatus_cubierta: document.getElementById("estatus_cubierta")?.value || "No encontrado",
      observaciones: document.getElementById("observaciones")?.value || "No encontrado",
  };
  
  console.log("Datos generados:", datos);

    // Genera el HTML para el resumen de datos
    let resumenHTML = '<ul class="list-group">';
    for (const [clave, valor] of Object.entries(datos)) {
      resumenHTML += `<li class="list-group-item"><strong>${clave.replace('_', ' ')}:</strong> ${valor}</li>`;
    }
    resumenHTML += '</ul>';

    // Muestra el resumen en el modal
    document.getElementById("resumenDatos").innerHTML = resumenHTML;
});

// Control para regresar al formulario de edición
document.getElementById("btnEditar").addEventListener("click", function () {
    const formRegistro = document.querySelector("#formRegistro");
    const seccionConfirmacion = document.getElementById("seccionConfirmacion");

    // Aplica fade-out a la confirmación antes de mostrar el formulario
    seccionConfirmacion.classList.add("fade-out");

    // Espera la animación para cambiar de vista
    setTimeout(() => {
        seccionConfirmacion.style.display = "none";
        seccionConfirmacion.classList.remove("fade-out");
        
        formRegistro.style.display = "block";
        formRegistro.classList.add("fade-in");
    }, 1000);
});
