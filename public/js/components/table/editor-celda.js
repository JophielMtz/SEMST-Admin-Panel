export let isEditModeEnabled = false;

// Función para habilitar/deshabilitar el modo edición
export const toggleEditMode = async (confirmarGuardarCambios) => {
    const toggleEditModeButton = document.getElementById("toggleEditModeButton");

    // Solo pedimos confirmación cuando estamos desactivando el modo edición
    if (isEditModeEnabled) {
        // Pedir confirmación solo cuando desactivamos el modo de edición
        const isConfirmed = await confirmarGuardarCambios();
        if (!isConfirmed) {
            return; // Si el usuario cancela, no desactivamos el modo de edición
        }
        // Si el usuario confirma, desactivamos el modo de edición
        isEditModeEnabled = false;
        toggleEditModeButton.textContent = "Activar Modo Edición";

        // Deshabilitamos las celdas editables
        document.querySelectorAll("[data-editable]").forEach((cell) => {
            cell.style.pointerEvents = "none";
            cell.classList.remove("editable-highlight");
        });
    } else {
        // Si el modo de edición no está activado, lo activamos
        isEditModeEnabled = true;
        toggleEditModeButton.textContent = "Desactivar Modo Edición";

        // Habilitamos las celdas editables
        document.querySelectorAll("[data-editable]").forEach((cell) => {
            cell.style.pointerEvents = "auto";
            cell.classList.add("editable-highlight");
        });
    }
};

// Función para crear un input o un select según la columna
export const crearInput = (value, columna) => {
    if (columna === "estatus") {
        return crearSelect(["En proceso", "Terminado", "No se atiende", "Pendiente"], value);
    }
    const input = document.createElement("input");
    input.className = "form-control form-control-sm";
    input.value = value;
    return input;
};

// Función para crear un select con opciones
export const crearSelect = (options, selectedValue) => {
    const select = document.createElement("select");
    select.className = "form-select form-select-sm";
    options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        if (option === selectedValue) opt.selected = true;
        select.appendChild(opt);
    });
    return select;
};

// Función para manejar la edición de una celda
export const editarCelda = (cell, tablaNombre, columna, np) => {
    const originalValue = cell.textContent.trim();
    const input = crearInput(originalValue, columna); // Crear input o select
    const span = cell.querySelector("span");

    // Mostrar el input y ocultar el span
    span.style.display = "none";
    cell.appendChild(input);
    input.style.display = "block";
    input.focus();

    // Al cambiar el valor de la celda, guardarlo
    input.addEventListener("blur", () => {
        const nuevoValor = input.value.trim();
        if (nuevoValor !== originalValue) {
            // Si el valor cambió, guardarlo
            actualizarCelda(cell, tablaNombre, columna, np, nuevoValor);
        } else {
            // Si no cambió, volver a mostrar el span
            span.style.display = "block";
            input.style.display = "none";
        }
    });
};

// Función para actualizar la celda en el servidor
export const actualizarCelda = async (cell, tablaNombre, columna, np, nuevoValor) => {
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
            console.error("Error al guardar:", await respuesta.text());
        }
    } catch (error) {
        console.error("Error de red:", error);
    } finally {
        // Vuelve a mostrar el span
        cell.querySelector("span").style.display = "block";
        cell.querySelector("input, select").style.display = "none";
    }
};
