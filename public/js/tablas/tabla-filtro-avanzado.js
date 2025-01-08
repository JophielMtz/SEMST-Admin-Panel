$(document).ready(function() {
    fetch("/getlistaPanelAdm", {
        method: "GET",
    })
    .then(response => {
        if (response.ok) {
            return response.json();  
        } else {
            throw new Error("Error en la solicitud: " + response.status);
        }
    })
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {

            if ($.fn.dataTable.isDataTable('#datatable')) {
                $('#datatable').DataTable().clear().destroy();
            }

            var table = $('#datatable').DataTable({
                "data": data,
                "columns": [
                    { "data": "imagen", "render": function(data, type, row) {
                        var imgSrc = data ? "/uploads/" + data : "/images/avatars/avatar-default.png";
                        return `
                            <div class="d-flex align-items-center">
                                <img src="${imgSrc}" alt="Foto del docente" class="rounded-circle me-3" style="width: 40px; height: 40px;">
                                <div><span style="font-size: 14px;">${row.nombre}</span></div>
                            </div>
                        `;
                    }, "title": "Nombre" },
                    { 
                        "data": "fecha_nacimiento", 
                        "title": "Fecha de nacimiento",
                        "render": function(data, type, row) {
                            if (data) {
                                var fecha = new Date(data); 
                                var dia = ("0" + fecha.getDate()).slice(-2);
                                var mes = ("0" + (fecha.getMonth() + 1)).slice(-2); // Los meses comienzan en 0
                                var anio = fecha.getFullYear();
                                return dia + '/' + mes + '/' + anio; // Formato DD/MM/YYYY
                            }
                            return ''; // Si no hay fecha, devuelve vacío
                        }
                    },
                    { "data": "edad", "title": "Edad" },
                    { "data": "rfc", "title": "RFC" },
                    { "data": "curp", "title": "Curp" },
                    { "data": "telefono", "title": "Teléfono" },
                    { "data": "correo", "title": "Correo" },
                    { "data": "nombre_cct", "title": "CCT" },
                    { "data": "cargo", "title": "Cargo" },
                    { "data": "antiguedad_compacta", "title": "Antigüedad Compacta" },
                    { "data": "tipo_organizacion", "title": "Tipo de Organización" },
                    { "data": "zona", "title": "Zona Escolar" },
                    { "data": "tipo_entidad", "title": "Tipo de Entidad" },
                    { "data": "tipo_direccion", "title": "Tipo de Dirección" },
                    { 
                        "data": "nombramiento", 
                        "title": "Nombramiento",
                        "createdCell": function(td, cellData, rowData, row, col) {
                          
                            $(td).css({
                                "white-space": "normal",  
                                "word-wrap": "break-word",  
                                "word-break": "break-word" 
                            });
                        }
                    },
                    { "data": "grado", "title": "Grado" },
                    { "data": "sector", "title": "Sector" },
                    { "data": "municipio", "title": "Municipio" },
                    { "data": "comunidad", "title": "Comunidad" },
                    { "data": "z_e", "title": "ZE" },
                    { "data": "sector", "title": "Sector" },

                ],
                "dom": '<"top"i>rt<"bottom"lp><"clear">',  // Define la estructura de la tabla
                "language": {
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros ",  // Texto para mostrar los registros
                },
                "initComplete": function () {
                    // Centra el mensaje de registros
                    $('.dataTables_info').css({
                        'text-align': 'center',  // Centra el texto
                        'width': '100%',         // Asegura que ocupe todo el ancho
                        'margin': '0 auto'       // Centra el contenedor
                    });
                },
                "pageLength": 20,  // Cantidad de registros por página
                "responsive": true, // Permite que la tabla sea responsive
                "columnDefs": [
                    {
                        "targets": "_all",  // Aseguramos que todas las columnas estén visibles por defecto
                        "visible": true
                    }
                ]
            });
// Función genérica para filtrar por cualquier columna
// Función genérica para filtrar por cualquier columna
function filterColumn(selectId, columnDataName, checkboxId) {
    $(selectId).on('change', function () {
        var value = $(this).val().trim();  // Obtiene el valor seleccionado

        // Encuentra el índice de la columna basada en el 'data' de la columna
        var columnIndex = getColumnIndexByData(columnDataName);

        // Filtra la columna correspondiente
        table.column(columnIndex).search(value).draw();

        // Activa o desactiva el checkbox
        if (value) {
            $(checkboxId).prop('checked', true);  // Activa el checkbox
            // Asegurarse de que la columna se muestre
            table.column(columnIndex).visible(true);
        } else {
            $(checkboxId).prop('checked', false);  // Desactiva el checkbox si no se selecciona nada
            // Oculta la columna
            table.column(columnIndex).visible(false);
        }
    });
}

// Función para obtener el índice de la columna basada en el 'data'
function getColumnIndexByData(columnDataName) {
    const columns = table.settings().init().columns;
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].data === columnDataName) {
            return i;
        }
    }
    return -1;  // Si no se encuentra la columna, devuelve -1
}

// Llamadas a la función para cada columna utilizando el 'data' de la columna
filterColumn('#cargo', 'cargo', '#cargoCheckbox'); 
filterColumn('#tipo_organizacion', 'tipo_organizacion', '#tipoOrganizacionCheckbox'); 
filterColumn('#z_e', 'z_e', '#z_eCheckbox');  
filterColumn('#tipo_entidad', 'tipo_entidad', '#tipo_entidadCheckbox');  
filterColumn('#tipo_direccion', 'tipo_direccion', '#tipo_direccionCheckbox'); 
filterColumn('#zona', 'zona', '#zonaCheckbox');
filterColumn('#sector', 'sector', '#sectorCheckbox');


              // Limpiar los filtros y restaurar la visibilidad de las columnas con el botón
              $('#applyFiltersBtn').on('click', function() {
                // Limpiar el campo de búsqueda
                table.search('').draw();
                
                // Restaurar visibilidad de todas las columnas, excepto la columna "Nombre"
                table.columns().visible(false);  // Ocultar todas las columnas
                table.column(0).visible(true);   // Dejar visible solo la columna "Nombre"

                $('.form-check-input').prop('checked', false); 
                $('#nombre').prop('checked', true);
            });

            

            $('#datatable_filter').hide();

            // Controlar visibilidad de las columnas con checkboxes
            $('.form-check-input').on('change', function() {
                const columnClass = $(this).val();  // Valor del checkbox (por ejemplo 'nombre')
                const columnIndex = getColumnIndex(columnClass, table);  // Obtén el índice de la columna

                const column = table.column(columnIndex);
                column.visible(this.checked);  // Alternar visibilidad basado en si el checkbox está marcado
            });

            // Búsqueda personalizada
            $('#searchInput').on('keyup', function() {
                table.search(this.value).draw();
            });

        }
    })
    .catch(error => {
        console.log("Detalles del error:", error);
    });
   
});

// Función para alternar la visibilidad de las columnas
function toggleColumn(columnClass) {
    const columnIndex = getColumnIndex(columnClass, table);  // Obtén el índice de la columna
    const column = table.column(columnIndex);
    column.visible(!column.visible());  // Alterna la visibilidad de la columna
}

// Función que mapea el valor del checkbox al índice de la columna
function getColumnIndex(columnClass, table) {
    const columns = table.settings().init().columns;
    for (let i = 0; i < columns.length; i++) {
        if (columns[i].data === columnClass) {
            return i;
        }
    }
    return -1;  // Si no se encuentra la columna, devuelve -1
}

