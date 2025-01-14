const pool = require("../../src/config/db");

const obtenerHistorialTablas = async (tabla) => {
  const tablasPermitidas = ["historial_docente_disponible", "otra_tabla"];

  try {
    if (!tablasPermitidas.includes(tabla)) {
      throw new Error(`La tabla "${tabla}" no está permitida.`);
    }

    // Consulta con JOIN para obtener el nombre del docente
    const [results] = await pool.query(`
      SELECT hd.*, CONCAT(p.apellido_paterno, ' ', p.apellido_materno, ' ', p.nombre) AS nombre_completo
      FROM ?? AS hd
      LEFT JOIN personal AS p ON hd.personal_id = p.personal_id
    `, [tabla]);

    return results;
  } catch (error) {
    console.error(`Error al obtener los datos de la tabla "${tabla}":`, error);
    throw new Error(`Error al obtener los datos de la tabla "${tabla}"`);
  }
};


  module.exports = { obtenerHistorialTablas };