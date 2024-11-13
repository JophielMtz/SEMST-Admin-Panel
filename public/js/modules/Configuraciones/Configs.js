export function configurarBotonesAccion() {
    const modalTitle = document.querySelector('#nuevoRegistroModal .modal-title');
    const form = document.querySelector('#nuevoRegistroModal #formRegistro');

    // Selecciona todos los botones con la clase 'accion-btn'
    document.querySelectorAll('.accion-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const action = event.currentTarget.dataset.action; // Obtén la acción (nuevo o editar)

            if (action === 'nuevo') {
                configurarModalNuevo(modalTitle, form);
            } else if (action === 'editar') {
                configurarModalEditar(modalTitle, form);
            }
        });
    });
}

// Configura el modal para la acción "Nuevo"
function configurarModalNuevo(modalTitle, form) {
    modalTitle.textContent = 'Nueva entradaa'; // Cambia el título del modal
    form.reset(); // Limpia el formulario
    form.querySelector('[name="action"]').value = 'nuevo'; // Define la acción en un campo oculto
}


// Configura el modal para la acción "Editar"
function configurarModalEditar(modalTitle, form) {
    modalTitle.textContent = 'Editar entrada'; // Cambia el título del modal
    form.querySelector('[name="action"]').value = 'editar'; // Define la acción en un campo oculto

    // Obtener el ID del registro que se va a editar
    const id = form.dataset.id; // Asegúrate de que el ID esté almacenado en un atributo del formulario o en otro lugar
    const isNuevo = form.querySelector('[name="action"]').value === 'nuevo'; // Verifica si es "nuevo"

    if (id || isNuevo) {
        // Definir la URL según sea "nuevo" o "editar"
        const url = isNuevo
            ? `/buscar-nuevo-docente/${id}` // Ruta para cargar datos de la tabla "nuevo-docente"
            : `/editar-personal-nuevo/${id}`; // Ruta para cargar datos de la tabla "docentes_disponibles"

        // Realizar solicitud AJAX para obtener los datos del registro
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest', // Indica que es una solicitud AJAX
            },
            success: function (data) {
                // Cargar los datos recibidos en el formulario
                llenarFormulario(form, data.docente);
            },
            error: function (error) {
                console.error('Error al cargar los datos del registro:', error);
                alert('No se pudo cargar la información del registro.');
            },
        });
    }
}


// Función para llenar el formulario con los datos del registro
function llenarFormulario(form, datos) {
    Object.keys(datos).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = datos[key]; // Asigna el valor al campo correspondiente
        }
    });
}