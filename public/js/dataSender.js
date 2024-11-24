async function enviarDatos(form) {
    if (!form) {
        console.error("El formulario proporcionado es nulo o indefinido.");
        throw new Error("Formulario inválido.");
    }

    console.log("Recolectando datos dinámicos del formulario...");

    // Recolecta dinámicamente los datos del formulario
    const datos = {};
    form.querySelectorAll('input, select, textarea').forEach(field => {
        const name = field.name || field.id; // Usa el atributo 'name' o 'id' como clave
        if (!name) return; // Si no tiene 'name' o 'id', ignóralo

        if (field.tagName === "SELECT") {
            // Para selects, obtiene el texto del valor seleccionado
            datos[name] = field.options[field.selectedIndex]?.text || "";
        } else {
            // Para inputs y textareas, obtiene el valor directamente
            datos[name] = field.value.trim();
        }
    });

    console.log("Datos recolectados del formulario:", datos);

    // Realiza la solicitud al servidor
    const response = await fetch("/guardarRegistro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
    }

    console.log("Datos enviados con éxito al servidor.");
    return response.json();
}

// Exporta la función para ser utilizada en otros módulos
export { enviarDatos };
