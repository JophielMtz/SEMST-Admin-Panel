import { fetchCCTs } from "/js/AgGrid/cargaDatos.js";

export const colFecha = () => ({
  headerName: "Fecha",
  field: "fecha",
  width: 115,
  cellEditor: "agDateCellEditor",
  valueFormatter: (params) => {
    if (!params.value) {
      return "Sin fecha"; // Manejo de valores nulos o indefinidos
    }
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
  cellClass: "centrar-celda",
  cellEditor: "agDateCellEditor",
  valueFormatter: (params) => {
    if (!params.value) {
      return "Sin fecha"; // Manejo de valores nulos o indefinidos
    }
    const date = new Date(params.value);
    if (isNaN(date)) {
      return "N/A"; // Si no es una fecha válida, retorna "N/A"
    }
    // Si es una fecha válida, formatea la fecha
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
  cellClass: "centrar-celda",
  cellEditor: "agDateCellEditor",
  valueFormatter: (params) => {
    if (!params.value) {
      return "Sin fecha"; // Manejo de valores nulos o indefinidos
    }
    
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
    if (!params.value) {
      return "Sin fecha"; // Manejo de valores nulos o indefinidos
    }
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
    if (!params.value) {
      return ""; // Si no hay valor, no renderiza nada
    }
    const date = new Date(params.value);
    if (isNaN(date.getTime())) {
      return ""; // Si no es una fecha válida, no renderiza nada
    }
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
    if (!params.value) {
      return ""; // Si no hay valor, no renderiza nada
    }
    const date = new Date(params.value);
    if (isNaN(date.getTime())) {
      return ""; // Si no es una fecha válida, no renderiza nada
    }
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
    if (!params.value) {
      return ""; // Si no hay valor, no renderiza nada
    }
    const date = new Date(params.value);
    if (isNaN(date.getTime())) {
      return ""; // Si no es una fecha válida, no renderiza nada
    }
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Monterrey",
    });
  },
});

export const Proceso = () => ({
  field: "tipo_proceso",
  headerName: "Proceso",
  editable: false,
  width: 109,
});

export const nombreDocente = () => ({
  field: "nombre_docente",
  headerName: "Nombre",
  editable: false,
  width: 280,
  wrapHeaderText: true,
  autoHeaderHeight: true,
  cellClass: "centrar-celda"
});

export const antiguedad = () => ({
  field: "antiguedad",
  headerName: "Antigüedad",
  editable: false,
  width: 109,
  // cellClass: "centrar-celda",
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
  // cellStyle: { "white-space": "normal", "line-height": "1.7" },
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

      console.log(
        "Comunidades actualizadas para municipio entra:",
        params.context.currentComunidadesEntra
      );
      console.log("CCTs reiniciados:", params.context.currentCCTsEntra);

      // Refrescar celdas de comunidades y CCTs
      params.api.refreshCells({ rowNodes: [params.node], force: true });
      return true;
    }

    console.error(
      "Error: Municipio inválido. Valor ingresado:",
      params.newValue
    );
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
    values: params.context.currentComunidadesEntra.map(
      (c) => c.nombre_comunidad
    ),
  }),
  valueSetter: async (params) => {
    console.log("### Comunidad entra - valueSetter");
    console.log("Nuevo valor comunidad:", params.newValue);
    console.log(
      "Comunidades actuales disponibles:",
      params.context.currentComunidadesEntra
    );

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
      const ccts = await fetchCCTs(
        params.data.municipio_entra_id,
        comunidadObj.comunidad_id
      );
      console.log("CCTs obtenidos:", ccts);

      params.context.currentCCTsEntra = ccts || [];
      console.log(
        "CCTs actualizados para comunidad entra:",
        params.context.currentCCTsEntra
      );

      // Refrescar celdas de CCTs
      params.api.refreshCells({ rowNodes: [params.node], force: true });
      return true;
    }

    console.error(
      "Error: Comunidad inválida. Valor ingresado:",
      params.newValue
    );
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
    console.log(
      "CCTs disponibles para la comunidad:",
      params.context.currentCCTsEntra
    );

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
    {
      headerName: "Zona",
      field: "zona_id",
      editable: () => editMode,
      resizable: true,
      width: 70,
    },
    {
      headerName: "Sector",
      field: "sector_id",
      editable: () => editMode,
      resizable: true,
      width: 80,
    },
    {
      headerName: "No de Alumnos",
      field: "no_alumnos",
      editable: () => editMode,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 90,
      cellStyle: { "white-space": "normal", "line-height": "1.7" },
    },
    {
      headerName: "1° Grado",
      field: "grado_1",
      editable: () => editMode,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 74,
      cellStyle: { "white-space": "normal", "line-height": "1.7" },
    },
    {
      headerName: "2° Grado",
      field: "grado_2",
      editable: () => editMode,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 74,
      cellStyle: { "white-space": "normal", "line-height": "1.7" },
    },
    {
      headerName: "3° Grado",
      field: "grado_3",
      editable: () => editMode,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 74,
      cellStyle: { "white-space": "normal", "line-height": "1.7" },
    },
  ],
});

//============Botones=======//
export const Perfil = {
  field: "perfil",
  headerName: "Perfil",
  editable: false,
  width: 65,
  cellClass: "centrar-celda",
  headerClass: "text-center",
  cellRenderer: (params) => {
    if (!params.data || !params.data.personal_id) {
      return null;
    }

    const viewButton = document.createElement("a");
    viewButton.classList.add("btn", "btn-sm", "btn-icon", "btn-primary");
    viewButton.setAttribute("data-bs-toggle", "tooltip");
    viewButton.setAttribute("data-bs-placement", "top");
    viewButton.setAttribute("title", "Ver Perfil");
    viewButton.href = `/perfil/${params.data.personal_id}`;

    const btnInner = document.createElement("span");
    btnInner.classList.add("btn-inner");

    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("class", "icon-20");
    svgIcon.setAttribute("width", "20");
    svgIcon.setAttribute("viewBox", "0 0 24 24");
    svgIcon.setAttribute("fill", "none");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("fill-rule", "evenodd");
    path1.setAttribute("clip-rule", "evenodd");
    path1.setAttribute("d", "M9.87651 15.2063C6.03251 15.2063 2.74951 15.7873 2.74951 18.1153C2.74951 20.4433 6.01251 21.0453 9.87651 21.0453C13.7215 21.0453 17.0035 20.4633 17.0035 18.1363C17.0035 15.8093 13.7415 15.2063 9.87651 15.2063Z");
    path1.setAttribute("stroke", "currentColor");
    path1.setAttribute("stroke-width", "1.5");
    path1.setAttribute("stroke-linecap", "round");
    path1.setAttribute("stroke-linejoin", "round");

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("fill-rule", "evenodd");
    path2.setAttribute("clip-rule", "evenodd");
    path2.setAttribute("d", "M9.8766 11.886C12.3996 11.886 14.4446 9.841 14.4446 7.318C14.4446 4.795 12.3996 2.75 9.8766 2.75C7.3546 2.75 5.3096 4.795 5.3096 7.318C5.3006 9.832 7.3306 11.877 9.8456 11.886H9.8766Z");
    path2.setAttribute("stroke", "currentColor");
    path2.setAttribute("stroke-width", "1.5");
    path2.setAttribute("stroke-linecap", "round");
    path2.setAttribute("stroke-linejoin", "round");

    const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", "M19.2036 8.66919V12.6792");
    path3.setAttribute("stroke", "currentColor");
    path3.setAttribute("stroke-width", "1.5");
    path3.setAttribute("stroke-linecap", "round");
    path3.setAttribute("stroke-linejoin", "round");

    const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path4.setAttribute("d", "M21.2497 10.6741H17.1597");
    path4.setAttribute("stroke", "currentColor");
    path4.setAttribute("stroke-width", "1.5");
    path4.setAttribute("stroke-linecap", "round");
    path4.setAttribute("stroke-linejoin", "round");

    svgIcon.appendChild(path1);
    svgIcon.appendChild(path2);
    svgIcon.appendChild(path3);
    svgIcon.appendChild(path4);

    btnInner.appendChild(svgIcon);
    
    viewButton.appendChild(btnInner);

    return viewButton;
  },
};


  export const VerMas = {
    field: "ver_mas",
    headerName: "Ver Más",
    editable: false,
    width: 120,
    cellRenderer: (params) => {
      if (!params.data) {
        console.error("Datos no encontrados para esta fila.");
        return null;
      }
  
      // Obtener la tabla de origen
      const tablaOrigen = params.data.tabla_origen || params.data.tabla || null;
  
      // Imprimir la tabla de origen para depuración
      console.log("Tabla de origen encontrada para esta fila:", tablaOrigen);
  
      if (!tablaOrigen) {
        console.error("Datos insuficientes para renderizar el botón de Ver Más:", params.data);
        return null;
      }
  
      const viewButton = document.createElement("button");
      viewButton.classList.add("btn", "btn-primary", "btn-sm");
      viewButton.textContent = "Ver Más";
  
      // Construir la URL basada en la tabla de origen
      const url = `/${tablaOrigen
        .replace("_", "-")
        .replace("becas-comision", "beca-comision")
        .replace("salud-inseguridad", "salud")
        .replace("licencia-sin-goce", "licencias-sin-goce")
        .replace("solicitudes-de_cambio", "cambio")}`;
  
      console.log("URL generada para el botón Ver Más:", url);
  
      // Añadir el evento al botón
      viewButton.addEventListener("click", () => {
        console.log("Redirigiendo a:", url);
        if (url) {
          window.location.href = url;
        } else {
          console.error("No se pudo redirigir. URL inválida:", url);
        }
      });
  
      return viewButton;
    },
  };


  
  
  
  
  
  
