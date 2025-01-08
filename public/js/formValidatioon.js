// **Expresiones Regulares para Validación**
const onlyLettersAndSpacesRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/;
const onlyNumbersRegex = /^\d+$/;

// **Funciones de Validación**
function showError(input, message) {
    const parent = input.parentNode;
    let errorDiv = parent.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        input.classList.add('is-invalid');
        parent.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearError(input) {
    const parent = input.parentNode;
    const errorDiv = parent.querySelector('.invalid-feedback');
    if (errorDiv) errorDiv.remove();
    input.classList.remove('is-invalid');
}

// **Validación Dinámica**
const validationRules = [
    { id: 'nombre_docente', regex: onlyLettersAndSpacesRegex, message: 'Debe de seleccionar un nombre.' },
    { id: 'fecha', required: false, message: 'Debe seleccionar un fecha.' },
    // { id: 'antiguedad', regex: onlyNumbersRegex, message: 'La antigüedad debe ser un número.' },
    // { id: 'telefono', required: false, regex: onlyNumbersRegex, message: 'El teléfono debe contener solo números.' },
    { id: 'tipo_movimiento', required: true, message: 'Debe seleccionar un tipo de movimiento.' },
    { id: 'tipo_organizacion', required: false, message: 'Debe seleccionar un tipo de organización.' },
    { id: 'justifica', required: true, message: 'Debe proporcionar una justificación.' },
    // { id: 'municipio_sale', required: true, message: 'Debe seleccionar al personal para obtener la información.' },
    // { id: 'comunidad_sale', required: true, message: 'Debe seleccionar al personal para obtener la información.' },
    // { id: 'cct_sale', required: true, message: 'Debe seleccionar al personal para obtener la información..' },
    { id: 'inicio_movimiento', required: false, message: 'Debe proporcionar una fecha de inicio del movimiento.' },
    { id: 'termino_movimiento', required: false, message: 'Debe proporcionar una fecha de término del movimiento.' },
    { id: 'diagnostico', required: false, message: 'Debe proporcionar un diagnóstico.' },
    { id: 'aviso', required: false, message: 'Debe proporcionar un aviso.' },
    { id: 'vacante', required: true, message: 'Debe seleccionar si existe una vacante.' },
    { id: 'estatus', required: false, message: 'Seleccione una opción.' },
    { id: 'situacion', required: false, message: 'Seleccione una opción.' },
    // { id: 'municipio_entra', message: 'Debe seleccionar un municipio.' },
    // { id: 'comunidad_entra',  message: 'Debe seleccionar una comunidad.' },
    // { id: 'cct_entra',  message: 'Debe seleccionar un CCT.' },
    // { id: 'estatus_cubierta', required: true, message: 'Debe seleccionar un estatus de cubierta.' },
    { id: 'tramite', required: true, message: 'Debe proporcionar un trámite válido.' },
    { id: 'departamento', required: false, message: 'Debe seleccionar un departamento.' },
    { id: 'observaciones_conflictos', required: true, message: 'Debe agregar observaciones de conflictos.' },
    { id: 'observaciones_secretaria_general', message: 'Debe agregar observaciones para la secretaría general.' }
];
// Verificar si los campos definidos en validationRules existen en el DOM
// console.log("Iniciando validación de IDs en validationRules...");

// validationRules.forEach(({ id }) => {
//     const element = document.querySelector(`#nuevoRegistroModal #${id}`);
//     if (element) {
//         console.log(`✔️ Campo con id '${id}' encontrado en el DOM.`);
//     } else {
//         console.warn(`⚠️ Campo con id '${id}' no encontrado en el DOM.`);
//     }
// });

console.log("Validación de IDs completada.");


function validateForm() {
    let isValid = true;

    // console.log("Iniciando validación del formulario...");
    // console.log("Campos esperados:", validationRules.map(rule => rule.id)); // Lista todos los IDs esperados

    // Iterar sobre las reglas de validación
    validationRules.forEach(({ id, regex, required, message }) => {
        const input = document.querySelector(`#nuevoRegistroModal #${id}`);
        
        if (!input) {
            console.warn(`⚠️ Campo '${id}' no encontrado en el DOM.`);
            return;
        }

        // Mostrar información sobre el campo
        // console.log(`Validando campo '${id}':`);
        // console.log(`- Visible: ${input.offsetParent !== null}`);
        // console.log(`- Valor actual: '${input.value.trim()}'`);

        const value = input.value.trim();

        // Validar si el campo es requerido y está vacío
        if (required && !value) {
            console.error(`❌ Error: El campo '${id}' es obligatorio pero está vacío.`);
            showError(input, message);
            isValid = false;
            return;
        }

        // Validar usando regex si se proporciona
        if (regex && !regex.test(value)) {
            console.error(`❌ Error: El campo '${id}' no cumple con el patrón de validación.`);
            showError(input, message);
            isValid = false;
        } else {
            console.log(`✅ Campo '${id}' válido.`);
            clearError(input);
        }
    });

    console.log(`Resultado final de la validación: ${isValid ? 'Éxito' : 'Fallido'}`);
    return isValid;
}


// Exportamos las funciones para ser utilizadas en otros módulos
export { showError, clearError, validateForm };