const pool = require("../../src/config/db");

const obtenerListaPanelAdministrador = async () => {
    try {
      const [results] = await pool.query(`
    SELECT
      p.personal_id,
      p.rfc,
      p.curp,
      p.fecha_nacimiento,
      CONCAT(IFNULL(p.nombre, ''), ' ', IFNULL(p.apellido_paterno, ''), ' ', IFNULL(p.apellido_materno, '')) AS nombre,
      p.edad,
      p.telefono,
      p.imagen,
       p.correo, -- Campo agregado
        p.direccion, -- Campo agregado
        p.sexo, -- Campo agregad
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
      dl.nombramiento,
      IFNULL(c.centro_clave_trabajo, 'Sin CCT') AS nombre_cct
  FROM
      personal p
  LEFT JOIN
      detalle_laboral dl ON p.personal_id = dl.personal_id
  LEFT JOIN
      ubic_ccts u ON dl.id_relacion = u.id_relacion
  LEFT JOIN
      ccts c ON u.cct_id = c.cct_id;
      `);
      return results; // Aquí retornas los resultados en lugar de enviarlos directamente
    } catch (error) {
      console.error("Error al obtener lista licencia sin goce:", error);
      throw new Error("Error al obtener personal del panel adm");
    }
};

module.exports = {
  obtenerListaPanelAdministrador
};
