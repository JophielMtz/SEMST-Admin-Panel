export const dataTableInfo = {
  // Tabla docentes disponibles
  docentes: {
      url: '/getDocentes',
      columns: [
          { className: 'dt-control', orderable: false, data: null, defaultContent: '' },
          { data: 'id' },
          { data: 'nombre_docente' },
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
  },
  // Tabla lista general
  personal: {
    url: '/lista-general', // Endpoint del backend
    columns: [
        { data: 'personal_id' },       // ID
        { data: 'rfc' },               // RFC
        { data: 'nombre' },            // Nombre
        { data: 'apellido_paterno' },  // Apellido Paterno
        { data: 'apellido_materno' },  // Apellido Materno
        { data: 'edad' },              // Edad
        { data: 'telefono' },          // Teléfono
        { data: 'correo' },            // Correo
        { data: 'cargo' },             // Cargo
      ],
  },
};
