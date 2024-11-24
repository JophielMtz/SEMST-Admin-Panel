// main.js

import { validateForm, showError, clearError } from './formValidatioon.js';
import { cargarSectores, cargarZonas, cargarMunicipios, cargarComunidades, cargarCCTs, actualizarSelect, configurarAutocompletado,configurarBloqueCCT } from './cargaDeDatos.js';
import { enviarDatos } from './dataSender.js';
import { configurarBotonesAccion } from './modules/Configuraciones/Configs.js';

document.addEventListener("DOMContentLoaded", () => {
    configurarAutocompletado();
    configurarBloqueCCT(); // Llama a la función para habilitar autocompletado
    // const sectorSelect = document.querySelector('#nuevoRegistroModal #sector');
    // const zonaSelect = document.querySelector('#nuevoRegistroModal #zona');
    
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

    

    // Mostrar confirmación de datos
    btnMostrarConfirmacion.addEventListener("click", function (e) {
        e.preventDefault(); // Detenemos el envío por defecto del formulario
        console.log("Botón 'Mostrar Confirmación' clickeado."); // Log para confirmar el clic del botón
    
        if (validateForm()) {
            console.log("Validación exitosa. Llamando a 'mostrarConfirmacion'.");
            mostrarConfirmacion(); // Se llama si la validación pasa
        } else {
            console.log("Validación fallida. No se mostrará la confirmación."); // Log si la validación falla
        }
    });
    

    function mostrarConfirmacion() {
        const datos = {};
        const form = document.querySelector('#nuevoRegistroModal');
    
        if (!form) {
            console.error("El formulario no existe en el DOM.");
            return;
        }
    
        // Recorremos todos los inputs, selects y textareas dentro del formulario
        form.querySelectorAll('input, select, textarea').forEach(field => {
            const name = field.id || field.name; // Usar el ID o el atributo name como clave
            const value = field.value || ''; // Obtener el valor del campo (vacío si no tiene valor)
    
            if (name) {
                datos[name] = value; // Solo agregamos al objeto si el campo tiene un ID o name definido
            }
        });
    
        let resumenHTML = '<ul class="list-group">';
        for (const [key, value] of Object.entries(datos)) {
            resumenHTML += `<li class="list-group-item"><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>`;
        }
        resumenHTML += '</ul>';
    
        const resumenDatos = document.querySelector('#resumenDatos');
        const formRegistro = document.querySelector('#formRegistro');
        const seccionConfirmacion = document.querySelector('#seccionConfirmacion');
    
        if (resumenDatos && formRegistro && seccionConfirmacion) {
            resumenDatos.innerHTML = resumenHTML;
            formRegistro.style.display = "none";
            seccionConfirmacion.style.display = "block";
        } else {
            console.error("Elementos resumenDatos, formRegistro o seccionConfirmacion no existen en el DOM.");
        }
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


