
import {  fetchCCTs } from "/js/AgGrid/cargaDatos.js";


export const colFecha = () => ({
    headerName: "Fecha",
    field: "fecha",
    width: 115,
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Monterrey",
      });
    },
});
export const colFechaRegistro = () => ({
    headerName: "Fecha Registro",
    field: "fecha_registro",
    width: 115,
    wrapHeaderText: true, 
    autoHeaderHeight: true,   
    cellStyle: { "white-space": "normal", "line-height": "1.7" }, 
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Monterrey",
      });
    },
});

export const colFechaDocumento = () => ({
    headerName: "Fecha Documento",
    field: "fecha_documento",
    width: 115,
    wrapHeaderText: true, 
    autoHeaderHeight: true,   
    cellStyle: { "white-space": "normal", "line-height": "1.7" }, 
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Monterrey",
      });
    },
});

export const colFechaInicio = () => ({
    headerName: "Fecha de inicio",
    field: "fecha_inicio",
    width: 108,
    wrapHeaderText: true, 
    autoHeaderHeight: true,
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Monterrey",
      });
    },
});

export const colFechaTermino = () => ({
    headerName: "Fecha de Termino",
    field: "fecha_termino",
    width: 110,
    wrapHeaderText: true, 
    autoHeaderHeight: true,
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Monterrey",
      });
    },
});

export const colIniciMovimiento = () => ({
    headerName: "Inicio del Movimiento",
    field: "inicio_movimiento",
    width: 110,
    wrapHeaderText: true, 
    autoHeaderHeight: true,
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Monterrey",
      });
    },
});

export const colTerminoMovimiento = () => ({
    headerName: "Término del Movimiento",
    field: "termino_movimiento",
    width: 110,
    wrapHeaderText: true, 
    autoHeaderHeight: true,
    cellEditor: "agDateCellEditor",
    valueFormatter: (params) => {
      const date = new Date(params.value);
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "America/Monterrey",
      });
    },
});

export const nombreDocente = () => ({
    field: "nombre_docente", 
    headerName: "Nombre", 
    editable: false, 
    width: 230,
    wrapHeaderText: true, 
    autoHeaderHeight: true,
    // cellClass: "centrar-celda"
});


export const antiguedad = () => ({
    field: "antiguedad",
    headerName: "Antigüedad",
    editable: false, 
    width: 109,
});
export const telefono = () => ({
    field: "telefono",
    headerName: "Telefono",
    editable: false, 
    width: 115,
});

export const observaciones = () => ({
    field: "observaciones", 
    headerName: "Observaciones", 
    minWidth: 250, 
    wrapHeaderText: true, 
    autoHeaderHeight: true, 
    autoHeight: true,  
    cellStyle: { "white-space": "normal", "line-height": "1.7" }, 
    autoHeight: true, 

});

export const situacion = () => ({
    field: "situacion", 
    headerName: "Situación", 
    minWidth: 250, 
    wrapHeaderText: true, 
    autoHeaderHeight: true, 
    autoHeight: true,  
    cellStyle: { "white-space": "normal", "line-height": "1.7" }, 
    autoHeight: true, 

});

export const FuncionDocente = () => ({
    field: "funcion_docente",
    headerName: "Función Docente",
    width: 110,
    wrapHeaderText: true, 
    autoHeaderHeight: true,   
    cellStyle: { "white-space": "normal", "line-height": "1.7" }, 
    autoHeight: true, 
});


export const municipioSale = () => ({
    field: "municipio_sale",
    headerName: "Municipio sale",
    editable: false,
    width: 150,
});

// 2. CCT Sale
export const cctSale = () => ({
    field: "cct_sale",
    headerName: "CCT sale",
    editable: false,
    width: 115,
});

// 3. Comunidad Sale
export const comunidadSale = () => ({
    field: "comunidad_sale",
    headerName: "Comunidad sale",
    editable: false,
    wrapHeaderText: true, 
    autoHeaderHeight: true, 
    width: 150,
    cellStyle: { "white-space": "normal", "line-height": "1.7" }, 
  
});


export const municipioEntra = () => ({
    field: "municipio_entra",
    headerName: "Municipio entra",
    width: 150,
    wrapHeaderText: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => ({
        values: params.context.municipios.map((m) => m.nombre_municipio),
    }),
    valueSetter: (params) => {
        console.log("### Municipio entra - valueSetter");
        console.log("Nuevo valor municipio:", params.newValue);

        const municipioObj = params.context.municipios.find(
            (m) => m.nombre_municipio === params.newValue
        );

        console.log("Municipio encontrado:", municipioObj);

        if (municipioObj) {
            // Actualizar datos del municipio
            params.data.municipio_entra_id = municipioObj.municipio_id;
            params.data.municipio_entra = municipioObj.nombre_municipio;
            params.context.currentComunidadesEntra = municipioObj.comunidades || [];
            params.context.currentCCTsEntra = []; // Reiniciar las CCTs cuando se cambia el municipio

            console.log("Comunidades actualizadas para municipio entra:", params.context.currentComunidadesEntra);
            console.log("CCTs reiniciados:", params.context.currentCCTsEntra);

            // Refrescar celdas de comunidades y CCTs
            params.api.refreshCells({ rowNodes: [params.node], force: true });
            return true;
        }

        console.error("Error: Municipio inválido. Valor ingresado:", params.newValue);
        alert("Municipio inválido.");
        return false;
    },
});


export const comunidadEntra = () => ({
    field: "comunidad_entra",
    headerName: "Comunidad entra",
    width: 150,
    wrapHeaderText: true, 
    autoHeaderHeight: true, 
    width: 150,
    cellStyle: { "white-space": "normal", "line-height": "1.7" }, 
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => ({
        values: params.context.currentComunidadesEntra.map((c) => c.nombre_comunidad),
    }),
    valueSetter: async (params) => {
        console.log("### Comunidad entra - valueSetter");
        console.log("Nuevo valor comunidad:", params.newValue);
        console.log("Comunidades actuales disponibles:", params.context.currentComunidadesEntra);

        const comunidadObj = params.context.currentComunidadesEntra.find(
            (c) => c.nombre_comunidad === params.newValue
        );

        console.log("Comunidad encontrada:", comunidadObj);

        if (comunidadObj) {
            // Actualizar datos de la comunidad
            params.data.comunidad_entra_id = comunidadObj.comunidad_id;
            params.data.comunidad_entra = comunidadObj.nombre_comunidad;

            // Obtener y actualizar los CCTs para esta comunidad
            console.log("Obteniendo CCTs para comunidad:", comunidadObj.comunidad_id);
            const ccts = await fetchCCTs(params.data.municipio_entra_id, comunidadObj.comunidad_id);
            console.log("CCTs obtenidos:", ccts);

            params.context.currentCCTsEntra = ccts || [];
            console.log("CCTs actualizados para comunidad entra:", params.context.currentCCTsEntra);

            // Refrescar celdas de CCTs
            params.api.refreshCells({ rowNodes: [params.node], force: true });
            return true;
        }

        console.error("Error: Comunidad inválida. Valor ingresado:", params.newValue);
        alert("Comunidad inválida.");
        return false;
    },
});



export const cctEntra = () => ({
    field: "cct_entra",
    headerName: "CCT entra",
    width: 150,
    wrapHeaderText: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: (params) => ({
        values: params.context.currentCCTsEntra.map((c) => c.centro_clave_trabajo),
    }),
    valueSetter: (params) => {
        console.log("### CCT entra - valueSetter");
        console.log("Nuevo valor CCT:", params.newValue);
        console.log("CCTs disponibles para la comunidad:", params.context.currentCCTsEntra);

        const cctObj = params.context.currentCCTsEntra.find(
            (c) => c.centro_clave_trabajo === params.newValue
        );

        console.log("CCT encontrado:", cctObj);

        if (cctObj) {
            // Actualizar datos de CCT
            params.data.cct_entra_id = cctObj.cct_id;
            params.data.cct_entra = cctObj.centro_clave_trabajo;

            console.log("CCT actualizado:", cctObj);
            return true;
        }

        console.error("Error: CCT inválido. Valor ingresado:", params.newValue);
        alert("CCT inválido.");
        return false;
    },
});


export const Zona = () => ({
    columns: [
        { headerName: "Zona", field: "zona_id", editable: () => editMode, resizable: true, width: 70 },
        { headerName: "Sector", field: "sector_id", editable: () => editMode, resizable: true, width: 80 },
        { headerName: "No de Alumnos", field: "no_alumnos", editable: () => editMode, resizable: true,
             wrapHeaderText: true, autoHeaderHeight: true, width: 90,
                cellStyle: { "white-space": "normal", "line-height": "1.7" },  },
        { headerName: "1° Grado", field: "grado_1", editable: () => editMode, resizable: true,  
            wrapHeaderText: true,  autoHeaderHeight: true, width: 74,
                cellStyle: { "white-space": "normal", "line-height": "1.7" },},
        { headerName: "2° Grado", field: "grado_2", editable: () => editMode, resizable: true,  
            wrapHeaderText: true,  autoHeaderHeight: true, width: 74,
                cellStyle: { "white-space": "normal", "line-height": "1.7" }, },
        { headerName: "3° Grado", field: "grado_3", editable: () => editMode, resizable: true,  
            wrapHeaderText: true,  autoHeaderHeight: true, width: 74,
                cellStyle: { "white-space": "normal", "line-height": "1.7" }, }
      ]
    }); 

