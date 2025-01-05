const pool = require('../../../../src/config/db'); 

//====Funcion de Patch para editar tablas===========//
const editarTablas = {
  editar: async (req, res) => {
    const { tabla, datos } = req.body;

    if (!tabla || !datos) {
      return res.status(400).send("Faltan parámetros: tabla o datos.");
    }

    try {
      const keyColumn = 'np'; // Clave primaria
      const columnToUpdate = Object.keys(datos).filter((col) => col !== keyColumn)[0]; // Solo queremos actualizar una columna
      const valorNuevo = datos[columnToUpdate];
      const npValue = datos[keyColumn];

      // Asegúrate de que solo haya una columna para actualizar
      if (!columnToUpdate || !valorNuevo) {
        return res.status(400).send("No se especificaron cambios para la tabla.");
      }

      // Construcción explícita de la consulta
      const queryUpdate = `UPDATE ${tabla} SET ${columnToUpdate} = ? WHERE ${keyColumn} = ?`;
      const queryParams = [valorNuevo, npValue];

      console.log('Consulta SQL:', queryUpdate);
      console.log('Parámetros:', queryParams);

      // Ejecuta la consulta
      const [updateResult] = await pool.query(queryUpdate, queryParams);
      res.send(`Registro actualizado con éxito: ${columnToUpdate} = ${valorNuevo}`);
    } catch (err) {
      console.error('Error al actualizar la tabla:', err);
      return res.status(500).send('Error al actualizar la tabla');
    }
  },
};



module.exports = editarTablas;


