import { dataTableInfo } from './dataTableInfo.js'; // Configuraciones de las tablas
import { dataTableConfig } from './dataTableConfig.js'; // Configuración genérica

$(document).ready(function () {
    $('.datatable').each(function () {
        const tableId = $(this).attr('id'); // Obtener ID único de la tabla
        const tableInfo = dataTableInfo[tableId]; // Buscar configuración en dataTableInfo

        // Validación: Verificar si hay configuración para la tabla
        if (!tableInfo) {
            console.warn(`No se encontró configuración para la tabla con ID: ${tableId}`);
            return; // Si no hay configuración, salta esta tabla
        }

        // Inicializar DataTable solo si aún no está inicializado
        if (!$.fn.DataTable.isDataTable(this)) {
            $(this).DataTable({
                ...dataTableConfig, // Configuración genérica de DataTables
                ajax: {
                    url: tableInfo.url, // Endpoint del backend para obtener datos
                    dataSrc: 'data', // Clave del JSON que contiene los datos
                },
                columns: tableInfo.columns, // Configuración específica de las columnas
            });

            // Confirmación de inicialización exitosa
            console.log(`DataTable inicializado para la tabla con ID: ${tableId}`);
        }
    });
});
