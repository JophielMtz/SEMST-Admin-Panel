




//========= EDITAR PERFIL PERSONAL =========//
const camposConfiguracion = {
    ubicacion: [
        { label: "Cargo", field: "cargo", icon: '<i class="fas fa-user-tie me-2 icon-inline"></i>', type: "select", options: ["Auxiliar Admvo", "Auxiliar Servicio", "Director", "Docente", "Docente/Atp", "Docente/Camb/Act", "Docente de Apoyo", "Subdir, de Gestión", "Velador"] },
        { label: "Tipo Org.", field: "tipo_organizacion", icon: '<i class="fas fa-school me-2 icon-inline"></i>', type: "select", options: [ "Unitaria", "Bidocente", "Tridocente", "Org.Com."] },
        { label: "Sector", field: "sector", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe me-2 icon-inline"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"></path></svg>' },
        { label: "Zona", field: "zona", icon: '<i class="fas fa-map-marker-alt me-2"></i>' },
        { label: "Municipio", field: "municipio", icon: '<i class="fas fa-city me-2 text-info"></i>' },
        { label: "Comunidad", field: "comunidad", icon: '<i class="fas fa-users me-2 text-danger"></i>' },
        { label: "Clave CCT", field: "clave_cct", icon: '<i class="fas fa-key me-2 text-primary"></i>' },
        { label: "CCT Físico", field: "cct_fisico", icon: '<i class="fas fa-key me-2 text-primary"></i>' },
        { label: "CCT Nómina", field: "cct_nomina", icon: '<i class="fas fa-key me-2 text-primary"></i>' },
        { label: "Z.E", field: "z_e", icon: '<i class="fas fa-map-marker-alt me-2 text-primary"></i>', type: "select", options: [ "2", "3", "ZI"] },
        
    ],
    profileData: [
        { label: "Dirección", field: "direccion" },
        { label: "Teléfono", field: "telefono" },
        { label: "Correo", field: "correo" },
        { label: "RFC", field: "rfc" },
        { label: "CURP", field: "curp" },
        { label: "Fecha de Nacimiento", field: "fecha_nacimiento", showIcon: false },   // No mostrar el ícono de edición
        { label: "Edad", field: "edad" }
    ],

    detalleLaboral: [
        { label: "Fecha de Ingreso", field: "fecha_ingreso" },
        { label: "Fecha de Nombramiento", field: "fecha_nombramiento" },
        { label: "Antigüedad", field: "antiguedad_compacta" },
        { label: "Delegación", field: "delegacion" },
        { label: "Nivel de Gobierno", field: "tipo_entidad", type: "select", options: [ "Estatal", "Federal"]},
        { label: "Grado", field: "grado" },
        { label: "Nombramiento", field: "nombramiento" },
        { label: "Tipo de Dirección", field: "tipo_direccion", type: "select",  options: ["D/Tecnico","D/Frente a grupo","D/Comisionado"]}
    ]
    
};

// Función para renderizar los campos de Información General (perfilData + detalleLaboral)
function renderProfileFields(profileData, detalleLaboral) {
    const container = document.getElementById('profileFieldsContainer');
    container.innerHTML = ''; // Limpiar contenedor

    // Unificar los campos de profileData y detalleLaboral
    camposConfiguracion.profileData.concat(camposConfiguracion.detalleLaboral).forEach(({ label, field, type, options }) => {
        const isFecha = label.toLowerCase().includes('fecha');
        let value = profileData[field] ?? detalleLaboral?.[field];
        const displayValue = isFecha ? formatDateDisplay(value) : value || 'N/A';
        const inputValue = isFecha ? formatDateToInput(value) : value || '';
        const inputType = isFecha ? 'date' : 'text'; // Tipo de input para fecha

        let fieldHtml = ''; // Variable para almacenar el HTML a renderizar

        if (type === 'select') {
            // Si las opciones son simples cadenas
            if (typeof options[0] === 'string') {
                const selectOptions = options.map(option => {
                    return `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`;
                }).join('');
                fieldHtml = `
                    <div class="row editable-field" data-field="${field}">
                        <div class="col-sm-3">
                            <h6 class="mb-0">${label}</h6>
                        </div>
                        <div class="col-sm-9 text-secondary d-flex align-items-center">
                            <span class="field-view flex-grow-1">${displayValue}</span>
                            <select class="form-control field-edit d-none flex-grow-1">
                                ${selectOptions}
                            </select>
                            <i class="fas fa-pencil-alt ms-2 text-primary edit-icon d-none" style="cursor: pointer;" onclick="enableSingleFieldEdit(this)"></i>
                        </div>
                    </div>
                    <hr class="mb-2" style="border-top: 1px solid #828282;">
                `;
            } 
            // Si las opciones son objetos { value, label }
            else if (typeof options[0] === 'object') {
                const selectOptions = options.map(option => {
                    return `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>${option.label}</option>`;
                }).join('');
                fieldHtml = `
                    <div class="row editable-field" data-field="${field}">
                        <div class="col-sm-3">
                            <h6 class="mb-0">${label}</h6>
                        </div>
                        <div class="col-sm-9 text-secondary d-flex align-items-center">
                            <span class="field-view flex-grow-1">${displayValue}</span>
                            <select class="form-control field-edit d-none flex-grow-1">
                                ${selectOptions}
                            </select>
                            <i class="fas fa-pencil-alt ms-2 text-primary edit-icon d-none" style="cursor: pointer;" onclick="enableSingleFieldEdit(this)"></i>
                        </div>
                    </div>
                    <hr class="mb-2" style="border-top: 1px solid #828282;">
                `;
            }
        } else {
            // Si el campo no es un select (es un input)
            fieldHtml = `
                <div class="row editable-field" data-field="${field}">
                    <div class="col-sm-3">
                        <h6 class="mb-0">${label}</h6>
                    </div>
                    <div class="col-sm-9 text-secondary d-flex align-items-center">
                        <span class="field-view flex-grow-1">${displayValue}</span>
                        <input type="${inputType}" class="form-control field-edit d-none flex-grow-1" value="${inputValue}" placeholder="Escribe la nueva ${label.toLowerCase()}">
                        <i class="fas fa-pencil-alt ms-2 text-primary edit-icon d-none" style="cursor: pointer;" onclick="enableSingleFieldEdit(this)"></i>
                    </div>
                </div>
                <hr class="mb-2" style="border-top: 1px solid #828282;">
            `;
        }

        // Agregar el HTML generado al contenedor
        container.innerHTML += fieldHtml;
    });
}



// Función para renderizar los campos de Ubicación
function renderUbicacionFields(detalleLaboral) {
    const container = document.getElementById('perfilUbicacion');

    if (!container) {
        console.error("No se encontró el contenedor con id 'perfilUbicacion'");
        return;
    }

    container.innerHTML = '';

    camposConfiguracion.ubicacion.forEach(({ label, field, icon, type = "text", options = [] }) => {
        const value = detalleLaboral?.[field] ?? "No disponible";

        const fieldHtml = `
           <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap editable-field" data-field="${field}">
                <h6 class="mb-0">${icon}${label}</h6>
                <div class="d-flex align-items-center">
                    <span class="text-secondary field-view">${value}</span>
                    ${
                        type === "select"
                            ? `<select class="form-select field-edit d-none" data-modificado="false" onchange="this.setAttribute('data-modificado', 'true')">
                                   ${options.map(option => `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`).join('')}
                               </select>`
                            : `<input type="${type}" class="form-control field-edit d-none" value="${value}" placeholder="Escribe la nueva ${label.toLowerCase()}">`
                    }
                    <i class="fas fa-pencil-alt ms-2 text-primary edit-icon d-none" style="cursor: pointer;" onclick="enableSingleFieldEdit(this)"></i>
                </div>
            </li>
        `;

        container.innerHTML += fieldHtml;
    });
}


document.addEventListener('DOMContentLoaded', () => {
    renderProfileFields(profileData, detalleLaboral); 
    renderUbicacionFields(detalleLaboral); 
});

//========= EDITAR PERFIL PERSONAL =========//




document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('select.field-edit').forEach(select => {
        select.addEventListener('change', () => {
            select.setAttribute('data-modificado', 'true'); // Marcar select como modificado
        });
    });
});

let modoEdicion = false;


function toggleEdicionGlobal() {
    const btn = document.getElementById("btnToggleEdicion");
    const camposEditables = document.querySelectorAll(".editable-field");
    const editImageIcon = document.getElementById("editImageIcon");
    const fileInput = document.getElementById("fileInput");
    let cambios = {};

    if (!modoEdicion) {
        // Habilitar edición
        btn.innerText = "Finalizar Edición";
        camposEditables.forEach(campo => {
            const icon = campo.querySelector(".edit-icon");
            const fieldName = campo.getAttribute("data-field");

            // Verificar si el campo tiene showIcon = false en la configuración
            const campoConfig = camposConfiguracion.ubicacion.concat(camposConfiguracion.profileData, camposConfiguracion.detalleLaboral).find(campo => campo.field === fieldName);
            
            // Solo mostrar el ícono si showIcon es true
            if (campoConfig && campoConfig.showIcon === false) {
                icon.classList.add("d-none"); // Ocultar el icono si showIcon es false
            } else {
                icon.classList.remove("d-none"); // Mostrar el icono si showIcon es true
            }

            const input = campo.querySelector(".field-edit");
            if (input && input.type === "date" && !input.value) {
                // Si el campo de fecha está vacío, mantenerlo sin cambios
                input.setAttribute("data-modificado", "false");
            }
        });
        editImageIcon.classList.remove("d-none");
        modoEdicion = true;
    } else {
        // Finalizar edición
        camposEditables.forEach(campo => {
            const span = campo.querySelector(".field-view");
            const input = campo.querySelector(".field-edit");
            const isSelect = input.tagName.toLowerCase() === 'select';
            let valorActual = span.innerText.trim();
            let nuevoValor = isSelect ? input.options[input.selectedIndex].value : input.value.trim();

            if (input.type === 'date') {
                valorActual = formatDateToInput(valorActual);
            }

            // Verificar si el campo tiene showIcon = false en la configuración
            const fieldName = campo.getAttribute("data-field");
            const campoConfig = camposConfiguracion.ubicacion.concat(camposConfiguracion.profileData, camposConfiguracion.detalleLaboral).find(campo => campo.field === fieldName);
            
            // Solo mostrar el ícono si showIcon es true
            const icon = campo.querySelector(".edit-icon");
            if (campoConfig && campoConfig.showIcon === false) {
                icon.classList.add("d-none"); // Ocultar el icono si showIcon es false
            } else {
                icon.classList.remove("d-none"); // Mostrar el icono si showIcon es true
            }

            // Solo guardar cambios si son diferentes a los valores actuales
            if (!(isSelect && input.getAttribute('data-modificado') !== 'true') && nuevoValor !== valorActual) {
                cambios[campo.getAttribute("data-field")] = nuevoValor;

                // Si es fecha, asegurarse de no cambiarla si no fue modificada
                if (input.type === 'date' && input.getAttribute("data-modificado") !== 'true') {
                    // No incluir la fecha si no ha sido modificada
                    delete cambios[campo.getAttribute("data-field")];
                }

                span.innerText = nuevoValor || 'No disponible';
            }

            span.classList.remove("d-none");
            input.classList.add("d-none");
        });

        // Solo hacer el fetch si hubo cambios
        if (Object.keys(cambios).length > 0) {
            enviarCambiosAlServidor(cambios);
        }

        if (fileInput.files.length > 0) {
            // Actualizar imagen si fue cambiada
            actualizarImagen(fileInput.files[0]);
        }

        camposEditables.forEach(campo => {
            const icon = campo.querySelector(".edit-icon");
            icon.classList.add("d-none");
        });
        editImageIcon.classList.add("d-none");
        btn.innerText = "Editar";
        modoEdicion = false;
    }
}


async function actualizarImagen(file) {
    const formData = new FormData();
    const id = profileData?.personal_id || detalleLaboral?.personal_id; // ID del usuario
    formData.append("imagen", file); // Agregar la imagen al FormData

    try {
        const response = await fetch(`/editar-personal/${id}`, {
            method: "PATCH",
            body: formData // Solo se envía la imagen
        });

        if (response.ok) {
            // Mostrar SweetAlert con mensaje genérico y que se cierre automáticamente
            Swal.fire({
                title: 'Éxito',
                text: 'Cambios guardados',
                icon: 'success',
                showConfirmButton: false, // Quita el botón de confirmación
                timer: 1500, // El mensaje se cierra automáticamente después de 1.5 segundos
                timerProgressBar: true // Muestra la barra de progreso del tiempo
            });
        } else {
            console.error(`Error al actualizar la imagen: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error al intentar actualizar la imagen:", error);
    }
}



async function hacerPatch(url, data, id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Mostrar SweetAlert con mensaje genérico y que se cierre automáticamente
            Swal.fire({
                title: 'Éxito',
                text: 'Cambios guardados',
                icon: 'success',
                showConfirmButton: false, // Quita el botón de confirmación
                timer: 1500, // El mensaje se cierra automáticamente después de 1.5 segundos
                timerProgressBar: true // Muestra la barra de progreso del tiempo
            });
        } else {
            console.error(`Error al actualizar en ${url}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Error de conexión al intentar actualizar en ${url}:`, error);
    }
}


// Función para enviar los cambios clasificados al servidor
function enviarCambiosAlServidor(cambios) {
    const personalFields = camposConfiguracion.profileData.map(field => field.field);
    const detalleLaboralFields = camposConfiguracion.detalleLaboral.map(field => field.field);
    const ubicacionFields = camposConfiguracion.ubicacion.map(field => field.field);

    const dataPorTabla = {
        personal: {},
        detalle_laboral: {},
        ubic_ccts: {}
    };

    // Clasificar los cambios según la tabla correspondiente
    Object.entries(cambios).forEach(([campo, valor]) => {
        if (valor === '' || valor === null || valor === undefined) {
            return; // Ignorar los campos vacíos o no modificados
        }
        if (personalFields.includes(campo)) {
            dataPorTabla.personal[campo] = valor;
        } else if (detalleLaboralFields.includes(campo)) {
            dataPorTabla.detalle_laboral[campo] = valor;
        } else if (ubicacionFields.includes(campo)) {
            dataPorTabla.ubic_ccts[campo] = valor;
        }
    });

    console.log("Datos clasificados por tabla (solo campos modificados):", dataPorTabla);

    const id = profileData?.personal_id || detalleLaboral?.personal_id;

    if (!id) {
        console.error("No se pudo obtener el ID del personal para enviar los datos");
        return;
    }

    // Realizar las solicitudes PATCH solo si hay datos en cada tabla
    if (Object.keys(dataPorTabla.personal).length > 0) {
        hacerPatch("/editar-personal", dataPorTabla.personal, id);
    }
    if (Object.keys(dataPorTabla.detalle_laboral).length > 0) {
        hacerPatch("/editar-personal", dataPorTabla.detalle_laboral, id);
    }
    if (Object.keys(dataPorTabla.ubic_ccts).length > 0) {
        hacerPatch("/editar-personal", dataPorTabla.ubic_ccts, id);
    }
}








// Permite editar solo un campo al hacer clic en el ícono
function enableSingleFieldEdit(iconElement) {
    const campoEditable = iconElement.closest(".editable-field");
    const span = campoEditable.querySelector(".field-view");
    const input = campoEditable.querySelector(".field-edit");

    span.classList.add("d-none");
    input.classList.remove("d-none");
    input.focus(); // Pone el cursor automáticamente en el input
    iconElement.classList.add("d-none"); // Oculta el ícono cuando se edita
}


//=========Función para enviar los cambios al servidor=========//


//=====Formateo de fechas=====//
function formatDateDisplay(date) {
    if (!date) return 'N/A'; 
    const d = new Date(date);
    const options = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Mexico_City' };
    let formattedDate = d.toLocaleDateString('es-MX', options).replace('.', ''); // Formato "d MMM y"
    
    // Corregir para que la primera letra del mes sea mayúscula
    formattedDate = formattedDate.replace(/^([a-záéíóú])/i, (match) => match.toUpperCase());
    return formattedDate;
}

function formatDateToInput(date) {
    if (!date) return ''; 
    const d = new Date(date); 
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; 
}

function previewImage(event) {
    const profileImage = document.getElementById("profileImage");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImage.src = e.target.result; // Vista previa de la nueva imagen
        };
        reader.readAsDataURL(file);
    }
}