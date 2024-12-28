const pool = require("../src/config/db");

const home = async () => {
  try {
    // Ejecutamos todas las consultas en paralelo
    const [resultsPersonal] = await pool.query(`
    SELECT
    (SELECT COUNT(*) FROM personal) AS total_personal,
      (SELECT COUNT(*) FROM pendientes) AS pendientes,
    COUNT(CASE WHEN detalle_laboral.cargo = 'DIRECTOR' THEN 1 END) AS total_directores,
    COUNT(CASE WHEN detalle_laboral.cargo = 'DOCENTE' THEN 1 END) AS total_docentes,
    COUNT(CASE WHEN detalle_laboral.cargo IN ('AUXILIAR ADMVO', 'AUXILIAR SERVICIO') THEN 1 END) AS total_auxiliares,
    COUNT(CASE WHEN detalle_laboral.cargo = 'ADMVO' THEN 1 END) AS total_administrativos,
    COUNT(CASE WHEN detalle_laboral.cargo = 'DOCENTE DE APOYO' THEN 1 END) AS total_docente_apoyo,
    COUNT(CASE WHEN detalle_laboral.cargo = 'DOCENTE/CAMB/ACT' THEN 1 END) AS total_docente_camb,
    COUNT(CASE WHEN detalle_laboral.cargo = 'SUBDIR DE GESTION' THEN 1 END) AS total_docente_subdir,
    COUNT(CASE WHEN detalle_laboral.tipo_entidad = 'Estatal' THEN 1 END) AS total_estatal,
    COUNT(CASE WHEN detalle_laboral.tipo_entidad = 'Federal' THEN 1 END) AS total_federal
FROM 
    detalle_laboral
WHERE 
    detalle_laboral.cargo IN (
    'DIRECTOR', 'DOCENTE', 'AUXILIAR ADMVO', 'AUXILIAR SERVICIO', 
    'DOCENTE DE APOYO', 'DOCENTE/CAMB/ACT', 'SUBDIR DE GESTION');



    `);

    const [resultsPendientes] = await pool.query(`
      SELECT np, fecha, estatus, tramite, departamento, observaciones_conflictos
      FROM pendientes;
    `);


    const [tablaRoles] = await pool.query(`
     SELECT
      id,
      CONCAT(usuario, ' ', apellido) AS nombre, rol, email AS correo
      FROM usuarios
      WHERE rol IN ('admin', 'usuario');

    `);


    const [procesos_en_transito] = await pool.query(`
      SELECT 
          ( SELECT COUNT(*) FROM becas_comision ) +
          ( SELECT COUNT(*) FROM docentes_disponibles ) +
          ( SELECT COUNT(*) FROM solicitudes_generales ) +
          ( SELECT COUNT(*) FROM solicitudes_de_personal ) +
          ( SELECT COUNT(*) FROM solicitudes_de_cambio ) +
          ( SELECT COUNT(*) FROM salud_inseguridad ) +
          ( SELECT COUNT(*) FROM nombramientos ) +
          ( SELECT COUNT(*) FROM licencia_sin_goce ) +
          ( SELECT COUNT(*) FROM incidencias ) AS total_procesos;
  `);

    return {
      personal: resultsPersonal[0],
      pendientes: resultsPendientes,
      roles: tablaRoles,
      procesos: procesos_en_transito[0].total_procesos
    };
  } catch (error) {
    console.error("Error al obtener totales de personal, pendientes y roles:", error);
    throw new Error("Error al obtener totales de personal, pendientes y roles");
  }
};

const obtenerPerfilPorId = async (personalId) => {
  try {
    const [result] = await pool.query('SELECT * FROM semstdb.personal WHERE personal_id = ?', [personalId]);

    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    throw new Error('Error al obtener el perfil');
  }
};

const obtenerDetalleCompleto = async (personalId) => {
  try {
    const [detalleCompleto] = await pool.query(`
    SELECT
    dl.cargo,
    dl.tipo_organizacion,
    dl.activo,
    dl.pausa,
    dl.fecha_ingreso,
    dl.fecha_nombramiento,
    CASE
        WHEN dl.antiguedad_detalle LIKE '%años%' THEN 
            CONCAT(SUBSTRING_INDEX(dl.antiguedad_detalle, ' años', 1), ' años')
        WHEN dl.antiguedad_detalle LIKE '%meses%' THEN 
            CONCAT(SUBSTRING_INDEX(SUBSTRING_INDEX(dl.antiguedad_detalle, ' meses', 1), ', ', -1), ' meses')
        ELSE 
            'Sin antigüedad'
    END AS antiguedad_compacta,
    dl.tipo_direccion,
    dl.tipo_entidad,
    dl.z_e,
    dl.id_relacion,
    dl.nombramiento,
    dl.grado,
    uc.cct_id,
    ccts.centro_clave_trabajo AS clave_cct,
    z.numero_zona AS zona,
    s.sector_numero AS sector,
    m.nombre AS municipio,
    cdt.nombre AS comunidad
FROM
    detalle_laboral AS dl
LEFT JOIN
    ubic_ccts AS uc ON dl.id_relacion = uc.id_relacion
LEFT JOIN
    ccts ON uc.cct_id = ccts.cct_id
LEFT JOIN
    zona AS z ON uc.zona_id = z.zona_id
LEFT JOIN
    sector AS s ON uc.sector_id = s.sector_id
LEFT JOIN
    municipio AS m ON uc.municipio_id = m.municipio_id
LEFT JOIN
    comunidad AS cdt ON uc.comunidad_id = cdt.comunidad_id
WHERE
    dl.personal_id = ?;



    `, [personalId]);

    if (detalleCompleto.length === 0) {
      return null;
    }

    return detalleCompleto[0];
  } catch (error) {
    console.error("Error al obtener detalle completo:", error);
    throw new Error("Error al obtener detalle completo");
  }
};



const obtenerDatosGenericos = async (tabla, columnas = '*', condiciones = '') => {
  try {
    const includeNombre = columnas.includes('personal_id');
    const joinPersonal = includeNombre
      ? `LEFT JOIN personal ON ${tabla}.personal_id = personal.personal_id`
      : '';

    const selectNombre = includeNombre
      ? `, CONCAT(personal.nombre, ' ', personal.apellido_paterno, ' ', personal.apellido_materno) AS nombre_completo`
      : '';

    // NUEVO: Agregar joins y selects si se requiere el id_relacion
    const includeIdRelacion = columnas.includes('detalle_laboral');
    const joinUbicaciones = includeIdRelacion
      ? `LEFT JOIN detalle_laboral ON ${tabla}.personal_id = detalle_laboral.personal_id
         LEFT JOIN ubic_ccts ON detalle_laboral.id_relacion = ubic_ccts.id_relacion
         LEFT JOIN comunidad ON ubic_ccts.comunidad_id = comunidad.comunidad_id
         LEFT JOIN municipio ON ubic_ccts.municipio_id = municipio.municipio_id
         LEFT JOIN ccts ON ubic_ccts.cct_id = ccts.cct_id`
      : '';

    const selectUbicaciones = includeIdRelacion
      ? `, comunidad.nombre AS nombre_comunidad
         , municipio.nombre AS nombre_municipio
         , ccts.centro_clave_trabajo AS cct`
      : '';

    // Consulta final
    const query = `
      SELECT ${columnas}${selectNombre}${selectUbicaciones} 
      FROM ${tabla} 
      ${joinPersonal} 
      ${joinUbicaciones} 
      ${condiciones}
    `;

    const [result] = await pool.query(query);
    return result;
  } catch (error) {
    console.error(`Error al obtener datos de la tabla ${tabla}:`, error);
    throw new Error(`Error al obtener datos de la tabla ${tabla}`);
  }
};


const obtenerHistorialPorTabla = async (tabla, personalId) => {
  const condiciones = `WHERE personal_id = ${personalId}`;
  return await obtenerDatosGenericos(tabla, '*', condiciones);
};


const HistorialBecas = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_becas', personalId);
};

const saludInseguridad = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_salud_inseguridad', personalId);
};

const solicitudesDeCambio = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_solicitudes_cambios', personalId);
};
const HistorialIncidencias = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_incidencias', personalId);
};



// const historialSolicitudesPersonal = async (personalId) => {
//   return await obtenerHistorialPorTabla('historial_solicitudes_personal', personalId);
// };

const historialSolicitudesGenerales = async (personalId) => {
  const columnas = `
    historial_solicitudes_generales.*,
    comunidad.nombre AS nombre_comunidad,
    municipio.nombre AS nombre_municipio,
    ccts.centro_clave_trabajo AS cct
  `;

  const condiciones = `
    LEFT JOIN detalle_laboral 
      ON historial_solicitudes_generales.personal_id = detalle_laboral.personal_id
    LEFT JOIN ubic_ccts 
      ON detalle_laboral.id_relacion = ubic_ccts.id_relacion
    LEFT JOIN comunidad 
      ON ubic_ccts.comunidad_id = comunidad.comunidad_id
    LEFT JOIN municipio 
      ON ubic_ccts.municipio_id = municipio.municipio_id
    LEFT JOIN ccts 
      ON ubic_ccts.cct_id = ccts.cct_id
    WHERE historial_solicitudes_generales.personal_id = ${personalId}
  `;

  return await obtenerDatosGenericos('historial_solicitudes_generales', columnas, condiciones);
};


const historialNombramientos = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_nombramientos', personalId);
};

const  historialDocenteDisponible = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_docente_disponible', personalId);
};

const historialLicenciaSinGoce = async (personalId) => {
  const columnas = `
    historia_licencia_sin_goce.*,
    comunidad.nombre AS nombre_comunidad,
    municipio.nombre AS nombre_municipio,
    ccts.centro_clave_trabajo AS cct
  `;

  const condiciones = `
    LEFT JOIN ubic_ccts 
      ON historia_licencia_sin_goce.id_relacion = ubic_ccts.id_relacion
    LEFT JOIN comunidad 
      ON ubic_ccts.comunidad_id = comunidad.comunidad_id
    LEFT JOIN municipio 
      ON ubic_ccts.municipio_id = municipio.municipio_id
    LEFT JOIN ccts 
      ON ubic_ccts.cct_id = ccts.cct_id
    WHERE historia_licencia_sin_goce.personal_id = ${personalId}
  `;

  return await obtenerDatosGenericos('historia_licencia_sin_goce', columnas, condiciones);
};

const procesosEnTransito = async (personalId) => {
  try {
    // Incrementar el límite de GROUP_CONCAT para evitar cortes
    await pool.query("SET SESSION group_concat_max_len = 1000000");

    // Generar la consulta dinámica ajustada
    const queryParaGenerar = `
      SELECT GROUP_CONCAT(
          CONCAT(
              'SELECT ''', TABLE_NAME, ''' AS tabla, personal_id, ', 
              (
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = INFORMATION_SCHEMA.COLUMNS.TABLE_NAME 
                  AND TABLE_SCHEMA = 'semstdb'
                  AND COLUMN_NAME LIKE '%observaciones%' 
                LIMIT 1
              ), 
              ' AS observaciones FROM ', TABLE_NAME, 
              ' WHERE personal_id = ${personalId}'
          ) SEPARATOR ' UNION ALL '
      ) AS consulta
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'semstdb'
        AND COLUMN_NAME = 'personal_id'
        AND TABLE_NAME NOT LIKE '%historial%'
        AND TABLE_NAME NOT LIKE '%historia%'
        AND TABLE_NAME NOT LIKE '%detalle_laboral%'
        AND TABLE_NAME NOT LIKE '%personal%'
        AND TABLE_NAME NOT LIKE '%personaintro%'
        AND TABLE_NAME NOT LIKE '%backup%'
        AND EXISTS (
            SELECT 1 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = INFORMATION_SCHEMA.COLUMNS.TABLE_NAME 
              AND TABLE_SCHEMA = 'semstdb'
              AND COLUMN_NAME LIKE '%observaciones%'
        );
    `;
    const [rows] = await pool.query(queryParaGenerar);
    const consultaDinamica = rows[0]?.consulta;

    if (!consultaDinamica) {
      throw new Error("No se pudo generar la consulta dinámica. Verifica que existan tablas válidas con observaciones.");
    }

    const [resultados] = await pool.query(consultaDinamica);
    return resultados;
  } catch (error) {
    console.error("Error al obtener los procesos en tránsito:", error.message);
    throw error;
  }
};








// Exportando correctamente las funciones
module.exports = {
  home,
  obtenerPerfilPorId,
  obtenerDetalleCompleto,
  HistorialBecas,
  saludInseguridad,
  solicitudesDeCambio,
  HistorialIncidencias,
  historialDocenteDisponible,
  // historialSolicitudesPersonal,
  historialSolicitudesGenerales,
  historialNombramientos,
  historialLicenciaSinGoce,
  procesosEnTransito
};
