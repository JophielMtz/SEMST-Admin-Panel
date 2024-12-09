// main.js

import { validateForm, showError, clearError } from './formValidatioon.js';
import { cargarSectores, cargarZonas, cargarMunicipios, cargarComunidades, cargarCCTs, actualizarSelect, configurarAutocompletado,configurarBloqueCCT,} from './cargaDeDatos.js';
import { enviarDatos } from './dataSender.js';
import { configurarBotonesAccion } from './modules/Configuraciones/Configs.js';
import * as config from '../js/configs/configs.js';



// import { cargarPerfilUsuario } from '../utils/fetchUsuarioPerfil.js';
document.addEventListener("DOMContentLoaded", () => {
    configurarAutocompletado();
    configurarBloqueCCT(); 
    // const zonaSelect = document.querySelector('#nuevoRegistroModal #zona');
    
   
   // Validación y carga de municipios
    const municipioSelect = document.querySelector('#nuevoRegistroModal #municipio_entra');
    if (municipioSelect) {
    cargarMunicipios().then(data => {
        actualizarSelect('municipio_entra', data, 'Seleccione Municipio', 'municipio_id', 'nombre_municipio');
    }).catch(error => console.error("Error al cargar municipios:", error));

    // Evento para cargar comunidades dinámicamente al cambiar el municipio
    municipioSelect.addEventListener("change", function () {
        const comunidadSelect = document.querySelector('#nuevoRegistroModal #comunidad_entra');
        if (comunidadSelect) {
            cargarComunidades(this.value).then(data => {
                actualizarSelect('comunidad_entra', data, 'Seleccione Comunidad', 'comunidad_id', 'nombre_comunidad');
            }).catch(error => console.error("Error al cargar comunidades:", error));
        } else {
            console.warn("El elemento 'comunidad_entra' no existe en el DOM. Se omite la carga de comunidades.");
        }
    });
    }

// Evento para cargar CCTs dinámicamente al cambiar la comunidad
const comunidadSelect = document.querySelector('#nuevoRegistroModal #comunidad_entra');
if (comunidadSelect) {
    comunidadSelect.addEventListener("change", function () {
        const municipioSelect = document.querySelector('#nuevoRegistroModal #municipio_entra');
        const cctSelect = document.querySelector('#nuevoRegistroModal #cct_entra');
        if (!municipioSelect) {
            console.warn("El elemento 'municipio_entra' no existe en el DOM. No se puede cargar CCTs.");
            return;
        }
        if (cctSelect) {
            cargarCCTs(municipioSelect.value, this.value).then(data => {
                actualizarSelect('cct_entra', data, 'Seleccione Clave CCT', 'cct_id', 'centro_clave_trabajo');
            }).catch(error => console.error("Error al cargar CCTs:", error));
        } else {
            console.warn("El elemento 'cct_entra' no existe en el DOM. Se omite la carga de CCTs.");
        }
    });
} else {
    console.warn("El elemento 'comunidad_entra' no existe en el DOM. Se omite el evento para cargar CCTs.");
}

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
            const id = event.target.dataset.id;  
            cargarDatosFormulario(id);  
        });
    });

    

    // Mostrar confirmación de datos
    btnMostrarConfirmacion.addEventListener("click", function (e) {
        e.preventDefault(); // Detenemos el envío por defecto del formulario
        console.log("Botón 'Mostrar Confirmación' clickeado."); // Log para confirmar el clic del botón
    
        // Llamar a validateForm y rastrear el resultado
        const isValid = validateForm();
        console.log(`Resultado de la validación del formulario: ${isValid ? 'Éxito' : 'Fallido'}`);
    
        if (isValid) {
            console.log("Validación exitosa. Llamando a 'mostrarConfirmacion'.");
            mostrarConfirmacion(); // Se llama si la validación pasa
        } else {
            console.log("Validación fallida. Verifica los campos esperados."); // Log si la validación falla
        }
    });
    
    function mostrarConfirmacion() {
        console.log("Ejecutando 'mostrarConfirmacion'...");
        const datos = {};
        const form = document.querySelector('#nuevoRegistroModal');
    
        if (!form) {
            console.error("El formulario no existe en el DOM. Asegúrate de que el ID '#nuevoRegistroModal' sea correcto.");
            return;
        }
    
        console.log("Formulario encontrado. Recolectando datos...");
        // Recorremos todos los inputs, selects y textareas dentro del formulario
        form.querySelectorAll('input, select, textarea').forEach(field => {
            const name = field.id || field.name; // Usar el atributo name o id como clave
    
            // Ignorar campos deshabilitados o campos específicos
            if (!name || field.disabled || ['municipio_entra', 'comunidad_entra', 'cct_entra'].includes(name)) {
                console.log(`Campo ignorado: ID="${name}" (Deshabilitado o no requerido).`);
                return;
            }
    
            const value = field.value || ''; // Obtener el valor del campo (vacío si no tiene valor)
            console.log(`Campo incluido: ID="${name}", Valor="${value}"`); // Log para cada campo válido
            datos[name] = value; // Solo agregamos los campos que pasan el filtro
        });
    
        console.log("Datos recolectados:", datos); // Muestra los datos recolectados del formulario
    
        let resumenHTML = '<ul class="list-group">';
        for (const [key, value] of Object.entries(datos)) {
            resumenHTML += `<li class="list-group-item"><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>`;
        }
        resumenHTML += '</ul>';
    
        console.log("Resumen generado:", resumenHTML); // Muestra el resumen generado antes de insertarlo
    
        const resumenDatos = document.querySelector('#resumenDatos');
        const formRegistro = document.querySelector('#formRegistro');
        const seccionConfirmacion = document.querySelector('#seccionConfirmacion');
    
        if (resumenDatos && formRegistro && seccionConfirmacion) {
            console.log("Elementos encontrados: resumenDatos, formRegistro y seccionConfirmacion.");
            resumenDatos.innerHTML = resumenHTML; // Inserta el resumen en el DOM
            formRegistro.style.display = "none"; // Oculta el formulario original
            seccionConfirmacion.style.display = "block"; // Muestra la sección de confirmación
            console.log("Formulario ocultado. Sección de confirmación mostrada.");
    
            // SweetAlert de éxito con opciones
            Swal.fire({
                title: '¡Datos confirmados!',
                text: 'Los datos se han recolectado correctamente. ¿Qué deseas hacer ahora?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Agregar otro registro',
                cancelButtonText: 'Salir',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Reiniciar los formularios para agregar otro registro
                    formRegistro.reset();
                    // Ocultar confirmación y mostrar formulario
                    seccionConfirmacion.style.display = "none";
                    formRegistro.style.display = "block";
                    console.log("Formulario reiniciado para agregar otro registro.");
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Redirigir o realizar alguna acción si el usuario decide "Salir"
                    window.location.href = '/home'; // Redirige al inicio (ajusta la URL según sea necesario)
                    console.log("Redirigiendo al inicio.");
                }
            });
        } else {
            console.error("Elementos faltantes: asegúrate de que los IDs 'resumenDatos', 'formRegistro' y 'seccionConfirmacion' existen en el DOM.");
        }
    }
    
    
    function mostrarConfirmacion() {
        console.log("Ejecutando 'mostrarConfirmacion'...");
        const datos = {};
        const form = document.querySelector('#nuevoRegistroModal');
    
        if (!form) {
            console.error("El formulario no existe en el DOM. Asegúrate de que el ID '#nuevoRegistroModal' sea correcto.");
            return;
        }
    
        console.log("Formulario encontrado. Recolectando datos...");
        // Recorremos todos los inputs, selects y textareas dentro del formulario
        form.querySelectorAll('input, select, textarea').forEach(field => {
            const name = field.id || field.name; // Usar el atributo name o id como clave
    
            // Ignorar campos deshabilitados o campos específicos
            if (!name || field.disabled || ['municipio_entra', 'comunidad_entra', 'cct_entra'].includes(name)) {
                console.log(`Campo ignorado: ID="${name}" (Deshabilitado o no requerido).`);
                return;
            }
    
            const value = field.value || ''; // Obtener el valor del campo (vacío si no tiene valor)
            console.log(`Campo incluido: ID="${name}", Valor="${value}"`); // Log para cada campo válido
            datos[name] = value; // Solo agregamos los campos que pasan el filtro
        });
    
        console.log("Datos recolectados:", datos); // Muestra los datos recolectados del formulario
    
        let resumenHTML = '<ul class="list-group">';
        for (const [key, value] of Object.entries(datos)) {
            resumenHTML += `<li class="list-group-item"><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>`;
        }
        resumenHTML += '</ul>';
    
        console.log("Resumen generado:", resumenHTML); // Muestra el resumen generado antes de insertarlo
    
        const resumenDatos = document.querySelector('#resumenDatos');
        const formRegistro = document.querySelector('#formRegistro');
        const seccionConfirmacion = document.querySelector('#seccionConfirmacion');
    
        if (resumenDatos && formRegistro && seccionConfirmacion) {
            console.log("Elementos encontrados: resumenDatos, formRegistro y seccionConfirmacion.");
            resumenDatos.innerHTML = resumenHTML; // Inserta el resumen en el DOM
            formRegistro.style.display = "none"; // Oculta el formulario original
            seccionConfirmacion.style.display = "block"; // Muestra la sección de confirmación
            console.log("Formulario ocultado. Sección de confirmación mostrada.");
        } else {
            console.error("Elementos faltantes: asegúrate de que los IDs 'resumenDatos', 'formRegistro' y 'seccionConfirmacion' existen en el DOM.");
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
            console.log("Botón 'Confirmar' clickeado. Preparando para enviar datos...");
    
            // Verifica si el formulario existe antes de enviarlo
            if (!formRegistro) {
                console.error("El formulario 'formRegistro' no existe en el DOM. No se puede enviar.");
                return;
            }
    
            // Log para mostrar los datos recolectados del formulario antes de enviarlos
            console.log("Revisando campos del formulario...");
            formRegistro.querySelectorAll('input, select, textarea').forEach(field => {
                console.log(`Campo: ${field.name || field.id}, Valor: ${field.value}`);
            });
    
            // Llama a la función 'enviarDatos'
            console.log("Llamando a la función 'enviarDatos' con el formulario...");
            await enviarDatos(formRegistro);
            console.log("Datos enviados con éxito. Recargando página...");
            location.reload();
        } catch (error) {
            console.error("No se pudo guardar el registro:", error);
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

// Evento para previsualizar la imagen
document.getElementById('file-upload').addEventListener('change', config.previewImage);

function decodificarTextoGlobal(texto) {
    return texto
        .normalize('NFC')
        .replace(/Ã‘/g, 'Ñ')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã©/g, 'é')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã±/g, 'ñ');
}

function aplicarCorreccionesATodosLosTextos() {
    const elementos = document.querySelectorAll('*:not(script):not(style)');
    elementos.forEach(elemento => {
        if (elemento.childNodes.length) {
            elemento.childNodes.forEach(nodo => {
                if (nodo.nodeType === Node.TEXT_NODE && nodo.nodeValue.trim()) {
                    nodo.nodeValue = decodificarTextoGlobal(nodo.nodeValue);
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', aplicarCorreccionesATodosLosTextos);



