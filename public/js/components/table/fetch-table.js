// fetchManager.js

// Función para actualizar una celda específica
export const actualizarCelda = async (cell, tablaNombre, columna, np) => {
    const inputElement = cell.querySelector("input, select");
    if (!inputElement) return;

    const nuevoValor = inputElement.value.trim(); // Obtiene el valor del input o select
    const datos = { tabla: tablaNombre, datos: { [columna]: nuevoValor, np } };

    try {
        const respuesta = await fetch("/editarTabla", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos), // Convierte los datos a JSON
        });

        if (respuesta.ok) {
            cell.querySelector("span").textContent = nuevoValor; // Actualiza el contenido del span
        } else {
            const errorText = await respuesta.text(); // Muestra el error detallado si existe
            console.error("Error al guardar:", errorText);
            // Aquí no mostramos un SweetAlert en caso de error
        }
    } catch (error) {
        console.error("Error de red:", error);
        // Aquí tampoco mostramos un SweetAlert
    } finally {
        inputElement.style.display = "none"; // Oculta el input o select
        cell.querySelector("span").style.display = "block"; // Muestra el span
    }
};

// Función para actualizar toda la tabla (fetch completo al contenedor de la tabla)
export const actualizarTablaCompleta = async () => {
    try {
        const respuesta = await fetch("/lista-pendientes"); // Cambia la ruta si es necesario
        if (!respuesta.ok) throw new Error("Error al obtener la tabla");

        Swal.fire({
            icon: "success",
            title: "¡Tabla actualizada!",
            text: "La tabla se ha actualizado con los datos más recientes",
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            window.location.reload(); // Recarga toda la página
        });
    } catch (error) {
        console.error("Error al actualizar la tabla:", error);
        Swal.fire("Error", "No se pudo actualizar la tabla", "error");
    }
};


// Función de confirmación para guardar cambios
export const confirmarGuardarCambios = () =>
    Swal.fire({
        title: "¿Desea guardar los cambios?",
        text: "Se enviarán los datos actualizados al servidor",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar cambios",
        cancelButtonText: "Cancelar",
    }).then((result) => result.isConfirmed);
