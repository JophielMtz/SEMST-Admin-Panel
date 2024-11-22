const pool = require("../src/config/db");


//========== Vistas Controller =============//
const vistasController = {
  vistaPrincipal: async (req, res) => {
    try {
      const totalPersonal = await obtenerPersonalTotal(); // Llamada a obtenerTotalPersonal
      res.render("home", { totalPersonal });  // Pasa totalPersonal a la vista
    } catch (error) {
      res.status(500).send("Error al cargar la página");
    }
  },
    vistaReviciones: (req, res) => {
      res.render("revisiones");
    },
  vistaCambio: async (req, res) => {
    res.render("solicitudes/cambio");
  },
  vistaPendientes: async (req, res) => {
    res.render("pendientes");
  },
  vistaDocentesDisponibles: async (req, res) => {
    res.render("gestionDocentes/docentes-disponibles");
  },
  vistaListaGeneral: async (req, res) => {
    res.render("personal/lista-general");
  },
  vistaBecaComision: (req, res) => {
    res.render("saludApoyo/beca-comision");
  },
  vistaApoyoLentes: (req, res) => {
    res.render("saludApoyo/apoyo-lentes");
  },
  vistaNombramientosDocentes: (req, res) => {
    res.render("gestionDocentes/nombramientos-docentes");
  },
  vistaLicenciasSinGoce: (req, res) => {
    res.render("gestionDocentes/licencias-sin-goce");
  },
  vistaIncidencias: (req, res) => {
    res.render("escuelas/incidencias");
  },
  vistaCalendario: (req, res) => {
    res.render("calendario");
  },
  vistaSolicitudesGenerales: (req, res) => {
    res.render("solicitudes/solicitudes-generales");
  },
  vistaSolicitudesPersonal: (req, res) => {
    res.render("solicitudes/solicitudes-personal");
  },
  vistaSalud: (req, res) => {
    res.render("saludApoyo/salud");
  },
  vistaListaPanelAdm: (req, res) => {
    res.render("panelAdm/lista-panel-adm");
  },
  vistaPerfil: (req, res) => {
    res.render("perfil");
  },
  vistaRoles: (req, res) => {
    res.render("panelAdm/roles");
  },
  vistaInfoPersonal: (req, res) => {
    res.render("personal/info-personal");
  },
  
  
};

//=========Gets de las APIS==========//
const obtenerPendientes = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        np, 
        fecha, 
        estatus, 
        tramite, 
        departamento,
        observaciones_conflictos, 
        observaciones_secretaria_general
      FROM pendientes
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista pendientes:", error);
    res.status(500).json({ message: "Error al obtener lista pendientes" });
  }
};

const obtenerDocentesDisponibles = async (req, res) => {
  try {
    const [results] = await pool.query(`
    SELECT 
          dd.np,
          dd.personal_id,
          dd.nombre_docente,
          dd.fecha,
          dd.estatus,
          dd.situacion,
          dd.antiguedad,
          dd.municipio_sale,
          dd.comunidad_sale,
          dd.cct_sale,
          dd.municipio_entra,
          dd.comunidad_entra,
          dd.cct_entra,
          dd.estatus_cubierta,
          dd.observaciones
      FROM 
        docentes_disponibles dd
      LEFT JOIN personal p ON dd.personal_id = p.personal_id
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener el personal:", error);
    res.status(500).json({ message: "Error al obtener la lista de personal" });
  }
};

const obtenerListaGeneral = async (req, res) => {
  try {
    const [results] = await pool.query(`
    SELECT 
    p.personal_id, 
    p.rfc, 
    p.nombre, 
    p.apellido_paterno, 
    p.apellido_materno, 
    p.edad, 
    p.telefono, 
    p.correo, 
    c.descripcion AS cargo, 
    p.imagen
FROM personal p
LEFT JOIN detalle_laboral dl ON p.personal_id = dl.personal_id
LEFT JOIN cargos c ON dl.cargo_id = c.cargo_id;
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener el personal:", error);
    res.status(500).json({ message: "Error al obtener la lista de personal" });
  }
};

const obtenerBecas = async (req, res) => {
  try {
    const [results] = await pool.query(`
    SELECT 
    np,
  fecha_registro AS fecha,
  personal_id,
  nombre_docente,
  cct,
  comunidad,
  municipio,
  vacante,
  cubre,
  antiguedad,
  telefono,
  observaciones_conflictos,
  observaciones_secretaria_general
FROM becas_comision;
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener el personal:", error);
    res.status(500).json({ message: "Error al obtener la lista de personal" });
  }
};

const obtenerSalud = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        np, 
        fecha, 
        estatus, 
        tramite, 
        departamento,
        observaciones_conflictos, 
        observaciones_secretaria_general
      FROM salud
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista salud:", error);
    res.status(500).json({ message: "Error al obtener lista salud" });
  }
};

const obtenerSolicitudesPersonal = async (req, res) => {
  try {
    const [results] = await pool.query(`
     SELECT 
  np , fecha, estatus, escuela,
  c.nombre AS "comunidad",
  m.nombre AS "municipio",
  observaciones AS "observaciones",
  cct.centro_clave_trabajo AS "CLAVE CCT",
  m.nombre AS "MUNICIPIO",
  sp.observaciones AS "OBSERVACIONES",
  u.cct_id AS "Clave CCT",
  com.nombre AS "COMUNIDAD CCT",
  mun.nombre AS "MUNICIPIO CCT",
  u.zona_id AS "ZONA",
  u.sector_id AS "SECTOR",
  sp.org AS "ORG",
  sp.no_alumnos AS "NO DE ALUMNOS",
  sp.grado_1 AS "1° GRADO",
  sp.grado_2 AS "2° GRADO",
  sp.grado_3 AS "3° GRADO",
  sp.funcion_docente AS "FUNCION DEL DOCENTE",
  sp.tipo_nombramiento AS "TIPO DE NOMBRAMIENTO",
  sp.inicio_movimiento AS "INICIO DEL MOVIMIENTO",
  sp.termino_movimiento AS "TERMINO DEL MOVIMIENTO",
  sp.propuesta AS "PROPUESTA",
  sp.subdireccion_academica AS "SUBDIRECCION ACADEMICA",
  sp.subdireccion_planeacion AS "SUBDIRECCION DE PLANEACION",
  sp.subdireccion_administracion AS "SUBDIRECCION DE ADMINISTRACION",
  sp.usicamm AS "USICAMM",
  sp.recursos_humanos AS "RECURSOS HUMANOS",
  sp.juridico AS "JURIDICO",
  sp.observaciones_conflictos AS "OBSERVACIONES CONFLICTOS",
  sp.observaciones_secretaria_general AS "OBSERVACIONES SECRETARIA GENERAL",
  sp.estatus_movimiento AS "ESTATUS DEL MOVIMIENTO"
FROM 
  solicitudes_de_personal sp
JOIN 
  ubic_ccts u ON sp.id_relacion = u.id_relacion
JOIN 
  ccts cct ON u.cct_id = cct.cct_id -- Unión con la tabla de CCTs para obtener la clave real
LEFT JOIN 
  comunidad c ON u.comunidad_id = c.comunidad_id
LEFT JOIN 
  municipio m ON u.municipio_id = m.municipio_id
LEFT JOIN 
  comunidad com ON u.comunidad_id = com.comunidad_id
LEFT JOIN 
  municipio mun ON u.municipio_id = mun.municipio_id;

    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista solicitudes personal:", error);
    res.status(500).json({ message: "Error al obtener lista solicitudes personal" });
  }
};

const obtenerIncidencias = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        i.np,
        i.fecha,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_del_docente,
        dl.antiguedad,
        p.telefono,
        cct.centro_clave_trabajo,
        com.nombre AS comunidad,
        mun.nombre AS municipio,
        u.zona_id,
        u.sector_id,
        \`to\`.descripcion AS tipo_organizacion,
        i.no_alumnos,
        i.grado_1,
        i.grado_2,
        i.grado_3,
        i.funcion_docente,
        i.tipo_nombramiento,
        i.inicio_movimiento,
        i.termino_movimiento,
        i.propuesta,
        i.subdireccion_academica,
        i.subdireccion_planeacion,
        i.subdireccion_administracion,
        i.usicamm,
        i.recursos_humanos,
        i.juridico,
        i.observaciones_conflictos,
        i.observaciones_secretaria_general,
        i.estatus_movimiento
      FROM 
        incidencias i
      JOIN 
        personal p ON i.personal_id = p.personal_id
      LEFT JOIN 
        detalle_laboral dl ON i.detalle_laboral_id = dl.detalle_laboral_id
      LEFT JOIN 
        ubic_ccts u ON i.id_relacion = u.id_relacion
      LEFT JOIN 
        ccts cct ON u.cct_id = cct.cct_id
      LEFT JOIN 
        comunidad com ON u.comunidad_id = com.comunidad_id
      LEFT JOIN 
        municipio mun ON u.municipio_id = mun.municipio_id
      LEFT JOIN 
        tipo_organizacion \`to\` ON i.tipo_organizacion_id = \`to\`.tipo_organizacion_id;
    `);
    
  
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista pendientes:", error);
    res.status(500).json({ message: "Error al obtener lista pendientes" });
  }
};

const obtenerLicenciaSinGoce = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
  np,
  lsg.fecha_registro AS "FECHA REGISTRO",
  lsg.fecha_documento AS "FECHA DOCUMENTO",
  CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS "NOMBRE DEL DOCENTE",
  lsg.tipo_movimiento AS "TIPO DE MOVIMIENTO",
  ccts.centro_clave_trabajo AS "CCT",
  com.nombre AS "COMUNIDAD",
  mun.nombre AS "MUNICIPIO",
  tor.descripcion AS "ORGANIZACION",
  lsg.justifica AS "JUSTIFICA",
  lsg.inicio_movimiento AS "INICIO DEL MOVIMIENTO",
  lsg.termino_movimiento AS "TÉRMINO DEL MOVIMIENTO",
  lsg.diagnostico AS "DIAGNOSTICO",
  lsg.aviso AS "AVISO",
  lsg.vacante AS "VACANTE",
  lsg.observaciones AS "OBSERVACIONES",
  dl.antiguedad AS "ANTIGUEDAD",
  p.telefono AS "TELEFONO",
  lsg.observaciones_conflictos AS "OBSERVACIONES CONFLICTOS",
  lsg.observaciones_secretaria_general AS "OBSERVACIONES SECRETARIA GENERAL"
FROM 
  licencia_sin_goce lsg
LEFT JOIN 
  personal p ON lsg.personal_id = p.personal_id
LEFT JOIN 
  ubic_ccts uc ON lsg.id_relacion = uc.id_relacion
LEFT JOIN 
  ccts ON uc.cct_id = ccts.cct_id
LEFT JOIN 
  comunidad com ON uc.comunidad_id = com.comunidad_id
LEFT JOIN 
  municipio mun ON uc.municipio_id = mun.municipio_id
LEFT JOIN 
  tipo_organizacion tor ON lsg.tipo_organizacion_id = tor.tipo_organizacion_id
LEFT JOIN 
  detalle_laboral dl ON lsg.personal_id = dl.personal_id;

    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista licencia sin goce:", error);
    res.status(500).json({ message: "Error al obtener lista licencia sin goce" });
  }
};

const obtenerEscuelasDisponibles = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        np, 
        fecha, 
        estatus, 
        tramite, 
        departamento,
        observaciones_conflictos, 
        observaciones_secretaria_general
      FROM escuelas_disponibles
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista escuelas disponibles:", error);
    res.status(500).json({ message: "Error al obtener lista escuelas disponibles" });
  }
};

const obtenerNombramientosDocentes = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        n.np,
        n.fecha,
        CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) nombre_del_docente,
        dl.antiguedad,
        p.telefono,
        cct.centro_clave_trabajo,
        com.nombre,
        mun.nombre,
        u.zona_id,
        u.sector_id,
        \`to\`.descripcion,
        n.no_alumnos,
        n.grado_1,
        n.grado_2,
        n.grado_3,
        n.funcion_docente,
        n.tipo_nombramiento,
        n.inicio_movimiento,
        n.termino_movimiento,
        n.propuesta,
        n.subdireccion_academica,
        n.subdireccion_planeacion,
        n.subdireccion_administracion,
        n.usicamm,
        n.recursos_humanos,
        n.juridico,
        n.observaciones_conflictos,
        n.observaciones_secretaria_general,
        n.estatus_movimiento
      FROM 
        nombramientos n
      JOIN 
        personal p ON n.personal_id = p.personal_id
      LEFT JOIN 
        detalle_laboral dl ON n.detalle_laboral_id = dl.detalle_laboral_id
      LEFT JOIN 
        ubic_ccts u ON n.id_relacion = u.id_relacion
      LEFT JOIN 
        ccts cct ON u.cct_id = cct.cct_id
      LEFT JOIN 
        comunidad com ON u.comunidad_id = com.comunidad_id
      LEFT JOIN 
        municipio mun ON u.municipio_id = mun.municipio_id
      LEFT JOIN 
        tipo_organizacion \`to\` ON n.tipo_organizacion_id = \`to\`.tipo_organizacion_id;
    `);
    
    
    
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista nombramientos docentes:", error);
    res.status(500).json({ message: "Error al obtener lista nombramientos docentes" });
  }
};

const obtenerSolicitudes = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        np, 
        fecha, 
        estatus, 
        tramite, 
        departamento,
        observaciones_conflictos, 
        observaciones_secretaria_general
      FROM solicitudes
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista solicitudes:", error);
    res.status(500).json({ message: "Error al obtener lista solicitudes" });
  }
};

const obtenerInternos = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        np, 
        fecha, 
        estatus, 
        tramite, 
        departamento,
        observaciones_conflictos, 
        observaciones_secretaria_general
      FROM internos
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista internos:", error);
    res.status(500).json({ message: "Error al obtener lista internos" });
  }
};


//==========LLamar Datos para home.ejs==========//
const obtenerPersonalTotal = async () => {
  try {
    const [results] = await pool.query(`
      SELECT COUNT(*) AS total_personal FROM personal
    `);
    return results[0].total_personal;
  } catch (error) {
    console.error("Error al obtener total de personal:", error);  // Esto imprimirá el error completo
    throw new Error("Error al obtener total de personal");
  }
};





//============Modulo para actualizar registros de tablas en la db =============//
const actualizarRegistro = async (tabla, idCampo, idValor, field, value, validFields, res) => {
  if (!idValor || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren los valores necesarios." });
  }

  if (!validFields.includes(field)) {
    return res.status(400).json({ message: "Campo inválido." });
  }

  try {
    const query = `UPDATE ?? SET ?? = ? WHERE ?? = ?`;
    const [result] = await pool.query(query, [tabla, field, value, idCampo, idValor]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }

    return res.json({ message: "Registro actualizado correctamente." });
  } catch (error) {
    console.error(`Error al actualizar registro en la tabla ${tabla}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

//=========Puts para las tablas AG Grid funciona con el modulo actualizarRegistro =============//
const editarPendientes = async (req, res) => {
  // Log para verificar los datos recibidos en el cuerpo de la solicitud
  console.log("Datos recibidos en editarPendientes:", req.body);

  const { np, field, value } = req.body;

  const validFields = [
    'np', 'fecha', 'estatus', 'tramite', 
    'departamento', 'observaciones_conflictos','observaciones_secretaria_general',
  ];
  // Validación previa para asegurar que los datos clave estén presentes
  if (!np || !field || value === undefined) {
    console.log("Error: Datos insuficientes. Se requieren 'np', 'field' y 'value'.");
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  // Llamada a la función actualizarRegistro
  return actualizarRegistro("pendientes", "np", np, field, value, validFields, res);
};

const editarDocente = async (req, res) => {
  const { personal_id, field, value } = req.body;

  const validFields = [
    'nombre_docente', 'fecha', 'estatus', 'situacion',
    'antiguedad', 'municipio_sale', 'comunidad_sale',
    'cct_sale', 'estatus_cubierta', 'observaciones',
  ];

  return actualizarRegistro("docentes_disponibles", "personal_id", personal_id, field, value, validFields, res);
};

const editarBecas = async (req, res) => {
  // Log para verificar los datos recibidos en el cuerpo de la solicitud
  console.log("Datos recibidos en editarBecaComision:", req.body);

  const { np, field, value } = req.body;

  const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad',  'municipio', 'vacante',
    'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general'
  ];
  // Validación previa para asegurar que los datos clave estén presentes
  if (!np || !field || value === undefined) {
    console.log("Error: Datos insuficientes. Se requieren 'np', 'field' y 'value'.");
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  // Llamada a la función actualizarRegistro
  return actualizarRegistro("becas_comision", "np", np, field, value, validFields, res);
};
const editarSalud = async (req, res) => {
  const { np, field, value } = req.body;
  const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad', 'municipio', 'vacante', 'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general' ];
  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("salud", "np", np, field, value, validFields, res);
};

const editarSolicitudesPersonal = async (req, res) => {
  const { np, field, value } = req.body;
  const validFields = ["np", "fecha", "estatus", "escuela", "comunidad", "municipio", "observaciones", "clave cct", "comunidad cct", "municipio cct", "zona", "sector", "org", "no de alumnos", "1° grado", "2° grado", "3° grado", "funcion_docente", "tipo de nombramiento", "inicio del movimiento", "termino del movimiento", "propuesta", "subdireccion academica", "subdireccion de planeacion", "subdireccion de administracion", "usicamm", "recursos humanos", "juridico", "observaciones conflictos", "observaciones secretaria general", "estatus del movimiento"];


  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("solicitudes_de_personal", "np", np, field, value, validFields, res);
};

const editarIncidencias = async (req, res) => {
  const { np, field, value } = req.body;
  const validFields = ["np", "fecha", "nombre_del_docente", "antiguedad", "telefono", "centro_clave_trabajo", "comunidad", "municipio", "zona_id", "sector_id", "tipo_organizacion", "no_alumnos", "grado_1", "grado_2", "grado_3", "funcion_docente", "tipo_nombramiento", "inicio_movimiento", "termino_movimiento", "propuesta", "subdireccion_academica", "subdireccion_planeacion", "subdireccion_administracion", "usicamm", "recursos_humanos", "juridico", "observaciones_conflictos", "observaciones_secretaria_general", "estatus_movimiento"];

  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("incidencias", "np", np, field, value, validFields, res);
};

const editarLicenciaSinGoce = async (req, res) => {
  console.log("Datos recibidos en editarPendientes:", req.body);
  const { np, field, value } = req.body;
  const validFields = ["NP", "FECHA_REGISTRO", "FECHA_DOCUMENTO", "PERSONAL_ID", "TIPO_MOVIMIENTO", "CCT", "COMUNIDAD", "MUNICIPIO", "ORGANIZACION", "JUSTIFICA", "INICIO_MOVIMIENTO", "TERMINO_MOVIMIENTO", "DIAGNOSTICO", "AVISO", "VACANTE", "OBSERVACIONES", "ANTIGUEDAD", "TELEFONO", "OBSERVACIONES_CONFLICTOS", "OBSERVACIONES_SECRETARIA_GENERAL"];


  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("licencia_sin_goce", "np", np, field, value, validFields, res);
};

const editarEscuelasDisponibles = async (req, res) => {
  const { np, field, value } = req.body;
  const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad', 'municipio', 'vacante', 'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general' ];
  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("escuelas_disponibles", "np", np, field, value, validFields, res);
};

const editarNombramientosDocentes = async (req, res) => {
  const { np, field, value } = req.body;
  console.log("Datos recibidos en editarPendientes:", req.body);
  const validFields = ['np', 'fecha', 'nombre_del_docente', 'antiguedad', 'telefono', 'centro_clave_trabajo', 'comunidad', 'municipio', 'zona_id', 'sector_id', 'org', 'no_alumnos', 'grado_1', 'grado_2', 'grado_3', 'funcion_docente', 'tipo_nombramiento', 'inicio_movimiento', 'termino_movimiento', 'propuesta', 'subdireccion_academica', 'subdireccion_planeacion', 'subdireccion_administracion', 'usicamm', 'recursos_humanos', 'juridico', 'observaciones_conflictos', 'observaciones_secretaria_general', 'estatus_movimiento'];

  
  
  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("nombramientos", "np", np, field, value, validFields, res);
};

const editarSolicitudes = async (req, res) => {
  const { np, field, value } = req.body;
  const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad', 'municipio', 'vacante', 'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general' ];
  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("solicitudes", "np", np, field, value, validFields, res);
};

const editarInternos = async (req, res) => {
  const { np, field, value } = req.body;
  const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad', 'municipio', 'vacante', 'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general' ];
  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("internos", "np", np, field, value, validFields, res);
};



//============Función Delete Records==========//
const borrarFila = async (req, res) => {
  console.log('Solicitud recibida:', req.body);

  const { np, tabla } = req.body; // Extraemos los parámetros

  if (!np || !tabla) {
    console.error('Faltan parámetros: np y/o tabla.');
    return res.status(400).json({ message: 'El identificador y la tabla son obligatorios.' });
  }

  const tablasPermitidas = ['docentes_disponibles', 'pendientes', 'becas_comision', 'solicitudes_de_personal', 'licencia_sin_goce', 'nombramientos', 'incidencias',];

  if (!tablasPermitidas.includes(tabla)) {
    console.error(`Tabla no permitida: ${tabla}`);
    return res.status(400).json({ message: 'La tabla especificada no está permitida.' });
  }

  try {
    const querySeleccion = `SELECT * FROM ${tabla} WHERE np = ?`;
    console.log(`Consulta SQL: ${querySeleccion}, Valores: [${np}]`);

    const [records] = await pool.query(querySeleccion, [np]);

    if (!records || records.length === 0) {
      console.log('No se encontró el registro.');
      return res.status(404).json({ message: 'El registro no existe.' });
    }

    const queryEliminacion = `DELETE FROM ${tabla} WHERE np = ?`;
    console.log(`Consulta SQL de eliminación: ${queryEliminacion}, Valores: [${np}]`);

    await pool.query(queryEliminacion, [np]);

    console.log('Registro eliminado exitosamente.');
    res.status(200).json({ message: 'Registro eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ message: 'Error al intentar eliminar el registro.' });
  }
};



const vistaNombramientosDocentes = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos para obtener los datos directamente desde la tabla `nombramientos`
    const [nombramientos] = await pool.query(`
      SELECT 
        np, 
        fecha, 
        nombre_docente, 
        antiguedad, 
        telefono, 
        clave_cct, 
        comunidad, 
        municipio, 
        zona, 
        sector, 
        organizacion, 
        no_alumnos, 
        grado_1, 
        grado_2, 
        grado_3, 
        funcion_docente, 
        tipo_nombramiento, 
        inicio_movimiento, 
        termino_movimiento, 
        propuesta, 
        subdireccion_academica, 
        subdireccion_planeacion, 
        subdireccion_administracion, 
        usicamm, 
        recursos_humanos, 
        juridico, 
        observaciones_conflictos, 
        observaciones_secretaria_general, 
        estatus_movimiento
      FROM nombramientos
    `);

    // Verifica si la solicitud es AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // Enviar los datos como JSON
      res.json({ data: nombramientos });
    } else {
      // Renderiza la vista con los datos obtenidos
      res.render('nombramientos-docentes', { nombramientos });
    }
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener datos de nombramientos:', error);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(500).json({ error: 'Error al obtener datos de nombramientos' });
    } else {
      res.status(500).send('Error al obtener datos de nombramientos');
    }
  }
};



const vistaListaPanelAdm = async (req, res) => {
  try {
    const [personal] = await pool.query(`
      SELECT 
        p.personal_id, 
        p.rfc, 
        p.nombre, 
        p.apellido_paterno, 
        p.apellido_materno, 
        p.edad, 
        p.telefono, 
        p.correo, 
        p.imagen,
        c.descripcion AS cargo
      FROM 
        personal p
      LEFT JOIN 
        detalle_laboral dl ON p.personal_id = dl.personal_id
      LEFT JOIN 
        cargos c ON dl.cargo_id = c.cargo_id
    `);

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({ data: personal });
    } else {
      res.render('lista-panel-adm', { personal });
    }
  } catch (error) {
    console.error('Error al obtener datos del panel de administración:', error);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(500).json({ error: 'Error al obtener datos del panel de administración' });
    } else {
      res.status(500).send('Error al obtener datos del panel de administración');
    }
  }
};


//api de lista general

const vistaPerfil = (req, res) => {
  res.render("perfil");
};





const vistaRoles = (req, res) => {
  res.render("roles");
};

const vistaAgregarpersonal = async (req, res) => {
    const sectorId = req.body.sector_id || null;

    const queryCCT = `
      SELECT c.cct_id, c.centro_clave_trabajo AS nombre, cc.clave_nomina 
      FROM ccts c 
      LEFT JOIN cct_claves cc ON c.cct_id = cc.cct_id
    `;
    const querySector = `
      SELECT sector_id, sector_numero 
      FROM sector
      ORDER BY sector_id ASC
    `;
    const queryZona = sectorId
      ? `SELECT zona_id, numero_zona FROM zona WHERE sector_id = ? ORDER BY zona_id ASC`
      : `SELECT zona_id, numero_zona FROM zona ORDER BY zona_id ASC`;
    const queryComunidad = `
      SELECT comunidad_id, nombre FROM comunidad ORDER BY comunidad_id ASC;
    `;
    const queryMunicipio = `
      SELECT municipio_id, nombre FROM municipio ORDER BY municipio_id ASC;
    `;

    try {
        // Ejecuta todas las consultas
        const [resultsCCT] = await pool.query(queryCCT);
        const [resultsSector] = await pool.query(querySector);
        const [resultsZona] = await pool.query(queryZona, [sectorId]);
        const [resultsComunidad] = await pool.query(queryComunidad);
        const [resultsMunicipio] = await pool.query(queryMunicipio);

        // Renderiza la vista con todos los datos obtenidos
        res.render("panelAdm/agregar-personal", {
            ccts: resultsCCT,
            sectores: resultsSector,
            zonas: resultsZona,
            comunidades: resultsComunidad,
            municipios: resultsMunicipio
        });
    } catch (error) {
        console.error("Error al hacer una de las consultas:", error);
        res.status(500).send("Error en una de las consultas de base de datos");
    }
};

const agregarPersonal = async (req, res) => {
  const {
    rfc,
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    sexo,
    curp,
    telefono,
    correo,
    direccion,
    cargo_id,
    tipo_organizacion_id,
    fecha_ingreso,
    fecha_nombramiento,
    tipo_direccion_id,
    plaza_id,
    activo,
    pausa,
    cct_id,
    zona_id,
    sector_id,
    municipio_id,
    comunidad_id,
  } = req.body;

  const imagen = req.file ? req.file.filename : null;

  try {
    await pool.query('START TRANSACTION');

    const insertPersonal = `
      INSERT INTO personal (rfc, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, telefono, correo, direccion, imagen) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultPersonal] = await pool.query(insertPersonal, [
      rfc,
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      telefono,
      correo,
      direccion,
      imagen,
    ]);

    const personal_id = resultPersonal.insertId;

    const selectUbicCcts = `
      SELECT id_relacion FROM ubic_ccts
      WHERE cct_id = ? AND zona_id = ? AND sector_id = ? AND municipio_id = ? AND comunidad_id = ?
    `;
    const [existingUbicCcts] = await pool.query(selectUbicCcts, [
      cct_id,
      zona_id,
      sector_id,
      municipio_id,
      comunidad_id,
    ]);

    let id_relacion;
    if (existingUbicCcts.length > 0) {
      id_relacion = existingUbicCcts[0].id_relacion;
    } else {
      const insertUbicCcts = `
        INSERT INTO ubic_ccts (cct_id, zona_id, sector_id, municipio_id, comunidad_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [resultUbicCcts] = await pool.query(insertUbicCcts, [
        cct_id,
        zona_id,
        sector_id,
        municipio_id,
        comunidad_id,
      ]);
      id_relacion = resultUbicCcts.insertId;
    }
    const insertDetalleLaboral = `
      INSERT INTO detalle_laboral (personal_id, cargo_id, id_relacion, tipo_organizacion_id, fecha_ingreso, fecha_nombramiento, tipo_direccion_id, plaza_id, activo, pausa) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertDetalleLaboral, [
      personal_id,
      cargo_id,
      id_relacion,
      tipo_organizacion_id,
      fecha_ingreso,
      fecha_nombramiento,
      tipo_direccion_id,
      plaza_id,
      activo || 1,
      pausa || 0,
    ]);

    await pool.query('COMMIT');
    res.send("Datos recibidos correctamente");
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error al insertar datos en personal y detalle laboral:", error);
    res.status(500).send("Error al insertar datos en personal y detalle laboral");
  }
};

const vistaEditarPersonal = async (req, res) => {
  const { id } = req.params;

  try {
    const [personalData] = await pool.query(
      `SELECT 
          p.personal_id,
          p.nombre,
          p.apellido_paterno,
          p.apellido_materno,
          p.direccion,
          p.correo,
          p.rfc,
          p.curp,
          p.fecha_nacimiento,
          p.telefono,
          p.sexo,
          p.imagen,
          dl.cargo_id,
          dl.tipo_direccion_id,
          dl.tipo_organizacion_id,
          dl.plaza_id,
          dl.fecha_ingreso,
          dl.fecha_nombramiento,
          dl.activo,
          uc.zona_id,
          uc.sector_id,
          uc.municipio_id,
          uc.comunidad_id,
          uc.cct_id
       FROM personal p
       LEFT JOIN detalle_laboral dl ON p.personal_id = dl.personal_id
       LEFT JOIN ubic_ccts uc ON dl.id_relacion = uc.id_relacion
       WHERE p.personal_id = ?
      `,
      [id]
    );

    // Verificar si se encontró el personal
    if (personalData.length === 0) {
      return res.status(404).send("Personal no encontrado");
    }

    // Detectar si la solicitud es AJAX
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      // Renderizar solo el formulario parcial sin layout
      return res.render("partials/form-editar-personal", { layout: false, personal: personalData[0] });
    }

    // Renderizar la vista completa con layout
    return res.render("editar-personal", { personal: personalData[0] });
  } catch (error) {
    console.error("Error al obtener los datos del personal:", error);
    res.status(500).send("Error al cargar la vista de edición");
  }
};
// Función para borrar fila
// Lista de tablas permitidas para prevenir inyecciones SQL




// Función para obtener la lista de empleados
const obtenerPersonal = async (req, res) => {
  try {
    const [results] = await pool.query(`
     SELECT 
        p.personal_id,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.imagen, -- Asegúrate de que aquí esté el campo imagen
        p.direccion, -- Campo agregado para la dirección
        p.telefono,  -- Campo agregado para el teléfono
        p.correo,    -- Campo agregado para el correo
        c.descripcion AS cargo
      FROM 
        personal AS p
      LEFT JOIN 
        detalle_laboral AS dl ON p.personal_id = dl.personal_id
      LEFT JOIN 
        cargos AS c ON dl.cargo_id = c.cargo_id
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener el personal:", error);
    res.status(500).json({ message: "Error al obtener la lista de personal" });
  }
};

const obtenerDetallePersonal  = async (req, res) => {
  const { personal_id} =  req.params;

  try {
    const [results] = await pool.query(`
      SELECT 
        p.personal_id,
        p.rfc,
        p.nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.fecha_nacimiento,
        p.edad,
        p.sexo,
        p.curp,
        p.telefono,
        p.correo,
        p.direccion,
        p.imagen,
        dl.fecha_ingreso,
        dl.fecha_nombramiento,
        dl.activo,
        dl.pausa,
        c.descripcion AS cargo,
        t_org.descripcion AS tipo_organizacion,
        t_dir.descripcion AS tipo_direccion,
        pl.plaza AS plaza,
        z.numero_zona AS zona,
        s.sector_numero AS sector,
        m.nombre AS municipio,
        cdt.nombre AS comunidad,
        cct.centro_clave_trabajo AS clave_cct -- Agregar la clave CCT
    FROM 
        personal AS p
    LEFT JOIN detalle_laboral AS dl ON p.personal_id = dl.personal_id
    LEFT JOIN cargos AS c ON dl.cargo_id = c.cargo_id
    LEFT JOIN tipo_organizacion AS t_org ON dl.tipo_organizacion_id = t_org.tipo_organizacion_id
    LEFT JOIN tipo_direccion AS t_dir ON dl.tipo_direccion_id = t_dir.tipo_direccion_id
    LEFT JOIN plazas AS pl ON dl.plaza_id = pl.plaza_id
    LEFT JOIN ubic_ccts AS u ON dl.id_relacion = u.id_relacion
    LEFT JOIN zona AS z ON u.zona_id = z.zona_id
    LEFT JOIN sector AS s ON u.sector_id = s.sector_id
    LEFT JOIN municipio AS m ON u.municipio_id = m.municipio_id
    LEFT JOIN comunidad AS cdt ON u.comunidad_id = cdt.comunidad_id
    LEFT JOIN ccts AS cct ON u.cct_id = cct.cct_id -- JOIN con la tabla de CCTs
    WHERE p.personal_id = ?
        `, [personal_id]);

        res.json(results[0]);
  } catch (err) {
    console.error("Error al obtener los datos del personal:", error);
    res.status(500).json({message: "Error al obtener detalles del personal"});
  }
};

module.exports = {
  vistasController,

  editarPendientes,
  editarBecas,  
  editarDocente,
  editarPendientes,
  editarBecas,
  editarSalud,
  editarSolicitudesPersonal,
  editarIncidencias,
  editarLicenciaSinGoce,
  editarEscuelasDisponibles,
  editarNombramientosDocentes,
  editarSolicitudes,
  editarInternos,

  vistaAgregarpersonal,
  agregarPersonal,
  vistaEditarPersonal,
  obtenerPersonalTotal,
  obtenerSalud,
  obtenerSolicitudesPersonal,
  obtenerIncidencias,
  obtenerLicenciaSinGoce,
  obtenerEscuelasDisponibles,
  obtenerNombramientosDocentes,
  obtenerSolicitudes,
  obtenerInternos,
  obtenerBecas,
  obtenerPersonal,
  obtenerPendientes,
  obtenerDetallePersonal,
  obtenerListaGeneral,
  obtenerDocentesDisponibles,
  borrarFila,
  actualizarRegistro

};
