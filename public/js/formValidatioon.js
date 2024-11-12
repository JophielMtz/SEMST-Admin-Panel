// formValidation.js

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

function validateForm() {
    let isValid = true;

    // Elementos del formulario a validar
    const nombreDocente = document.querySelector('#nuevoRegistroModal #nombre_docente');
    const antiguedad = document.querySelector('#nuevoRegistroModal #antiguedad');
    const telefono = document.querySelector('#nuevoRegistroModal #telefono');
    const fecha = document.querySelector('#nuevoRegistroModal #fecha');
    const estatus = document.querySelector('#nuevoRegistroModal #estatus');
    const situacion = document.querySelector('#nuevoRegistroModal #situacion');
    const municipioEntra = document.querySelector('#nuevoRegistroModal #municipio_entra');
    const comunidadEntra = document.querySelector('#nuevoRegistroModal #comunidad_entra');
    const cctEntra = document.querySelector('#nuevoRegistroModal #cct_entra');
    const estatusCubierta = document.querySelector('#nuevoRegistroModal #estatus_cubierta');

    if (!onlyLettersAndSpacesRegex.test(nombreDocente.value.trim())) {
        showError(nombreDocente, 'El nombre solo debe contener letras y espacios.');
        isValid = false;
    } else {
        clearError(nombreDocente);
    }

    // if (!onlyNumbersRegex.test(antiguedad.value.trim())) {
    //     showError(antiguedad, 'La antigüedad debe ser un número.');
    //     isValid = false;
    // } else {
    //     clearError(antiguedad);
    // }

    if (!onlyNumbersRegex.test(telefono.value.trim())) {
        showError(telefono, 'El teléfono debe contener solo números.');
        isValid = false;
    } else {
        clearError(telefono);
    }

    if (!fecha.value) {
        showError(fecha, 'Debe seleccionar una fecha.');
        isValid = false;
    } else {
        clearError(fecha);
    }

    const selectsToValidate = [estatus, situacion, municipioEntra, comunidadEntra, cctEntra, estatusCubierta];
    selectsToValidate.forEach(select => {
        if (!select.value) {
            showError(select, `Debe seleccionar una opción en ${select.id}.`);
            isValid = false;
        } else {
            clearError(select);
        }
    });

    return isValid;
}

// Exportamos las funciones para ser utilizadas en otros módulos
export { showError, clearError, validateForm };
