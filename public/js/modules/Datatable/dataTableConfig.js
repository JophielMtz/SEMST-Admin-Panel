export const dataTableConfig = {
  dom: '<"row align-items-center"<"col-md-6" l><"col-md-6" f>>' +
       '<"border-bottom my-3" rt>' +
       '<"row align-items-center"<"col-md-6" i><"col-md-6" p>>',
  responsive: {
    details: {
      type: 'column',
      target: 'td.dt-control', // Cambia el target para usar dt-control
      renderer: function (api, rowIdx, columns) {
        const data = $.map(columns, function (col) {
          return col.hidden
            ? `<div class="">
                  <div class="col-4">
                    <strong>${col.title}:</strong>
                  </div>
                  <div class="col-6">
                      ${col.data || 'N/A'}
                  </div>
                </div>
                `
            : ''; // Este estilo no se toca
        }).join('');

        return data;
      }
    }
  },
  autoWidth: false,
  order: [[1, 'asc']],
  pageLength: 30, // Número predeterminado de filas por página
  lengthMenu: [ // Opciones para seleccionar la cantidad de filas
    [30, 75, 100, 150], // Cantidades disponibles
    [30, 75, 100, 150]  // Etiquetas mostradas (pueden ser personalizadas)
  ],
  columnDefs: [
    {
      targets: '_all', // Applies to all columns
      render: function (data, type, row) {
        return type === 'display' && data && data.length > 50
          ? `<span class="d-inline-block text-wrap text-center text-md-nowrap text-md-center text-sm-left" style="max-width: 200px;" title="${data}">${data}</span>`
          : data;
      },
    },
  ],
  language: {
    url: '//cdn.datatables.net/plug-ins/1.13.5/i18n/es-MX.json'
  },
};
