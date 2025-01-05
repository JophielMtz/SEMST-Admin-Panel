import { isEditModeEnabled, toggleEditMode, crearInput } from "./editor-celda.js";
import { actualizarCelda, confirmarGuardarCambios, actualizarTablaCompleta } from "./fetch-table.js";

document.addEventListener("DOMContentLoaded", () => {
    const toggleEditModeButton = document.getElementById("toggleEditModeButton");

    // Inicializa las celdas editables
    document.querySelectorAll("[data-editable-table]").forEach((table) => {
        const tablaNombre = table.dataset.tabla;

        table.querySelectorAll("td[data-editable]").forEach((cell) => {
            const originalValue = cell.textContent.trim();
            const columna = cell.dataset.columna;
            const np = cell.closest("tr").dataset.np;

            let span = cell.querySelector("span") || (cell.innerHTML = "<span>" + originalValue + "</span>");
            const input = crearInput(originalValue, columna);
            input.style.display = "none";
            cell.appendChild(input);

            // Editar celda al hacer clic
            cell.addEventListener("click", () => {
                if (!isEditModeEnabled) return;
                span.style.display = "none";
                input.style.display = "block";
                input.focus();
            });

            // Guardar el cambio al hacer un cambio
            input.addEventListener("change", () => actualizarCelda(cell, tablaNombre, columna, np));
        });
    });

    // Manejo del botón de modo edición
    toggleEditModeButton.addEventListener("click", async () => {
        if (isEditModeEnabled) {
            // Si estamos desactivando el modo de edición, preguntar si guardar cambios
            const isConfirmed = await confirmarGuardarCambios();
            if (isConfirmed) {
                // Si confirma, actualizamos la tabla
                actualizarTablaCompleta(".table-responsive");
            }
        }

        // Cambiar el estado del modo de edición
        toggleEditMode();
    });
});
