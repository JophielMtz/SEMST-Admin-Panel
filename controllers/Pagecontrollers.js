const pool = require("../src/config/db");

const vistaPrincipal = (req, res) => {
  res.render("home");
};

const vistaReviciones = (req, res) => {
  res.render("revisiones");
};

const vistaPendientes = async (req, res) => {
  try {
    const [pendientes] = await pool.query(`
      SELECT 
        np, 
        fecha, 
        estatus, 
        tramite, 
        departamento AS titulo, 
        observaciones_conflictos, 
        observaciones_secretaria_general
      FROM pendientes
    `);

    // Verifica si la solicitud es AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // Enviar los datos como JSON
      res.json({ data: pendientes });
    } else {
      // Renderiza la vista con los datos obtenidos
      res.render('pendientes', { pendientes });
    }
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener datos de pendientes:', error);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(500).json({ error: 'Error al obtener datos de pendientes' });
    } else {
      res.status(500).send('Error al obtener datos de pendientes');
    }
  }
};


const postPendientes = (req, res) => {
};

const vistaDocentesDisponibles = async (req, res) => {
  res.render("docentes-disponibles");
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

// const actualizarDocente = async (req, res) => {
//   const { personal_id, field, value } = req.body;

//   // Validar que los datos necesarios están presentes
//   if (!personal_id || !field || value === undefined) {
//     return res.status(400).json({ message: "Datos insuficientes." });
//   }

//   // Lista de campos válidos para evitar inyección SQL
//   const validFields = [
//     'nombre_docente', 'fecha', 'estatus', 'situacion',
//     'antiguedad', 'municipio_sale', 'comunidad_sale',
//     'cct_sale', 'estatus_cubierta', 'observaciones',
//   ];

//   if (!validFields.includes(field)) {
//     return res.status(400).json({ message: "Campo inválido." });
//   }

//   try {
//     // Construir la consulta de forma segura
//     const query = `UPDATE docentes_disponibles SET ${field} = ? WHERE personal_id = ?`;
//     const [result] = await pool.query(query, [value, personal_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Registro no encontrado." });
//     }

//     res.json({ message: "Registro actualizado correctamente." });
//   } catch (error) {
//     console.error("Error al actualizar docente:", error);
//     res.status(500).json({ message: "Error interno del servidor." });
//   }
// };

const editarDocente = async (req, res) => {
  const { personal_id, field, value } = req.body;

  if (!personal_id || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requiere personal_id, field y value." });
  }

  // Lista de campos válidos para evitar inyección SQL
  const validFields = [
    'nombre_docente', 'fecha', 'estatus', 'situacion',
    'antiguedad', 'municipio_sale', 'comunidad_sale',
    'cct_sale', 'estatus_cubierta', 'observaciones',
  ];

  if (!validFields.includes(field)) {
    return res.status(400).json({ message: "Campo inválido." });
  }

  try {
    // Construcción dinámica de la consulta
    const query = `UPDATE docentes_disponibles SET ?? = ? WHERE personal_id = ?`;
    const [result] = await pool.query(query, [field, value, personal_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }

    res.json({ message: "Registro actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar docente:", error);
    res.status(500).json({ message: "Error interno del servidor." });
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


const vistaLicenciasSinGoce = async (req, res) => {
  try {
    // Simulación de datos vacíos para preparar la lógica (puedes reemplazarlo más tarde)
    const [licenciasSinGoce] = await pool.query(`
      SELECT 
        np, 
        fecha_registro, 
        fecha_documento,
        nombre_docente, 
        tipo_movimiento, 
        cct, 
        comunidad, 
        municipio, 
        organizacion, 
        justifica, 
        inicio_movimiento, 
        termino_movimiento, 
        diagnostico, 
        aviso, 
        vacante, 
        observaciones, 
        antiguedad, 
        telefono, 
        observaciones_conflictos,
        observaciones_secretaria_general
        FROM licencia_sin_goce
    `);

    // Verifica si la solicitud es AJAX
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // Enviar los datos como JSON
      res.json({ data: licenciasSinGoce });
    } else {
      // Renderiza la vista con los datos obtenidos
      res.render('licencias-sin-goce', { licenciasSinGoce });
    }
  } catch (error) {
    // Manejo de errores
    console.error('Error al renderizar la vista de licencias sin goce:', error);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(500).json({ error: 'Error al renderizar la vista de licencias sin goce' });
    } else {
      res.status(500).send('Error al renderizar la vista de licencias sin goce');
    }
  }
};


const vistaIncidencias = (req, res) => {
  res.render("incidencias");
};

const vistaCalendario = (req, res) => {
  res.render("calendario");
};

const vistaSolicitudesGenerales = (req, res) => {
  res.render("solicitudes-generales");
};

const vistaCambio = (req, res) => {
  res.render("cambio");
};

const vistaSolicitudesPersonal = (req, res) => {
  res.render("solicitudes-personal");
};

const vistaSalud = (req, res) => {
  res.render("salud");
};

const vistaBecaComision = (req, res) => {
  res.render("beca-comision");
};

const vistaApoyoLentes = (req, res) => {
  res.render("apoyo-lentes");
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


const vistaListaGeneral = async (req, res) => {
  res.render("lista-general");
};
//api de lista general
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

// const vistaListaGeneral = async (req, res) => {
//   try {
//     const [personal] = await pool.query(`
//       SELECT 
//         p.personal_id, p.rfc, p.nombre, p.apellido_paterno, 
//         p.apellido_materno, p.edad, p.telefono, p.correo, 
//         c.descripcion AS cargo
//       FROM personal p
//       LEFT JOIN detalle_laboral dl ON p.personal_id = dl.personal_id
//       LEFT JOIN cargos c ON dl.cargo_id = c.cargo_id
//     `);

//     // Verifica si la solicitud es AJAX (json)
//     if (req.xhr || req.headers.accept.indexOf('json') > -1) {
//       return res.json({ data: personal });
//     }

//     // Si no es AJAX, renderiza la vista "lista-general" con los datos
//     res.render('lista-general', { personal });
//   } catch (error) {
//     console.error('Error al obtener datos del personal:', error);
//     res.status(500).json({ error: 'Error al obtener datos de la lista general' });
//   }
// };


const vistaPerfil = (req, res) => {
  res.render("perfil");
};

const vistaListaFederal = (req, res) => {
  res.render("lista-federal");
};

const vistaInfoPersonal = (req, res) => {
  res.render("info-personal");
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
        res.render("agregar-personal", {
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
  vistaPrincipal,
  vistaReviciones,
  vistaPendientes,
  vistaDocentesDisponibles,
  editarDocente,
  vistaNombramientosDocentes,
  vistaLicenciasSinGoce,
  vistaIncidencias,
  vistaCalendario,
  vistaSolicitudesGenerales,
  vistaCambio,
  vistaSolicitudesPersonal,
  vistaSalud,
  vistaBecaComision,
  vistaApoyoLentes,
  vistaListaGeneral,
  vistaListaPanelAdm,
  vistaPerfil,
  vistaListaFederal,
  vistaInfoPersonal,
  vistaAgregarpersonal,
  vistaRoles,
  agregarPersonal,
  vistaEditarPersonal,
  obtenerPersonal,
  obtenerDetallePersonal,
  obtenerListaGeneral,
  obtenerDocentesDisponibles

};
