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

    const query = `SELECT ${columnas}${selectNombre} FROM ${tabla} ${joinPersonal} ${condiciones}`;
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

// Ejemplos de uso:
const HistorialBecas = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_becas', personalId);
};

const saludInseguridad = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_salud_inseguridad', personalId);
};

const solicitudesDeCambio = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_solicitudes_cambios', personalId);
};
const incidencias = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_incidencias', personalId);
};

// const historialSolicitudesPersonal = async (personalId) => {
//   return await obtenerHistorialPorTabla('historial_solicitudes_personal', personalId);
// };

const historialSolicitudesGenerales = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_solicitudes_generales', personalId);
};

const historialNombramientos = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_nombramientos', personalId);
};

const historialMovimientos = async (personalId) => {
  return await obtenerHistorialPorTabla('historial_docente_disponible', personalId);
};

const historialLicenciaSinGoce = async (personalId) => {
  return await obtenerHistorialPorTabla('historia_licencia_sin_goce', personalId);
};




// Exportando correctamente las funciones
module.exports = {
  home,
  obtenerPerfilPorId,
  obtenerDetalleCompleto,
  HistorialBecas,
  saludInseguridad,
  solicitudesDeCambio,
  incidencias,
  // historialSolicitudesPersonal,
  historialSolicitudesGenerales,
  historialNombramientos,
  historialMovimientos,
  historialLicenciaSinGoce
};
