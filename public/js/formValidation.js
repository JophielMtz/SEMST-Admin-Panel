document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado y parseado");

    // **Elementos del Formulario**
    const form = document.getElementById('formRegistro');
    const nombreDocente = document.getElementById('nombre_docente');
    const antiguedad = document.getElementById('antiguedad');
    const telefono = document.getElementById('telefono');
    const municipioSale = document.getElementById('municipio_sale');
    const comunidadSale = document.getElementById('comunidad_sale');
    const municipioEntra = document.getElementById('municipio_entra');
    const comunidadEntra = document.getElementById('comunidad_entra');
    const cctEntra = document.getElementById('cct_entra');
    const estatus = document.getElementById('estatus');
    const situacion = document.getElementById('situacion');
    const estatusCubierta = document.getElementById('estatus_cubierta');
    const fecha = document.getElementById('fecha');
    const observaciones = document.getElementById('observaciones');

    // **Botones**
    const btnMostrarConfirmacion = document.getElementById("btnMostrarConfirmacion");
    const btnConfirmar = document.getElementById("btnConfirmar");
    const btnEditar = document.getElementById("btnEditar");

    // **Secciones**
    const formRegistro = document.getElementById("formRegistro");
    const seccionConfirmacion = document.getElementById("seccionConfirmacion");
    const resumenDatos = document.getElementById("resumenDatos");

    // **Validaciones de Expresiones Regulares**
    const onlyLettersAndSpacesRegex = /^[a-zA-Z\s]+$/;
    const onlyNumbersRegex = /^\d+$/;

    // **Funciones de Validación**
    function showError(input, message) {
        console.log(`Mostrar error en ${input.id}: ${message}`);
        const parent = input.parentNode;
        let errorDiv = parent.querySelector('.invalid-feedback');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            input.classList.add('is-invalid');

            // Para asegurar que el mensaje de error aparece después del input/select
            if (input.nextSibling) {
                parent.insertBefore(errorDiv, input.nextSibling);
            } else {
                parent.appendChild(errorDiv);
            }
        }

        errorDiv.textContent = message;
    }

    function clearError(input) {
        console.log(`Limpiar error en ${input.id}`);
        const parent = input.parentNode;
        const errorDiv = parent.querySelector('.invalid-feedback');

        if (errorDiv) {
            errorDiv.remove();
        }

        input.classList.remove('is-invalid');
    }

    function validateForm() {
        console.log("Iniciando validación del formulario...");
        let isValid = true;

        // **Validación para Nombre del Docente**
        if (!onlyLettersAndSpacesRegex.test(nombreDocente.value.trim())) {
            showError(nombreDocente, 'El nombre solo debe contener letras y espacios.');
            isValid = false;
        } else {
            clearError(nombreDocente);
        }
        

        
        // **Validación para Antigüedad**
        if (!onlyNumbersRegex.test(antiguedad.value.trim())) {
            showError(antiguedad, 'La antigüedad debe ser un número.');
            isValid = false;
        } else {
            clearError(antiguedad);
        }

        // **Validación para Teléfono**
        if (!onlyNumbersRegex.test(telefono.value.trim())) {
            showError(telefono, 'El teléfono debe contener solo números.');
            isValid = false;
        } else {
            clearError(telefono);
        }

        // **Validación para Fecha**
        if (!fecha.value) {
            showError(fecha, 'Debe seleccionar una fecha.');
            isValid = false;
        } else {
            clearError(fecha);
        }

        // **Validación para Estatus**
        if (!estatus.value || estatus.value === "") {
            showError(estatus, 'Debe seleccionar un estatus.');
            isValid = false;
        } else {
            clearError(estatus);
        }

        // **Validación para Situación**
        if (!situacion.value || situacion.value === "") {
            showError(situacion, 'Debe seleccionar una situación.');
            isValid = false;
        } else {
            clearError(situacion);
        }

        // **Validación para Municipio de Entrada**
        if (!municipioEntra.value || municipioEntra.value === "") {
            showError(municipioEntra, 'Debe seleccionar un municipio de entrada.');
            isValid = false;
        } else {
            clearError(municipioEntra);
        }

        // **Validación para Comunidad de Entrada**
        if (!comunidadEntra.value || comunidadEntra.value === "") {
            showError(comunidadEntra, 'Debe seleccionar una comunidad de entrada.');
            isValid = false;
        } else {
            clearError(comunidadEntra);
        }

        // **Validación para Clave CCT de Entrada**
        if (!cctEntra.value || cctEntra.value === "") {
            showError(cctEntra, 'Debe seleccionar una Clave CCT de entrada.');
            isValid = false;
        } else {
            clearError(cctEntra);
        }

        // **Validación para Cobertura**
        if (!estatusCubierta.value || estatusCubierta.value === "") {
            showError(estatusCubierta, 'Debe seleccionar una cobertura.');
            isValid = false;
        } else {
            clearError(estatusCubierta);
        }

        console.log(`Validación completada: ${isValid ? "Válido" : "Inválido"}`);
        return isValid;
    }

    // **Función para Manejar la Autocompletación del Nombre del Docente**
    const nombreInput = nombreDocente;
    const suggestionsList = document.getElementById("suggestionsList");
    let debounceTimer;

    nombreInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        const valor = nombreInput.value.trim();
        if (valor.length >= 2) {
            debounceTimer = setTimeout(() => buscarDocente(valor), 300);
        } else {
            suggestionsList.innerHTML = "";
        }
    });

    async function buscarDocente(valor) {
        console.log(`Buscando docentes con valor: "${valor}"`);
        try {
            const response = await fetch(`/buscarpersonal/${valor}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Limpiar lista de sugerencias
            suggestionsList.innerHTML = "";

            // Mostrar sugerencias
            data.forEach(docente => {
                const suggestionItem = document.createElement("li");
                suggestionItem.classList.add("list-group-item", "list-group-item-action");
                suggestionItem.textContent = `${docente.nombre_personal} ${docente.apellido_paterno} ${docente.apellido_materno}`;
                suggestionItem.dataset.personalId = docente.personal_id;
                suggestionItem.addEventListener("click", () => llenarFormulario(docente));
                suggestionsList.appendChild(suggestionItem);
            });
        } catch (error) {
            console.error("Error al buscar docentes:", error);
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

        suggestionsList.innerHTML = "";
    }

    // **Carga de Municipios al Iniciar la Página**
    fetch("/obtener-municipios")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Cargando municipios...");
            data.forEach(municipio => {
                const option = document.createElement("option");
                option.value = municipio.municipio_id; // ID para backend
                option.setAttribute("data-nombre", municipio.nombre_municipio); // Nombre para enviar en el formulario
                option.textContent = municipio.nombre_municipio; // Mostrar al usuario
                municipioEntra.appendChild(option);
            });
            console.log("Municipios cargados.");
        })
        .catch(error => console.error("Error al cargar municipios:", error));

    // **Carga de Comunidades según el Municipio Seleccionado**
    municipioEntra.addEventListener("change", function () {
        const municipioId = municipioEntra.value;
        console.log(`Municipio seleccionado: ID ${municipioId}`);

        // Limpiar opciones previas de comunidad y CCT
        comunidadEntra.innerHTML = '<option value="" selected disabled>Seleccione Comunidad</option>';
        cctEntra.innerHTML = '<option value="" selected disabled>Seleccione Clave CCT</option>';

        fetch(`/obtener-comunidades/${municipioId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Cargando comunidades...");
                data.forEach(comunidad => {
                    const option = document.createElement("option");
                    option.value = comunidad.comunidad_id; // ID para backend
                    option.setAttribute("data-nombre", comunidad.nombre_comunidad); // Nombre para enviar en el formulario
                    option.textContent = comunidad.nombre_comunidad; // Mostrar al usuario
                    comunidadEntra.appendChild(option);
                });
                console.log("Comunidades cargadas.");
            })
            .catch(error => console.error("Error al cargar comunidades:", error));
    });

    // **Carga de CCTs según Municipio y Comunidad Seleccionados**
    comunidadEntra.addEventListener("change", function () {
        const municipioId = municipioEntra.value;
        const comunidadId = comunidadEntra.value;
        console.log(`Comunidad seleccionada: ID ${comunidadId} para Municipio ID ${municipioId}`);

        // Limpiar opciones previas de CCT
        cctEntra.innerHTML = '<option value="" selected disabled>Seleccione Clave CCT</option>';

        fetch(`/obtener-ccts/${municipioId}/${comunidadId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Cargando Claves CCT...");
                data.forEach(cct => {
                    const option = document.createElement("option");
                    option.value = cct.cct_id; // ID para backend
                    option.setAttribute("data-nombre", cct.centro_clave_trabajo); // Clave para enviar en el formulario
                    option.textContent = cct.centro_clave_trabajo; // Mostrar al usuario
                    cctEntra.appendChild(option);
                });
                console.log("Claves CCT cargadas.");
            })
            .catch(error => console.error("Error al cargar claves CCT:", error));
    });

    // **Evento para Mostrar Confirmación al Hacer Clic en "Guardar"**
    btnMostrarConfirmacion.addEventListener("click", function (e) {
        console.log("Botón 'Guardar' clickeado.");
        e.preventDefault(); // Previene cualquier acción predeterminada

        if (!validateForm()) {
            console.log("Validación fallida. No se muestra la confirmación.");
            return;
        }

        // Si la validación pasa, muestra la confirmación
        mostrarConfirmacion();
    });

    // **Función para Mostrar la Sección de Confirmación**
    function mostrarConfirmacion() {
        console.log("Mostrando sección de confirmación...");
        const datos = {
            personal_id: document.getElementById("personal_id").value,
            nombre_docente: document.getElementById("nombre_docente").value,
            fecha: document.getElementById("fecha").value,
            antiguedad: document.getElementById("antiguedad").value,
            telefono: document.getElementById("telefono").value,
            estatus: estatus.value,
            situacion: situacion.value,
            municipio_sale: document.getElementById("municipio_sale").value,
            comunidad_sale: document.getElementById("comunidad_sale").value,
            cct_sale: document.getElementById("cct_sale").value,
            municipio_entra: municipioEntra.options[municipioEntra.selectedIndex].text,
            comunidad_entra: comunidadEntra.options[comunidadEntra.selectedIndex].text,
            cct_entra: cctEntra.options[cctEntra.selectedIndex].text,
            estatus_cubierta: estatusCubierta.value,
            observaciones: observaciones.value
        };

        console.log("Datos para confirmación:", datos);

        let resumenHTML = '<ul class="list-group">';
        for (const [clave, valor] of Object.entries(datos)) {
            resumenHTML += `<li class="list-group-item"><strong>${clave.replace('_', ' ')}:</strong> ${valor}</li>`;
        }
        resumenHTML += '</ul>';

        resumenDatos.innerHTML = resumenHTML;

        formRegistro.style.display = "none";
        seccionConfirmacion.style.display = "block";
        console.log("Sección de confirmación mostrada.");
    }

    // **Evento para Regresar a la Edición**
    btnEditar.addEventListener("click", function () {
        console.log("Botón 'Editar' clickeado.");
        seccionConfirmacion.style.display = "none";
        formRegistro.style.display = "block";
    });

    // **Evento para Confirmar y Enviar los Datos al Servidor**
    btnConfirmar.addEventListener("click", function () {
        console.log("Botón 'Confirmar' clickeado.");
        const datos = {
            tabla: "docentes_disponibles",
            personal_id: document.getElementById("personal_id").value,
            nombre_docente: document.getElementById("nombre_docente").value,
            fecha: document.getElementById("fecha").value,
            antiguedad: document.getElementById("antiguedad").value,
            telefono: document.getElementById("telefono").value,
            estatus: estatus.value,
            situacion: situacion.value,
            municipio_entra: municipioEntra.options[municipioEntra.selectedIndex].text,
            comunidad_entra: comunidadEntra.options[comunidadEntra.selectedIndex].text,
            cct_entra: cctEntra.options[cctEntra.selectedIndex].text,
            estatus_cubierta: estatusCubierta.value,
            observaciones: observaciones.value
        };

        console.log("Datos a enviar al servidor:", datos);

        fetch("/guardarRegistro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("Respuesta del servidor:", data);
                // Suponiendo que estás usando Bootstrap para el modal
                const modalElement = document.getElementById('nuevoRegistroModal');
                if (modalElement) {
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    if (modal) {
                        modal.hide();
                        console.log("Modal cerrado.");
                    }
                }
                form.reset();
                seccionConfirmacion.style.display = "none";
                formRegistro.style.display = "block";
                location.reload();
            })
            .catch(error => console.error("Error al enviar los datos:", error));
    });
});
