const pool = require("../src/config/db");

// Función para ocultar registros "Terminados"
const ocultarEstatusTerminado = async (tabla) => {
  try {
    const [result] = await pool.query(`
      UPDATE ${tabla}
      SET hide = 1
      WHERE estatus = 'Terminado'
    `);

    return {
      success: true,
      message: `${result.affectedRows} registros ocultados en la tabla ${tabla}`
    };
  } catch (error) {
    console.error(`Error al ocultar registros en la tabla ${tabla}:`, error);
    return {
      success: false,
      message: `Error al ocultar los registros en la tabla ${tabla}`
    };
  }
};

module.exports = ocultarEstatusTerminado;
