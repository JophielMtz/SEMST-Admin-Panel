// Configs.js

export function configurarBotonesAccion() {
    const modalTitle = document.querySelector('#nuevoRegistroModal .modal-title');
    const form = document.querySelector('#nuevoRegistroModal #formRegistro');

    // Delegación de eventos para botones con clase 'accion-btn' o 'borrar-btn'
    document.addEventListener('click', async (event) => {
        const button = event.target.closest('.accion-btn, .borrar-btn'); // Verifica si es un botón válido
        if (!button) return;

        const action = button.dataset.action; // Obtén la acción (nuevo, editar, borrar)
        const registroId = button.dataset.id; // ID del registro (si aplica)
        const endpoint = button.dataset.endpoint; // Endpoint (si aplica)

        if (action === 'nuevo') {
            configurarModalNuevo(modalTitle, form);
        } else if (action === 'editar') {
            configurarModalEditar(modalTitle, form, registroId, endpoint);
        } else if (button.classList.contains('borrar-btn')) {
            try {
                const result = await manejarBorrado(button, registroId, endpoint);
                if (result.success) {
                    // Accede a la instancia de DataTable y elimina la fila
                    const table = $(button).closest('.datatable').DataTable(); // Utiliza el selector correcto
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
}

// Manejar el borrado de registros
const manejarBorrado = async (button, registroId, endpoint) => {
    console.log('registroId:', registroId);
    console.log('endpoint:', endpoint);

    const [baseEndpoint, queryString] = endpoint.split('?');
    console.log('baseEndpoint:', baseEndpoint);
    console.log('queryString:', queryString);

    const url = `${baseEndpoint}/${registroId}${queryString ? `?${queryString}` : ''}`;
    console.log(`Request URL: ${url}`); // Verificacta

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json(); // Debe ser JSON
    return result;
};
