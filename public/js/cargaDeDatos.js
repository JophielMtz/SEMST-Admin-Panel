// cargaDeDatos.js

// **Funciones para Cargar Datos**

async function buscarDocente(valor) {
    console.log(`Buscando docentes con valor: "${valor}"`);
    try {
        const response = await fetch(`/buscarpersonal/${valor}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Devolvemos los datos para ser usados en otra función
    } catch (error) {
        console.error("Error al buscar docentes:", error);
        return [];
    }
}



function llenarFormulario(docente) {
    console.log(`Llenando formulario con docente ID: ${docente.personal_id}`);

    // Mapear datos a los campos del formulario
    const campos = {
        personal_id: docente.personal_id,
        nombre_docente: `${docente.nombre_personal} ${docente.apellido_paterno} ${docente.apellido_materno}`,
        // antiguedad: docente.antiguedad,
        telefono: docente.telefono,
        cct_sale: docente.clave_cct || '',
        municipio_sale: docente.nombre_municipio || '',
        comunidad_sale: docente.nombre_comunidad || '',
        municipio_entra: docente.municipio_entra || '', // Opcional
        comunidad_entra: docente.comunidad_entra || '', // Opcional
        cct_entra: docente.cct_entra || '' // Opcional
    };

    // Rellenar solo los campos existentes
    for (const [id, value] of Object.entries(campos)) {
        const input = document.getElementById(id);
        if (input) input.value = value; // Solo asigna el valor si el campo existe
    }

    // Actualizar imagen de perfil si existe
    const profileImage = document.querySelector(".profile-pic");
    if (profileImage && docente.imagen) {
        profileImage.src = `/uploads/${docente.imagen}`;
        console.log(`Actualizada imagen de perfil a: /uploads/${docente.imagen}`);
    }
}



// Función para cargar los datos del formulario al abrir el modal



async function cargarDatosDocente(id) {
    console.log(`Cargando datos del docente con ID: ${id}`);
    try {
        const response = await fetch(`/editar-personal-nuevo/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }
        const { docente } = await response.json();
        if (!docente) {
            throw new Error("No se encontraron datos del docente.");
        }
        llenarFormulario(docente);
    } catch (error) {
        console.error("Error al cargar los datos del docente:", error);
    }
}


function configurarAutocompletado() {
    const nombreInput = document.getElementById("nombre_docente");
    const suggestionsList = document.getElementById("suggestionsList");

    if (!nombreInput || !suggestionsList) {
        console.warn("El campo 'nombre_docente' o 'suggestionsList' no está en el formulario.");
        return;
    }

    let debounceTimer;

    nombreInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);

        const valor = nombreInput.value.trim();
        if (valor.length >= 2) {
            debounceTimer = setTimeout(async () => {
                try {
                    const docentes = await buscarDocente(valor);

                    if (Array.isArray(docentes) && docentes.length > 0) {
                        const docentesOrdenados = docentes.sort((a, b) => {
                            const nombreA = `${a.nombre_personal} ${a.apellido_paterno} ${a.apellido_materno}`.toLowerCase();
                            const nombreB = `${b.nombre_personal} ${b.apellido_paterno} ${b.apellido_materno}`.toLowerCase();
                            return nombreA.localeCompare(nombreB);
                        });

                        mostrarSugerencias(docentesOrdenados, suggestionsList);

                        // Ajustar diseño y comportamiento visual del contenedor
                        suggestionsList.style.display = "block";
                        suggestionsList.style.maxHeight = "600px";
                        suggestionsList.style.overflowY = "auto";
                        suggestionsList.style.position = "absolute";
                        suggestionsList.style.zIndex = "1000";
                        suggestionsList.style.width = `${nombreInput.offsetWidth}px`;

                    } else {
                        suggestionsList.innerHTML = "<li class='list-group-item text-muted'>No se encontraron resultados.</li>";
                    }
                } catch (error) {
                    console.error("Error al buscar docentes:", error);
                }
            }, 300);
        } else {
            suggestionsList.innerHTML = "";
            suggestionsList.style.display = "none";
        }
    });

    // Ocultar lista de sugerencias al hacer clic fuera
    document.addEventListener("click", (e) => {
        if (!nombreInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.style.display = "none";
        }
    });
}



function configurarBloqueCCT() {
    const municipioSelect = document.querySelector('#nuevoRegistroModal #municipio_entra');
    const comunidadSelect = document.querySelector('#nuevoRegistroModal #comunidad_entra');
    const cctSelect = document.querySelector('#nuevoRegistroModal #cct_entra');

    if (municipioSelect) {
        municipioSelect.addEventListener("change", function () {
            cargarComunidades(this.value).then(data => {
                actualizarSelect('comunidad_entra', data, 'Seleccione Comunidad', 'comunidad_id', 'nombre_comunidad');
            });
        });
    }

    if (comunidadSelect) {
        comunidadSelect.addEventListener("change", function () {
            cargarCCTs(municipioSelect?.value || '', this.value).then(data => {
                actualizarSelect('cct_entra', data, 'Seleccione Clave CCT', 'cct_id', 'centro_clave_trabajo');
            });
        });
    }
}



function mostrarSugerencias(docentes, suggestionsList) {
    // Limpiar lista de sugerencias
    suggestionsList.innerHTML = "";

    // Verificar si hay resultados
    if (docentes.length === 0) {
        const noResultItem = document.createElement("li");
        noResultItem.classList.add("list-group-item", "text-muted"); // Estilo para el mensaje
        noResultItem.textContent = "No se encontraron resultados."; // Mensaje a mostrar
        suggestionsList.appendChild(noResultItem);
        return; // Termina la ejecución si no hay resultados
    }

    // Mostrar sugerencias
    docentes.forEach(docente => {
        const suggestionItem = document.createElement("li");
        suggestionItem.classList.add("list-group-item", "list-group-item-action");
        suggestionItem.textContent = `${docente.nombre_personal} ${docente.apellido_paterno} ${docente.apellido_materno}`;
        suggestionItem.dataset.personalId = docente.personal_id;

        // Evento al hacer clic en una sugerencia
        suggestionItem.addEventListener("click", () => {
            llenarFormulario(docente); // Llena el formulario con los datos seleccionados
            suggestionsList.innerHTML = ""; // Limpia las sugerencias después de seleccionar
            document.getElementById("nombre_docente").value = 
                `${docente.nombre_personal} ${docente.apellido_paterno} ${docente.apellido_materno}`; // Asegura el valor
        });

        suggestionsList.appendChild(suggestionItem);
    });
}



function cargarMunicipios() {
    return fetch("/obtener-municipios")
        .then(response => response.json());
}

function cargarComunidades(municipioId) {
    return fetch(`/obtener-comunidades/${municipioId}`)
        .then(response => response.json());
}

function cargarCCTs(municipioId, comunidadId) {
    return fetch(`/obtener-ccts/${municipioId}/${comunidadId}`)
        .then(response => response.json());
}

function actualizarSelect(selectId, items, defaultText, valueKey, textKey) {
    let select = document.querySelector(`#nuevoRegistroModal #${selectId}`);
    select.innerHTML = `<option value="">${defaultText}</option>`;

    items.forEach(item => {
        if (item[valueKey] && item[textKey]) {
            let option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = item[textKey];
            select.appendChild(option);
        }
    });
    select.disabled = items.length === 0;
}




function cargarSectores() {
    return fetch("/obtener-sectores")
        .then(response => response.json())
        .catch(error => {
            console.error("Error al cargar sectores:", error);
            return [];
        });
}

function cargarZonas(sectorId) {
    return fetch(`/obtener-zonas/${sectorId}`)
        .then(response => response.json())
        .catch(error => {
            console.error(`Error al cargar zonas para el sector ${sectorId}:`, error);
            return [];
        });
}

export { 
    cargarMunicipios, 
    cargarComunidades, 
    cargarCCTs, 
    actualizarSelect,
    configurarAutocompletado,
    configurarBloqueCCT,
    cargarSectores,
    cargarZonas,

 };