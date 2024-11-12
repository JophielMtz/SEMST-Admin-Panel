//tablas docentes disponibles y solicitudes de cambio post
async function enviarDatos(form) {
    const datos = {
        tabla: form.querySelector('input[name="tabla"]').value,
        personal_id: form.querySelector('#personal_id').value,
        nombre_docente: form.querySelector('#nombre_docente').value,
        fecha: form.querySelector('#fecha').value,
        antiguedad: form.querySelector('#antiguedad').value,
        telefono: form.querySelector('#telefono').value,
        estatus: form.querySelector('#estatus').value,
        situacion: form.querySelector('#situacion').value,
        municipio_entra: form.querySelector('#municipio_entra').options[form.querySelector('#municipio_entra').selectedIndex].text,
        comunidad_entra: form.querySelector('#comunidad_entra').options[form.querySelector('#comunidad_entra').selectedIndex].text,
        cct_entra: form.querySelector('#cct_entra').options[form.querySelector('#cct_entra').selectedIndex].text,
        estatus_cubierta: form.querySelector('#estatus_cubierta').value,
        observaciones: form.querySelector('#observaciones').value
    };
    

    const response = await fetch("/guardarRegistro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
    }

    return response.json();
}

// Exporta la función para ser utilizada en otros módulos
export { enviarDatos };
