// main.js

import { validateForm, showError, clearError } from './formValidatioon.js';
import { cargarMunicipios, cargarComunidades, cargarCCTs, actualizarSelect, configurarAutocompletado, } from './cargaDeDatos.js';
import { enviarDatos } from './dataSender.js';
import { configurarBotonesAccion } from './modules/Configuraciones/Configs.js';

document.addEventListener("DOMContentLoaded", () => {
    const municipioSelect = document.querySelector('#nuevoRegistroModal #municipio_entra');
    const comunidadSelect = document.querySelector('#nuevoRegistroModal #comunidad_entra');
    const cctSelect = document.querySelector('#nuevoRegistroModal #cct_entra');
    const btnMostrarConfirmacion = document.querySelector('#nuevoRegistroModal #btnMostrarConfirmacion');
    const btnConfirmar = document.querySelector('#nuevoRegistroModal #btnConfirmar');
    const btnEditar = document.querySelector('#nuevoRegistroModal #btnEditar');
    const formRegistro = document.querySelector('#nuevoRegistroModal #formRegistro');
    const seccionConfirmacion = document.querySelector('#nuevoRegistroModal #seccionConfirmacion');
    const resumenDatos = document.querySelector('#nuevoRegistroModal #resumenDatos');

    // Carga inicial de municipios
    cargarMunicipios().then(data => {
        actualizarSelect('municipio_entra', data, 'Seleccione Municipio', 'municipio_id', 'nombre_municipio');
    });

    // Eventos para cargar comunidades y CCTs dinámicamente
    municipioSelect.addEventListener("change", function () {
        cargarComunidades(this.value).then(data => {
            actualizarSelect('comunidad_entra', data, 'Seleccione Comunidad', 'comunidad_id', 'nombre_comunidad');
        });
    });

    comunidadSelect.addEventListener("change", function () {
        cargarCCTs(municipioSelect.value, this.value).then(data => {
            actualizarSelect('cct_entra', data, 'Seleccione Clave CCT', 'cct_id', 'centro_clave_trabajo');
        });
    });


    document.querySelectorAll('.editar-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.dataset.id;  // Obtener el ID del item desde el atributo data-id
            cargarDatosFormulario(id);  // Llamar a la función para cargar los datos del formulario
        });
    });

    // **Configurar autocompletado para el nombre del docente**
    configurarAutocompletado(); // Llama a la función para habilitar autocompletado

    // Mostrar confirmación de datos
    btnMostrarConfirmacion.addEventListener("click", function (e) {
        e.preventDefault();
        if (validateForm()) {
            mostrarConfirmacion();
        }
    });

    function mostrarConfirmacion() {
        const datos = {
            personal_id: document.querySelector('#nuevoRegistroModal #personal_id').value,
            nombre_docente: document.querySelector('#nuevoRegistroModal #nombre_docente').value,
            fecha: document.querySelector('#nuevoRegistroModal #fecha').value,
            antiguedad: document.querySelector('#nuevoRegistroModal #antiguedad').value,
            telefono: document.querySelector('#nuevoRegistroModal #telefono').value,
            estatus: document.querySelector('#nuevoRegistroModal #estatus').value,
            situacion: document.querySelector('#nuevoRegistroModal #situacion').value,
            municipio_sale: document.querySelector('#nuevoRegistroModal #municipio_sale').value,
            comunidad_sale: document.querySelector('#nuevoRegistroModal #comunidad_sale').value,
            cct_sale: document.querySelector('#nuevoRegistroModal #cct_sale').value,
            municipio_entra: municipioSelect.options[municipioSelect.selectedIndex].text,
            comunidad_entra: comunidadSelect.options[comunidadSelect.selectedIndex].text,
            cct_entra: cctSelect.options[cctSelect.selectedIndex].text,
            estatus_cubierta: document.querySelector('#nuevoRegistroModal #estatus_cubierta').value,
            observaciones: document.querySelector('#nuevoRegistroModal #observaciones').value
        };

        let resumenHTML = '<ul class="list-group">';
        for (const [key, value] of Object.entries(datos)) {
            resumenHTML += `<li class="list-group-item"><strong>${key.replace('_', ' ')}:</strong> ${value}</li>`;
        }
        resumenHTML += '</ul>';
        resumenDatos.innerHTML = resumenHTML;

        formRegistro.style.display = "none";
        seccionConfirmacion.style.display = "block";
    }

    // Regresar a la edición del formulario
    btnEditar.addEventListener("click", () => {
        seccionConfirmacion.style.display = "none";
        formRegistro.style.display = "block";
    });

    // Confirmar y enviar datos al servidor
    btnConfirmar.addEventListener("click", async () => {
        try {
            await enviarDatos(formRegistro); // Llama a la función modular
            location.reload(); // Recarga la página después de guardar
        } catch (error) {
            console.error("No se pudo guardar el registro:", error); // Manejo de errores
        }
    });
});


// Configurar botones de acción, incluyendo borrado
configurarBotonesAccion();

// Evento delegado para manejo de botones borrar
document.addEventListener("click", async (event) => {
    const button = event.target.closest('.borrar-btn');
    if (!button) return;

    const id = button.dataset.id; // ID del registro a borrar
    const endpoint = button.dataset.endpoint; // Endpoint para la tabla específica

    if (confirm('¿Estás seguro de que deseas borrar este registro?')) {
        try {
            const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (result.success) {
                // Elimina la fila de la tabla si DataTable está inicializado
                const table = $(button.closest('.datatable')).DataTable();
                const row = $(button).closest('tr');
                table.row(row).remove().draw();

                alert('Registro eliminado correctamente');
            } else {
                alert(`Error al borrar: ${result.message}`);
            }
        } catch (error) {
            console.error("Error al borrar el registro:", error);
            alert("Ocurrió un error al intentar borrar el registro.");
        }
    }
});


