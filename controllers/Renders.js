const pool = require("../src/config/db");

const home = async () => {
  try {
    // Ejecutamos todas las consultas en paralelo
    const [resultsPersonal] = await pool.query(`
      SELECT
        COUNT(*) AS total_personal,
        COUNT(CASE WHEN detalle_laboral.cargo_id = 1 THEN 1 END) AS total_directores,
        COUNT(CASE WHEN detalle_laboral.cargo_id = 3 THEN 1 END) AS total_docentes,
        COUNT(CASE WHEN detalle_laboral.cargo_id = 4 THEN 1 END) AS total_auxiliares
      FROM detalle_laboral
      WHERE detalle_laboral.cargo_id IN (1, 3, 4);
    `);

    const [resultsPendientes] = await pool.query(`
      SELECT np, fecha, estatus, tramite, departamento, observaciones_conflictos
      FROM pendientes;
    `);

    // Consulta adicional para obtener nombre y rol de los usuarios
    const [tablaRoles] = await pool.query(`
      SELECT CONCAT(usuario, ' ', apellido) AS nombre, rol, email AS correo
      FROM usuarios;
    `);

    // Devolvemos los resultados de todas las consultas en un solo objeto
    return {
      personal: resultsPersonal[0],
      pendientes: resultsPendientes,
      roles: tablaRoles // Incluimos los datos de los usuarios
    };
  } catch (error) {
    console.error("Error al obtener totales de personal, pendientes y roles:", error);
    throw new Error("Error al obtener totales de personal, pendientes y roles");
  }
};





// Exportando correctamente las funciones
module.exports = {
  home,
};
