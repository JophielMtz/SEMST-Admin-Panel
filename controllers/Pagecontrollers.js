const pool = require("../src/config/db");

//=========Gets de las APIS==========//
const obtenerPersonal = async (req, res) => {
  const personalId = req.params.personal_id;

  console.log('Recibiendo solicitud para obtener personal con ID:', personalId);

  try {
    // Usar '?' en lugar de '$1' para MySQL
    const result = await pool.query('SELECT * FROM semstdb.personal WHERE personal_id = ?', [personalId]);

    console.log('Resultado de la consulta:', result[0]);

    if (result[0].length === 0) {
      console.log('Personal no encontrado para ID:', personalId);
      return res.status(404).json({ message: 'Personal no encontrado' });
    }

    res.json(result[0][0]); // Devolver los datos del primer resultado

  } catch (error) {
    console.error('Error al obtener el personal:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener el personal' });
  }
};

const obtenerPendientes = async (req, res) => {
  try {
    // Obtén las columnas que comienzan con "np_"
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'pendientes' 
        AND COLUMN_NAME LIKE 'np_%';
    `);

    // Extrae los nombres de las columnas
    const columnNames = columns.map(row => row.COLUMN_NAME);

    if (columnNames.length === 0) {
      throw new Error("No se encontraron columnas con prefijo 'np_' en la tabla pendientes.");
    }

    // Tablas con mapeos personalizados
    const mapeoTablas = {
      "np_licencia_sin_goce": "licencias-sin-goce",
      "np_nombramientos": "nombramientos-docentes",
      "np_solicitudes_de_personal": "solicitudes-personal",
      "np_becas_comision": "beca-comision",       
      "np_solicitudes_de_cambio": "cambio",
      "np_salud_inseguridad": "salud",
      "np_escuelas_disponibles": "escuelas-disponibles",
      "np_internos": "internos",
      "np_incidencias": "incidencias",
      "np_solicitudes_generales": "solicitudes-generales",
      "np_docentes_disponibles": "docentes-disponibles",
           
    };

    // Log para verificar las columnas y el mapeo
    console.log("Columnas detectadas:", columnNames);
    console.log("Mapeo personalizado:", mapeoTablas);

    // Genera el CASE dinámico con lógica estándar y mapeos personalizados
    const caseStatements = columnNames
      .map(col => {
        // Verifica si la columna está en el mapeo personalizado
        if (mapeoTablas[col]) {
          console.log(`Usando mapeo personalizado para columna: ${col} -> ${mapeoTablas[col]}`);
          return `WHEN ${col} IS NOT NULL THEN '${mapeoTablas[col]}'`;
        }
        // Lógica estándar si no hay un mapeo personalizado
        console.log(`Usando lógica estándar para columna: ${col}`);
        return `WHEN ${col} IS NOT NULL THEN '${col.replace('np_', '').replace('_', '-')}'`;
      })
      .join(' ');

    // Log para verificar el CASE generado
    console.log("CASE generado:", caseStatements);

    // Genera el COALESCE dinámico
    const coalesceColumns = `COALESCE(${columnNames.join(', ')}) AS np`;

    // Crea la consulta final
    const query = `
      SELECT
        ${coalesceColumns},
        fecha,
        tipo_proceso,
        estatus,
        tramite,
        departamento,
        observaciones_conflictos,
        observaciones_secretaria_general,
        CASE ${caseStatements} ELSE 'desconocido' END AS tabla_origen
      FROM pendientes;
    `;

    // Log para verificar la consulta generada
    console.log("Consulta generada:", query);

    // Ejecuta la consulta generada
    const [results] = await pool.query(query);

    // Devuelve los resultados en formato JSON
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
        CONCAT(p.apellido_paterno, ' ', p.apellido_materno, ' ', p.nombre) AS nombre_docente,
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
        dd.observaciones,
        dd.observaciones_conflictos,
        p.telefono
      FROM
        docentes_disponibles dd
      LEFT JOIN
        personal p ON dd.personal_id = p.personal_id
      WHERE
        dd.estatus != 'Atendido';  -- Excluir registros "Atendido"
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener el personal:", error);
    res.status(500).json({ message: "Error al obtener la lista de personal" });
  }
};

const obtenerSolicitudesDeCambio = async (req, res) => {
  try {
    const [results] = await pool.query(`
    SELECT
    np,
    p.personal_id,
    fecha,
    sc.estatus AS estatus, -- Estatus de la solicitud
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_docente,
    sc.observaciones AS observaciones, -- Observaciones de la solicitud
    dl.antiguedad AS antiguedad, -- Antigüedad calculada de detalle laboral
    p.telefono AS telefono, -- Teléfono del docente
    (SELECT cct.centro_clave_trabajo
     FROM ubic_ccts uc
     JOIN ccts cct ON uc.cct_id = cct.cct_id
     WHERE uc.id_relacion = dl.id_relacion) AS cct_sale,
    (SELECT c.nombre
     FROM comunidad c
     JOIN ubic_ccts uc ON c.comunidad_id = uc.comunidad_id
     WHERE uc.id_relacion = dl.id_relacion) AS comunidad_sale,
    (SELECT m.nombre
     FROM municipio m
     JOIN ubic_ccts uc ON m.municipio_id = uc.municipio_id
     WHERE uc.id_relacion = dl.id_relacion) AS municipio_sale,
    (SELECT cct_entra.centro_clave_trabajo
     FROM ubic_ccts uc
     JOIN ccts cct_entra ON uc.cct_id = cct_entra.cct_id
     WHERE uc.id_relacion = sc.detalle_laboral_id) AS cct_entra,
    (SELECT c_entra.nombre
     FROM comunidad c_entra
     JOIN ubic_ccts uc ON c_entra.comunidad_id = uc.comunidad_id
     WHERE uc.id_relacion = sc.detalle_laboral_id) AS comunidad_entra,
    (SELECT m_entra.nombre
     FROM municipio m_entra
     JOIN ubic_ccts uc ON m_entra.municipio_id = uc.municipio_id
     WHERE uc.id_relacion = sc.detalle_laboral_id) AS municipio_entra, -- Municipio de entrada
    sc.observaciones AS observaciones_final -- Observaciones finales (duplicadas si necesario)
FROM
    solicitudes_de_cambio sc -- Tabla de solicitudes de cambio
LEFT JOIN
    personal p ON sc.personal_id = p.personal_id -- Relación con personal
LEFT JOIN
    detalle_laboral dl ON sc.detalle_laboral_id = dl.detalle_laboral_id
LEFT JOIN
    ubic_ccts uc ON dl.id_relacion = uc.id_relacion;
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
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_docente,
    p.edad,
    p.telefono,
    p.correo,
    p.imagen,
    c.descripcion AS cargo,
    to.descripcion AS tipo_organizacion
FROM
    personal p
LEFT JOIN
    detalle_laboral dl ON p.personal_id = dl.personal_id
LEFT JOIN
    cargos c ON dl.cargo = c.cargo
LEFT JOIN
    tipo_organizacion to ON p.tipo_organizacion = to.tipo_organizacion;

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
    fecha,
    personal_id,
    nombre_docente,
    cct_sale,
    comunidad_sale,
    municipio_sale,
    vacante,
    cubre,
    antiguedad,
    telefono,
    observaciones,
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
    si.np,
    si.personal_id,
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_docente,
    si.fecha,
    si.estatus,
    si.situacion,
    si.diagnostico,
    si.fecha_inicio,
    si.fecha_termino,
    si.observaciones,
    si.municipio_sale,
    si.comunidad_sale,
    si.cct_sale,
    si.funcion_docente,
    si.municipio_entra,
    si.comunidad_entra,
    si.cct_entra,
    si.estatus_cubierta,
    si.observaciones_conflictos
FROM
    salud_inseguridad si
JOIN
    personal p ON si.personal_id = p.personal_id;



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
    np , fecha,
    estatus, escuela,
    c.nombre AS "comunidad",
    m.nombre AS "municipio",
    observaciones AS "observaciones",
    cct.centro_clave_trabajo,
    m.nombre AS "MUNICIPIO",
    sp.observaciones AS "OBSERVACIONES",
    u.cct_id AS "Clave CCT",
    com.nombre AS "COMUNIDAD CCT",
    mun.nombre AS "MUNICIPIO CCT",
    u.zona_id,
    u.sector_id,
    sp.tipo_organizacion,
    sp.no_alumnos,
    sp.grado_1,
    sp.grado_2,
    sp.grado_3,
    sp.funcion_docente,
    sp.tipo_nombramiento,
    sp.inicio_movimiento,
    sp.termino_movimiento,
    sp.propuesta,
    sp.subdireccion_academica,
    sp.subdireccion_planeacion,
    sp.subdireccion_administracion,
    sp.usicamm,
    sp.recursos_humanos,
    sp.juridico,
    sp.observaciones_conflictos,
    sp.observaciones_secretaria_general,
    sp.estatus_movimiento

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
    p.personal_id,
    i.np,
    i.fecha,
    i.estatus,
    i.escuela,
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_docente,
    dl.antiguedad,
    p.telefono,
    cct.centro_clave_trabajo,
    com.nombre AS comunidad,
    mun.nombre AS municipio,
    i.situacion,
    i.observaciones,
    u.zona_id,
    u.sector_id,
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
    i.estatus_movimiento,
    i.tipo_organizacion
FROM
    incidencias i
JOIN
    personal p ON i.personal_id = p.personal_id
LEFT JOIN
    detalle_laboral dl ON i.personal_id = dl.personal_id AND dl.activo = 1
LEFT JOIN
    ubic_ccts u ON dl.id_relacion = u.id_relacion
LEFT JOIN
    ccts cct ON u.cct_id = cct.cct_id
LEFT JOIN
    comunidad com ON u.comunidad_id = com.comunidad_id
LEFT JOIN
    municipio mun ON u.municipio_id = mun.municipio_id;

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
      p.personal_id,
      lsg.fecha_registro,
      lsg.fecha_documento,
      CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS "nombre_docente",
      lsg.tipo_movimiento,
      ccts.centro_clave_trabajo AS "cct_sale",
      com.nombre AS "comunidad_sale",
      mun.nombre AS "municipio_sale",
      lsg.tipo_organizacion,
      lsg.justifica AS "JUSTIFICA",
      lsg.inicio_movimiento,
      lsg.termino_movimiento,
      lsg.diagnostico AS "DIAGNOSTICO",
      lsg.aviso AS "AVISO",
      lsg.vacante AS "VACANTE",
      lsg.observaciones AS "OBSERVACIONES",
      dl.antiguedad,
      p.telefono,
      lsg.observaciones_conflictos,
      lsg.observaciones_secretaria_general
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
        detalle_laboral dl ON lsg.personal_id = dl.personal_id;



    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista licencia sin goce:", error);
    res.status(500).json({ message: "Error al obtener lista licencia sin goce" });
  }
};

const obtenerListaPanelAdministrador = async (req, res) => {
  try {
    const [results] = await pool.query(`
  SELECT
    p.personal_id,
    p.rfc,
    p.curp,
    CONCAT(IFNULL(p.nombre, ''), ' ', IFNULL(p.apellido_paterno, ''), ' ', IFNULL(p.apellido_materno, '')) AS nombre,
    p.edad,
    p.fecha_nacimiento,
    p.telefono,
    p.correo,
    p.imagen,
    IFNULL(dl.cargo, 'No asignado') AS cargo,
    CASE
        WHEN dl.antiguedad_detalle LIKE '%años%' THEN 
            CONCAT(SUBSTRING_INDEX(dl.antiguedad_detalle, ' años', 1), ' años')
        WHEN dl.antiguedad_detalle LIKE '%meses%' THEN 
            CONCAT(SUBSTRING_INDEX(SUBSTRING_INDEX(dl.antiguedad_detalle, ' meses', 1), ', ', -1), ' meses')
        ELSE 
            'Sin antigüedad'
    END AS antiguedad_compacta,
    dl.tipo_organizacion,
    dl.z_e AS z_e,
    dl.tipo_entidad,
    dl.tipo_direccion,
    dl.plaza_id,
    dl.nombramiento,
    dl.grado,
     IFNULL(c.centro_clave_trabajo, 'Sin CCT') AS nombre_cct,
    IFNULL(m.nombre, 'Sin municipio') AS municipio,
    IFNULL(co.nombre, 'Sin comunidad') AS comunidad,
    IFNULL(z.numero_zona, 'Sin zona') AS zona,
    IFNULL(s.sector_numero, 'Sin sector') AS sector
FROM
    personal p
LEFT JOIN
    detalle_laboral dl ON p.personal_id = dl.personal_id
LEFT JOIN
    ubic_ccts u ON dl.id_relacion = u.id_relacion
LEFT JOIN
    ccts c ON u.cct_id = c.cct_id
LEFT JOIN
    municipio m ON u.municipio_id = m.municipio_id
LEFT JOIN
    comunidad co ON u.comunidad_id = co.comunidad_id
LEFT JOIN
    zona z ON u.zona_id = z.zona_id  -- Agregando la tabla zona
LEFT JOIN
    sector s ON u.sector_id = s.sector_id;
    `);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista licencia sin goce:", error);
    res.status(500).json({ message: "Error al obtener personal del panel adm " });
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
    p.personal_id,
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_docente,
    n.antiguedad,
    p.telefono,
    c.centro_clave_trabajo, 
    com.nombre AS comunidad,
    mun.nombre AS municipio,
    u.zona_id,
    u.sector_id,
    n.tipo_organizacion,
    n.no_alumnos,
    n.grado_1,
    n.grado_2,
    n.grado_3,
    n.funcion_docente,
    n.tipo_nombramiento,
    n.inicio_movimiento,
    n.termino_movimiento,
    n.propuesta,
    n.observaciones,
    n.subdireccion_academica,
    n.subdireccion_administracion,
    n.subdireccion_planeacion,
    n.estatus_movimiento,
    n.observaciones_conflictos,
    n.usicamm,
    n.recursos_humanos,
    n.juridico
    
FROM
    nombramientos n
JOIN
    personal p ON n.personal_id = p.personal_id
JOIN
    detalle_laboral dl ON p.personal_id = dl.personal_id
JOIN
    ubic_ccts u ON dl.id_relacion = u.id_relacion
LEFT JOIN
    comunidad com ON u.comunidad_id = com.comunidad_id
LEFT JOIN
    municipio mun ON u.municipio_id = mun.municipio_id
LEFT JOIN
    ccts c ON u.cct_id = c.cct_id  -- JOIN con ccts para obtener 'centro_clave_trabajo'




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
    const [results] = await pool.query(`SELECT np, fecha, estatus, tramite, departamento, observaciones_conflictos, observaciones_secretaria_general FROM internos`);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista internos:", error);
    res.status(500).json({ message: "Error al obtener lista internos" });
  }
};


const obtenerSolicitudesGenerales = async (req, res) => {
  try {
    const [results] = await pool.query(`
   SELECT
    p.personal_id,  -- Alias "p" para personal_id
    sg.np,
    sg.fecha,
    CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) AS nombre_docente,
    sg.estatus,
    sg.tipo_solicitud,
    sg.fecha_documento,
    sg.observaciones,
    sg.departamento,
    p.telefono,
    c.centro_clave_trabajo,
    com.nombre AS comunidad,
    m.nombre AS municipio,
    z.numero_zona AS zona_id,
    s.sector_numero AS sector_id,
    sg.tipo_organizacion,
    sg.no_alumnos,
    sg.grado_1,
    sg.grado_2,
    sg.grado_3,
    sg.funcion_docente,
    sg.inicio_movimiento,
    sg.termino_movimiento,
    sg.propuesta,
    sg.observaciones_secretaria_general
FROM
    solicitudes_generales sg
JOIN
    personal p ON sg.personal_id = p.personal_id  -- Alias "p" para la tabla "personal"
LEFT JOIN
    detalle_laboral dl ON sg.detalle_laboral_id = dl.detalle_laboral_id
LEFT JOIN
    ubic_ccts uc ON dl.id_relacion = uc.id_relacion
LEFT JOIN
    ccts c ON uc.cct_id = c.cct_id
LEFT JOIN
    comunidad com ON uc.comunidad_id = com.comunidad_id
LEFT JOIN
    municipio m ON uc.municipio_id = m.municipio_id
LEFT JOIN
    zona z ON uc.zona_id = z.zona_id
LEFT JOIN
    sector s ON uc.sector_id = s.sector_id;


    `);



    res.json(results);
  } catch (error) {
    console.error("Error al obtener lista solicitudes generales:", error);
    res.status(500).json({ message: "Error al obtener lista internos" });
  }
};

const obtenerUbicCCTs = async (req, res) => {
  const { sector_id } = req.query;

  try {
    if (!sector_id) {
      const querySectores = `
        SELECT sector_id, numero_sector
        FROM sector
      `;

      const [sectores] = await pool.query(querySectores);

      if (sectores.length === 0) {
        return res.status(404).json({ message: 'No se encontraron sectores.' });
      }

      return res.json(sectores);
    } else {
      const queryZonas = `
        SELECT zona_id, numero_zona
        FROM zona
        WHERE sector_id = ?
      `;

      const [zonas] = await pool.query(queryZonas, [sector_id]);

      if (zonas.length === 0) {
        return res.status(404).json({ message: 'No se encontraron zonas para el sector especificado.' });
      }

      return res.json(zonas);
    }
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos.' });
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
  const { personal_id, field, value, datosCompletos } = req.body;

  const validFields = [
    'nombre_docente', 'fecha', 'estatus', 'situacion',
    'antiguedad', 'municipio_sale', 'comunidad_sale', 'municipio_entra',
    'comunidad_entra', 'cct_entra', 'cct_sale', 'estatus_cubierta',
    'observaciones',
  ];

  if (!personal_id) {
    return res.status(400).json({ message: "Datos insuficientes. Se requiere el ID del personal." });
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Modo 1: Actualizar un campo individualmente
    if (field && value !== undefined) {
      if (!validFields.includes(field)) {
        return res.status(400).json({ message: "Campo inválido." });
      }

      const updateDocentesQuery = `UPDATE docentes_disponibles SET ?? = ? WHERE personal_id = ?`;
      await connection.query(updateDocentesQuery, [field, value, personal_id]);
    }

    // Modo 2: Actualizar con un objeto completo
    if (datosCompletos) {
      const { municipio_entra, comunidad_entra, cct_entra, ...otrosCampos } = datosCompletos;

      // Validar y actualizar cada campo de datosCompletos en docentes_disponibles
      for (const [key, value] of Object.entries(otrosCampos)) {
        if (validFields.includes(key) && value !== undefined) {
          const updateDocentesQuery = `UPDATE docentes_disponibles SET ?? = ? WHERE personal_id = ?`;
          await connection.query(updateDocentesQuery, [key, value, personal_id]);
        }
      }

      // Verificar si los valores necesarios están completos
      if (municipio_entra && comunidad_entra && cct_entra) {
        const [relacionRows] = await connection.query(
          `
          SELECT u.id_relacion
          FROM ubic_ccts u
          JOIN municipio m ON u.municipio_id = m.municipio_id
          JOIN comunidad co ON u.comunidad_id = co.comunidad_id
          JOIN ccts c ON u.cct_id = c.cct_id
          WHERE m.nombre = ? AND co.nombre = ? AND c.centro_clave_trabajo = ?
          LIMIT 1
          `,
          [municipio_entra, comunidad_entra, cct_entra]
        );

        if (relacionRows.length === 0) {
          throw new Error(`No se encontró un id_relacion válido para municipio "${municipio_entra}", comunidad "${comunidad_entra}" y CCT "${cct_entra}".`);
        }

        const id_relacion = relacionRows[0].id_relacion;

        // Actualizar detalle_laboral con el nuevo id_relacion
        const updateDetalleQuery = `
          UPDATE detalle_laboral
          SET id_relacion = ?
          WHERE personal_id = ? AND activo = 1;
        `;
        await connection.query(updateDetalleQuery, [id_relacion, personal_id]);
      } else {
        console.log("Faltan valores para calcular el id_relacion.");
      }
    }

    await connection.commit();
    res.json({ message: "Registro actualizado correctamente." });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error al actualizar registro:", error.message);
    res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

const editarCCTS = async (req, res) => {
  const { municipio_id, comunidad_id, cct_id } = req.body;

  if (!municipio_id || !comunidad_id || !cct_id) {
    return res.status(400).json({ message: "Faltan datos para calcular id_relacion." });
  }

  try {
    // Consulta para obtener el id_relacion
    const [rows] = await pool.query(
      `
      SELECT id_relacion
      FROM ubic_ccts
      WHERE municipio_id = ? AND comunidad_id = ? AND cct_id = ?
      LIMIT 1
      `,
      [municipio_id, comunidad_id, cct_id]
    );

    if (rows.length > 0) {
      // Si se encuentra, devolver id_relacion
      return res.json({ id_relacion: rows[0].id_relacion });
    } else {
      // Si no se encuentra, devolver mensaje de error
      return res.status(404).json({ message: "No se encontró un id_relacion válido." });
    }
  } catch (error) {
    // Manejo de errores internos
    console.error("Error al buscar id_relacion:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const editarBecas = async (req, res) => {
  // Log para verificar los datos recibidos en el cuerpo de la solicitud
  console.log("Datos recibidos en editarBecaComision:", req.body);

  const { np, field, value } = req.body;

  const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad',  'municipio', 'vacante',
    'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general', 'observaciones'
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
  const validFields = [ 'nombre_docente', 'fecha', 'estatus', 'situacion',
    'antiguedad', 'municipio_sale', 'comunidad_sale', 'municipio_entra', 'diagnostico',
    'comunidad_entra', 'cct_entra', 'funcion_docente', 'cct_sale', 'estatus_cubierta',
    'observaciones', ];
  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("salud_inseguridad", "np", np, field, value, validFields, res);
};

const editarSolicitudesDeCambio = async (req, res) => {
  console.log("Datos recibidos en editarPendientes:", req.body);
  const { np, field, value } = req.body;

  const validFields = [
    'np','fecha', 'estatus', 'situacion', 'antiguedad',  'municipio_entra', 'comunidad_entra', 'cct_entra',  'observaciones',
  ];

  return actualizarRegistro("solicitudes_de_cambio", "np", np, field, value, validFields, res);
};

const editarSolicitudesPersonal = async (req, res) => {
  console.log("Datos recibidos en editarPendientes:", req.body);
  const { np, field, value } = req.body;
  const validFields = ["np", "fecha", "estatus", "escuela", "comunidad", "municipio", 
    "observaciones", "clave cct", "comunidad cct", "municipio cct", "zona", "sector", 
    "no_alumnos", "grado_1", "grado_2", "grado_3", "funcion_docente","tipo_organizacion", "tipo_de_nombramiento",
    "inicio del movimiento", "termino del movimiento", "propuesta", "subdireccion_academica", "subdireccion_planeacion", 
    "subdireccion_administracion", "usicamm", "recursos_humanos", "juridico", "observaciones_conflictos", "observaciones_secretaria_general", "estatus_movimiento"];


  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("solicitudes_de_personal", "np", np, field, value, validFields, res);
};

const editarSolicitudesGenerales = async (req, res) => {
  console.log("Datos recibidos en editarPendientes:", req.body);
  const { np, field, value } = req.body;
  const validFields = ['np', 'fecha', 'nombre_del_docente', 'estatus', 'tipo_solicitud', 
    'fecha_documento', 'observaciones', 'departamento', 'edad', 'telefono', 'centro_clave_trabajo', 
    'comunidad', 'municipio', 'zona_id', 'sector_id', 'tipo_organizacion', 'no_alumnos', 'grado_1', 
    'grado_2', 'grado_3','funcion_docente', 'inicio_movimiento', 'termino_movimiento', 'propuesta', 
    'observaciones_secretaria_general'];

  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("solicitudes_generales", "np", np, field, value, validFields, res);
};


const editarIncidencias = async (req, res) => {
  const { np, field, value } = req.body;
  const validFields = [ "zona_id", "sector_id", "tipo_organizacion", "no_alumnos", "grado_1", "escuela",
     "grado_2", "grado_3", "funcion_docente", "tipo_nombramiento", "inicio_movimiento", "termino_movimiento", 
     "propuesta", "subdireccion_academica", "subdireccion_planeacion", "subdireccion_administracion", "usicamm", 
     "recursos_humanos", "juridico", "observaciones_conflictos", "observaciones_secretaria_general", "estatus_movimiento",
      "situacion", "observaciones", "org"];


  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("incidencias", "np", np, field, value, validFields, res);
};

const editarLicenciaSinGoce = async (req, res) => {
  console.log("Datos recibidos en editarLicenciaSinGoce:", req.body);
  const { np, field, value } = req.body;
  const validFields = ["NP", "FECHA_REGISTRO", "FECHA_DOCUMENTO", "PERSONAL_ID", "tipo_movimiento",
     "CCT", "COMUNIDAD", "MUNICIPIO", "tipo_organizacion", "JUSTIFICA", "INICIO_MOVIMIENTO", "TERMINO_MOVIMIENTO",
      "DIAGNOSTICO", "AVISO", "VACANTE", "OBSERVACIONES", "ANTIGUEDAD", "TELEFONO", "observaciones_conflictos", 
      "OBSERVACIONES_SECRETARIA_GENERAL"];


  if (!np || !field || value === undefined) {
    return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
  }
  return actualizarRegistro("licencia_sin_goce", "np", np, field, value, validFields, res);
};

const editarListaPanelAdministrador = async (req, res) => {
  console.log("Datos recibidos en listaPanelAdm:", req.body);

  const { personal_id, field, value } = req.body;

  // Mapeo entre el nombre del cargo y el cargo
  const cargoMapping = {
    "Director": 1,
    "Subdirector": 2,
    "Docente": 3,
    "Auxiliar Administrativo": 4,
    "Auxiliar de Servicios": 5,
    "Docente de apoyo": 6,
    "Docente/ATP": 7,
    "Velador": 8
  };

  // Definir los campos válidos para cada tabla
  const validFieldsPersonal = ["personal_id", "nombre", "telefono", "rfc", "correo"];
  const validFieldsDetalleLaboral = [
    "cargo", "tipo_organizacion", "activo", "pausa", 
    "fecha_ingreso", "fecha_nombramiento", "antiguedad", 
    "tipo_direccion_id", "id_relacion", "plaza_id"
  ];

  // Validación de parámetros
  if (!personal_id || !field || value === undefined) {
    return res.status(400).json({
      message: "Datos insuficientes. Se requieren 'personal_id', 'field' y 'value'."
    });
  }

  try {
    let query;
    let params;

    // Si el campo es 'cargo', convertir el nombre a cargo
    if (field === "cargo") {
      // Verificar si el cargo proporcionado es válido y convertirlo al id correspondiente
      const cargoId = cargoMapping[value];

      if (!cargoId) {
        return res.status(400).json({
          message: `El cargo '${value}' no es válido.`
        });
      }

      // Asignar el nuevo valor de cargo
      value = cargoId;
    }

    // Verificar en qué tabla hacer la actualización
    if (validFieldsPersonal.includes(field)) {
      // Si el campo es de la tabla 'personal', actualizamos en 'personal'
      query = `UPDATE personal SET ${field} = ? WHERE personal_id = ?`;
      params = [value, personal_id];
    } else if (validFieldsDetalleLaboral.includes(field)) {
      // Si el campo es de la tabla 'detalle_laboral', actualizamos en 'detalle_laboral'
      query = `UPDATE detalle_laboral SET ${field} = ? WHERE personal_id = ?`;
      params = [value, personal_id];
    } else {
      // Si el campo no es válido en ninguna de las dos tablas
      return res.status(400).json({
        message: `El campo '${field}' no es válido para actualizar en las tablas disponibles.`
      });
    }

    // Ejecutar la consulta SQL
    console.log(`Consulta SQL: ${query}, Valores: [${value}, ${personal_id}]`);
    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el registro para actualizar." });
    }

    console.log("Registro actualizado exitosamente.");
    res.status(200).json({ message: "Registro actualizado exitosamente." });
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ message: "Error al intentar actualizar el registro." });
  }
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
  const validFields = ['np', 'fecha', 'nombre_del_docente', 'antiguedad', 'telefono', 'centro_clave_trabajo', 
    'comunidad', 'municipio', 'zona_id', 'sector_id', 'org', 'no_alumnos', 'grado_1', 'grado_2', 'grado_3', 
    'funcion_docente', 'tipo_nombramiento', 'inicio_movimiento', 'termino_movimiento', 'propuesta', 'subdireccion_academica', 
    'subdireccion_planeacion', 'subdireccion_administracion', 'usicamm', 'recursos_humanos', 'juridico', 'observaciones_conflictos',
     'observaciones', 'estatus_movimiento'];



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

const editarRol = async (req, res) => {
  try {
    const { id, rol } = req.body;

    // Validación: Verificar si los datos requeridos están presentes
    if (!id || !rol) {
      return res.status(400).json({ mensaje: 'ID y rol son requeridos' });
    }

    // Validación: Verificar si el rol es válido
    const rolesValidos = ['admin', 'usuario'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ mensaje: 'El rol proporcionado no es válido' });
    }

    // Actualizar el rol del usuario en la base de datos
    const [result] = await pool.query(
      'UPDATE usuarios SET rol = ? WHERE id = ?',
      [rol, id]
    );

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Respuesta exitosa
    res.status(200).json({ mensaje: 'Rol del usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    res.status(500).json({ mensaje: 'Hubo un error al actualizar el rol del usuario' });
  }
};



//============Función agregar personal==========//

const agregarPersonal = async (req, res) => {
  try {
    console.log("=== Datos recibidos en el body ===");
    console.log(req.body);

    if (req.file) {
      console.log("=== Imagen recibida ===");
      console.log(req.file);
    } else {
      console.log("No se recibió ninguna imagen");
    }

    const {
      rfc,
      nombre,
      apellido,
      fecha_nacimiento,
      sexo,
      curp,
      telefono,
      correo,
      direccion,
      cargo,
      tipo_organizacion,
      fecha_ingreso = null,
      fecha_nombramiento = null,
      tipo_direccion,
      plaza_id,
      activo,
      pausa,
      cct_id,
      zona_id,
      sector_id,
      municipio_id,
      comunidad_id,
    } = req.body;

    // Función para limpiar campos vacíos y convertirlos en null si es necesario
    const limpiarValor = (valor) => (valor === '' || valor === undefined ? null : valor);

    // Limpiar valores vacíos de las fechas antes de la inserción
    const fechaIngresoLimpia = limpiarValor(fecha_ingreso);
    const fechaNombramientoLimpia = limpiarValor(fecha_nombramiento);

    // Dividir apellidos
    let apellido_paterno = "";
    let apellido_materno = "";

    const apellidoParts = apellido.split(" ");
    if (apellidoParts.length === 1) {
      apellido_paterno = apellidoParts[0];
    } else if (apellidoParts.length === 2) {
      apellido_paterno = apellidoParts[0];
      apellido_materno = apellidoParts[1];
    } else {
      apellido_paterno = apellidoParts.slice(0, -1).join(" "); // Todas las palabras menos la última
      apellido_materno = apellidoParts.slice(-1).join(" "); // Solo la última palabra
    }

    const imagen = req.file ? req.file.filename : null;

    await pool.query("START TRANSACTION");

    const insertPersonal = `
      INSERT INTO personal (rfc, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, telefono, correo, direccion, imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultPersonal] = await pool.query(insertPersonal, [
      limpiarValor(rfc),
      limpiarValor(nombre),
      limpiarValor(apellido_paterno),
      limpiarValor(apellido_materno),
      limpiarValor(fecha_nacimiento),
      limpiarValor(sexo),
      limpiarValor(curp),
      limpiarValor(telefono),
      limpiarValor(correo),
      limpiarValor(direccion),
      imagen,
    ]);

    const personal_id = resultPersonal.insertId;
    console.log("ID insertado en 'personal':", personal_id);

    const selectUbicCcts = `
      SELECT id_relacion FROM ubic_ccts
      WHERE cct_id = ? AND zona_id = ? AND sector_id = ? AND municipio_id = ? AND comunidad_id = ?
    `;
    const [existingUbicCcts] = await pool.query(selectUbicCcts, [
      limpiarValor(cct_id),
      limpiarValor(zona_id),
      limpiarValor(sector_id),
      limpiarValor(municipio_id),
      limpiarValor(comunidad_id),
    ]);

    let id_relacion;
    if (existingUbicCcts.length > 0) {
      id_relacion = existingUbicCcts[0].id_relacion;
      console.log("ID existente en 'ubic_ccts':", id_relacion);
    } else {
      const insertUbicCcts = `
        INSERT INTO ubic_ccts (cct_id, zona_id, sector_id, municipio_id, comunidad_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [resultUbicCcts] = await pool.query(insertUbicCcts, [
        limpiarValor(cct_id),
        limpiarValor(zona_id),
        limpiarValor(sector_id),
        limpiarValor(municipio_id),
        limpiarValor(comunidad_id),
      ]);
      id_relacion = resultUbicCcts.insertId;
      console.log("ID insertado en 'ubic_ccts':", id_relacion);
    }

    const insertDetalleLaboral = `
      INSERT INTO detalle_laboral (personal_id, cargo, id_relacion, tipo_organizacion, fecha_ingreso, fecha_nombramiento, tipo_direccion, plaza_id, activo, pausa)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertDetalleLaboral, [
      personal_id,
      limpiarValor(cargo),
      id_relacion,
      limpiarValor(tipo_organizacion),
      fechaIngresoLimpia,
      fechaNombramientoLimpia,
      limpiarValor(tipo_direccion),
      limpiarValor(plaza_id),
      limpiarValor(activo) !== null ? limpiarValor(activo) : 1, // Por defecto activo = 1
      limpiarValor(pausa) !== null ? limpiarValor(pausa) : 0, // Por defecto pausa = 0
    ]);

    console.log("Confirmando transacción...");
    await pool.query("COMMIT");
    res.status(200).send("Datos recibidos correctamente");
  } catch (error) {
    console.log("Error encontrado, haciendo rollback...");
    await pool.query("ROLLBACK");
    console.error("Error al insertar datos en personal y detalle laboral:", error);
    res.status(500).send("Error al insertar datos en personal y detalle laboral");
  }
};




//============Función Delete Records==========//
const borrarFila = async (req, res) => {
  console.log('Solicitud recibida:', req.body);

  const { np, personal_id, tabla } = req.body; // Extraemos los parámetros

  if ((!np && !personal_id) || !tabla) {
    console.error('Faltan parámetros: np, personal_id y/o tabla.');
    return res.status(400).json({ message: 'El identificador (np o personal_id) y la tabla son obligatorios.' });
  }

  const tablasPermitidas = ['docentes_disponibles', 'pendientes', 'becas_comision',
    'solicitudes_de_personal', 'licencia_sin_goce', 'nombramientos', 'incidencias',
    'solicitudes_generales', 'solicitudes_de_cambio', 'salud_inseguridad', 'personal',
     'solicitudes_de_personal' , 'usuarios',
    ];

  if (!tablasPermitidas.includes(tabla)) {
    console.error(`Tabla no permitida: ${tabla}`);
    return res.status(400).json({ message: 'La tabla especificada no está permitida.' });
  }

  try {
    // Determinar el identificador y columna según la tabla
    const identificador = np || personal_id;
    const columna = np ? 'np' : 'personal_id';

    const querySeleccion = `SELECT * FROM ${tabla} WHERE ${columna} = ?`;
    console.log(`Consulta SQL: ${querySeleccion}, Valores: [${identificador}]`);

    const [records] = await pool.query(querySeleccion, [identificador]);

    if (!records || records.length === 0) {
      console.log('No se encontró el registro.');
      return res.status(404).json({ message: 'El registro no existe.' });
    }

    const queryEliminacion = `DELETE FROM ${tabla} WHERE ${columna} = ?`;
    console.log(`Consulta SQL de eliminación: ${queryEliminacion}, Valores: [${identificador}]`);

    await pool.query(queryEliminacion, [identificador]);

    console.log('Registro eliminado exitosamente.');
    res.status(200).json({ message: 'Registro eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ message: 'Error al intentar eliminar el registro.' });
  }
};



const borrarUsuario = async (req, res) => {
    const { id } = req.body; // Obtener el 'id' del cuerpo de la solicitud JSON

    console.log('Recibido ID desde la solicitud:', id); // Log para ver el ID recibido

    // Verifica si el ID está presente en la solicitud
    if (!id) {
        console.error('Falta el ID en la solicitud'); // Log de error si falta el ID
        return res.status(400).json({ mensaje: 'Falta el id en la solicitud' });
    }

    try {
        console.log('Realizando consulta para verificar si el usuario con ID', id, 'existe en la base de datos.');

        // Verificar si el usuario existe en la base de datos
        const [checkUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

        console.log('Resultado de la consulta de usuario:', checkUser); // Log para ver el resultado de la consulta

        // Si el usuario no existe, retornar error
        if (checkUser.length === 0) {
            console.error('Usuario no encontrado con ID:', id); // Log si el usuario no existe
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        console.log('Usuario encontrado. Procediendo con la eliminación del usuario con ID:', id);

        // Proceder con la eliminación del usuario
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        console.log('Resultado de la eliminación:', result); // Log para ver el resultado de la eliminación

        // Si la eliminación no afectó ninguna fila
        if (result.affectedRows === 0) {
            console.error('No se pudo eliminar el usuario, no se encontró el ID:', id); // Log si no se eliminó
            return res.status(404).json({ mensaje: 'No se pudo eliminar el usuario, no se encontró el ID' });
        }

        console.log('Usuario eliminado correctamente con ID:', id); // Log de éxito

        // Responder con éxito
        res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error); // Log de error
        res.status(500).json({ mensaje: 'Hubo un error al eliminar el usuario', error: error.message });
    }
};


const borrarController = async (req, res) => {
  try {
      // Log para ver el body recibido
      console.log('BODY RECIBIDO:', req.body);

      const { np } = req.body;  // Recibir el `np`

      if (!np) {
          console.error('Error: np no enviado.');
          return res.status(400).json({ message: 'El campo np es requerido para eliminar el registro.' });
      }

      // Validar si `np` es realmente un número
      if (isNaN(np)) {
          console.error(`Error: np debe ser un número, recibido: ${np}`);
          return res.status(400).json({ message: 'El campo np debe ser un número válido.' });
      }

      console.log(`Ejecutando DELETE en la tabla con np: ${np}`);

      // Query de eliminación
      const result = await pool.query('DELETE FROM lista_pendientes WHERE np = ?', [parseInt(np)]);

      // Log de resultado de la query
      console.log('RESULTADO QUERY DELETE:', result);

      if (result.affectedRows === 0) {
          console.error('Error: No se encontró el registro para eliminar.');
          return res.status(404).json({ message: 'No se encontró el registro para eliminar.' });
      }

      console.log('Registro eliminado correctamente.');
      res.status(200).json({ message: 'Registro eliminado correctamente.' });
  } catch (error) {
      console.error('Error en el controlador de eliminación:', error);
      res.status(500).json({ message: 'Error al eliminar el registro.' });
  }
};

module.exports = borrarUsuario;


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
    LEFT JOIN cargos AS c ON dl.cargo = c.cargo
    LEFT JOIN tipo_organizacion AS t_org ON dl.tipo_organizacion = t_org.tipo_organizacion
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
  editarCCTS,
  editarPendientes,
  editarBecas,
  editarDocente,
  editarPendientes,
  editarBecas,
  editarSalud,
  editarIncidencias,
  editarLicenciaSinGoce,
  editarEscuelasDisponibles,
  editarNombramientosDocentes,
  editarSolicitudes,
  editarInternos,
  editarSolicitudesPersonal,
  editarSolicitudesGenerales,
  editarSolicitudesDeCambio,
  editarListaPanelAdministrador,
  editarRol,

  vistaAgregarpersonal,
  agregarPersonal,
  // obtenerPersonalTotal,
  obtenerSalud,
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
  obtenerSolicitudesPersonal,
  obtenerSolicitudesGenerales,
  obtenerSolicitudesDeCambio,
  obtenerUbicCCTs,
  obtenerListaPanelAdministrador,
  borrarFila,
  borrarUsuario,
  actualizarRegistro,
  borrarController



};
