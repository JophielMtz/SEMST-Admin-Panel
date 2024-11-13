export const dataTableInfo = {


  // Tabla docentes disponibles
  docentes: {
    url: '/getDocentes',
    columns: [
        { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
        { data: null, orderable: false, render: function (data, type, row) {
          return `
                   <div class="dropdown">
                        <button class="btn btn-sm btn-primary dropdown-toggle d-flex align-items-center justify-content-center px-2 py-1 ms-1" type="button" id="dropdownAcciones" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fa-solid fa-gear me-2"></i> </button>
                        <ul class="dropdown-menu dropdown-menu-sm" aria-labelledby="dropdownAcciones">
                          <li> 
                          <a class="dropdown-item editar-btn small d-flex align-items-center" href="#" data-id="${row.id}" data-bs-toggle="modal" data-bs-target="#modalEditar">
                              <i class="fa-solid fa-pen-to-square me-2"></i> Editar </a>
                          </li>
                          <li>
                            <a class="dropdown-item borrar-btn small d-flex align-items-center" href="#" data-id="${row.id}">
                              <i class="fa-solid fa-trash me-2"></i>Borrar</a>
                          </li>
                        </ul>
                    </div>`;
            },
        },
        { data: 'nombre_docente' },
        { data: 'id' },
        { data: 'fecha' },
        {
            data: 'estatus',
            render: function (data) {
                let className = 'badge badge-custom '; if (data === 'Atendido') { className += 'badge bg-primary'; } 
                else if (data === 'En proceso') { className += 'bg-info'; } 
                else if (data === 'Sin atender') { className += 'bg-danger';
                } else { className += 'bg-secondary'; }
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
    detailsRenderer: function (data) {
        return `
          <div class="details-content">
            <p><strong>Más información:</strong></p>
            <p>CCT Sale: ${data.cct_sale}</p>
            <p>CCT Entra: ${data.cct_entra}</p>
            <p>Observaciones: ${data.observaciones}</p>
          </div>
        `;
      },
    },

  // Tabla lista general
  personal: {
    url: '/lista-general', // Endpoint del backend
    columns: [
      { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
        { data: 'personal_id' },
        { data: 'rfc' },     
        { data: 'nombre' },          // ID
        { data: 'apellido_paterno' },  // Apellido Paterno
        { data: 'apellido_materno' },  // Apellido Materno
        { data: 'edad' },              // Edad
        { data: 'telefono' },          // Teléfono
        { data: 'correo' },            // Correo
        { data: 'cargo' }           // Cargo
      ],
      detailsRenderer: function (data) {
        return `
          <div class="details-content">
            <p><strong>Detalles del personal:</strong></p>
            <p>Edad: ${data.edad}</p>
            <p>Teléfono: ${data.telefono}</p>
            <p>Correo: ${data.correo}</p>
            <p>Cargo: ${data.cargo}</p>
          </div>
        `;
      },
    },
    // ... otras tablas

  
    

    
  };
