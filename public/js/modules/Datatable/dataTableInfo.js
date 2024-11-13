export const dataTableInfo = {
  // Tabla docentes disponibles
  docentes: {
    url: '/getDocentes',
    columns: [
        {
            data: null,
            orderable: false,
            render: function (data, type, row) {
                return `
                   <div class="dropdown">
  <button class="btn btn-sm btn-primary dropdown-toggle d-flex align-items-center justify-content-center px-2 py-1 ms-1" type="button" id="dropdownAcciones" data-bs-toggle="dropdown" aria-expanded="false">
    <i class="fa-solid fa-gear me-2"></i>
  </button>
  <ul class="dropdown-menu dropdown-menu-sm" aria-labelledby="dropdownAcciones">
    <li>
      <a class="dropdown-item editar-btn small d-flex align-items-center" href="#" data-id="${row.id}">
        <i class="fa-solid fa-pen-to-square me-2"></i>
        Editar
      </a>
    </li>
    <li>
      <a class="dropdown-item borrar-btn small d-flex align-items-center" href="#" data-id="${row.id}">
        <i class="fa-solid fa-trash me-2"></i>
        Borrar
      </a>
    </li>
  </ul>
</div>
`;
            },
        },
        { data: 'nombre_docente' },
        { data: 'id' },
        { data: 'fecha' },
        {
            data: 'estatus',
            render: function (data) {
                let className = 'badge badge-custom ';
                if (data === 'Atendido') {
                    className += 'bg-success';
                } else if (data === 'En proceso') {
                    className += 'bg-info';
                } else if (data === 'Sin atender') {
                    className += 'bg-danger';
                } else {
                    className += 'bg-secondary';
                }
                return `<span class="${className}">${data || 'N/A'}</span>`;
            },
        },
        { data: 'antiguedad' },
        { data: 'situacion' },
        { data: 'cct_sale' },
        { data: 'municipio_sale' },
        { data: 'comunidad_sale' },
        { data: 'estatus_cubierta' },
        { data: 'cct_entra' },
        { data: 'municipio_entra' },
        { data: 'comunidad_entra' },
        { data: 'observaciones' },
    ],
    rowCallback: function (row, data) {
        $(row).off('click').on('click', function (event) {
            const target = $(event.target);
    
            // Ignorar clics en el botón de acciones o su contenido
            if (
                target.closest('.dropdown').length || // Si el clic es dentro del menú de acciones
                target.closest('button').length ||   // Si el clic es en un botón
                target.is('.editar-btn, .borrar-btn') // Si el clic es en editar o borrar
            ) {
                return; // No hacer nada si se hace clic en estos elementos
            }
    
            // Obtener la tabla y la fila
            const table = $('#yourTableId').DataTable();
            const tr = $(this);
            const row = table.row(tr);
    
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                row.child(`
                    <div class="details-content">
                        <p><strong>Más información:</strong></p>
                        <p>CCT Sale: ${data.cct_sale}</p>
                        <p>CCT Entra: ${data.cct_entra}</p>
                        <p>Observaciones: ${data.observaciones}</p>
                    </div>
                `).show();
                tr.addClass('shown');
            }
        });
    }
},



  // Tabla lista general
  personal: {
    url: '/lista-general', // Endpoint del backend
    columns: [
      { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
        { data: 'personal_id' },
        { data: 'nombre' },          // ID
        { data: 'rfc' },               // RFC
        { data: 'apellido_paterno' },  // Apellido Paterno
        { data: 'apellido_materno' },  // Apellido Materno
        { data: 'edad' },              // Edad
        { data: 'telefono' },          // Teléfono
        { data: 'correo' },            // Correo
        { data: 'cargo' }           // Cargo
      ],
  },
};
