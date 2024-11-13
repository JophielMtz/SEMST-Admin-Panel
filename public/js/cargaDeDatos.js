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
    document.getElementById("personal_id").value = docente.personal_id;
    document.getElementById("nombre_docente").value = `${docente.nombre_personal} ${docente.apellido_paterno} ${docente.apellido_materno}`;
    document.getElementById("antiguedad").value = docente.antiguedad;
    document.getElementById("telefono").value = docente.telefono;
    document.getElementById("cct_sale").value = docente.clave_cct || '';
    document.getElementById("municipio_sale").value = docente.nombre_municipio || '';
    document.getElementById("comunidad_sale").value = docente.nombre_comunidad || '';

    const profileImage = document.querySelector(".profile-pic");
    if (profileImage && docente.imagen) {
        profileImage.src = `/uploads/${docente.imagen}`;
        console.log(`Actualizada imagen de perfil a: /uploads/${docente.imagen}`);
    }
}


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
    let debounceTimer;

    nombreInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        const valor = nombreInput.value.trim();
        if (valor.length >= 2) {
            debounceTimer = setTimeout(async () => {
                const docentes = await buscarDocente(valor);
                mostrarSugerencias(docentes, suggestionsList);
                ajustarPosicionSugerencias(nombreInput, suggestionsList); // Ajusta posición
            }, 300);
        } else {
            suggestionsList.innerHTML = "";
        }
    });
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

// **Funciones para Actualizar Datos Basados en Selecciones**

function updateZonas(sectorId) {
    // Lógica para actualizar zonas basadas en el sector seleccionado
    // ...
}

function actualizarComunidadesPorMunicipio(municipioId) {
    // Lógica para actualizar comunidades basadas en el municipio seleccionado
    // ...
}

function updateMunicipiosComunidadesCCT(zonaId) {
    // Lógica para actualizar municipios, comunidades y CCTs basadas en la zona seleccionada
    // ...
}

function actualizarCCTs() {
    // Lógica para actualizar CCTs basadas en las selecciones actuales
    // ...
}

//Cargar datos lista-general



// Exportamos las funciones para ser utilizadas en otros módulos
export { 
    cargarMunicipios, 
    cargarComunidades, 
    cargarCCTs, 
    actualizarSelect,
    configurarAutocompletado,

 };
