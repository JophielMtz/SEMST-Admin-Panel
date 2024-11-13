import { dataTableInfo } from './dataTableInfo.js';
import { dataTableConfig } from './dataTableConfig.js';

$(document).ready(function () {
  $('.datatable').each(function () {
    const tableId = $(this).attr('id');
    const tableInfo = dataTableInfo[tableId];

    if (!tableInfo) {
      console.warn(`No se encontró configuración para la tabla con ID: ${tableId}`);
      return;
    }

    if (!$.fn.DataTable.isDataTable(this)) {
      const tableInstance = $(this).DataTable({
        ...dataTableConfig,
        ajax: {
          url: tableInfo.url,
          dataSrc: 'data',
        },
        columns: tableInfo.columns,
      });

      // Almacena detailsRenderer en las configuraciones de DataTable
      tableInstance.settings()[0].detailsRenderer = tableInfo.detailsRenderer;

      console.log(`DataTable inicializado para la tabla con ID: ${tableId}`);
    }
  });
});
