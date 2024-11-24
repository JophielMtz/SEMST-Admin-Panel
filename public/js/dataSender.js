//tablas docentes disponibles y solicitudes de cambio post
async function enviarDatos(form) {
    if (!form) {
        throw new Error("El formulario no existe o no se proporcionó.");
    }

    const datos = {};
    form.querySelectorAll("input, select, textarea").forEach((field) => {
        const name = field.id || field.name;
        const value = field.value || '';
        if (name) {
            datos[name] = value;
        }
    });

    try {
        const response = await fetch("/guardarRegistro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        console.log("Registro guardado exitosamente");
    } catch (error) {
        console.error("Error al guardar los datos:", error);
        throw error;
    }
}

// Exporta la función para ser utilizada en otros módulos
export { enviarDatos };
