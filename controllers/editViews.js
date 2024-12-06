const editarTablas = {

    actualizarRegistro: async (tabla, idCampo, idValor, field, value, validFields, res) => {
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
      },
      
      //=========Puts para las tablas AG Grid funciona con el modulo actualizarRegistro =============//
     editarPendientes: async (req, res) => {
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
      },
      
     editarDocente : async (req, res) => {
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
      },
      
     editarCCTS : async (req, res) => {
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
      },
      
     editarBecas : async (req, res) => {
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
      },
     editarSalud : async (req, res) => {
        const { np, field, value } = req.body;
        const validFields = [ 'nombre_docente', 'fecha', 'estatus', 'situacion',
          'antiguedad', 'municipio_sale', 'comunidad_sale', 'municipio_entra',
          'comunidad_entra', 'cct_entra', 'cct_sale', 'estatus_cubierta',
          'observaciones', ];
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("salud_inseguridad", "np", np, field, value, validFields, res);
      },
      
     editarSolicitudesDeCambio : async (req, res) => {
        console.log("Datos recibidos en editarPendientes:", req.body);
        const { np, field, value } = req.body;
      
        const validFields = [
          'np','fecha', 'estatus', 'situacion', 'antiguedad', 'municipio_entra', 'comunidad_entra', 'cct_entra',  'observaciones',
        ];
      
        return actualizarRegistro("solicitudes_de_cambio", "np", np, field, value, validFields, res);
      },
      
     editarSolicitudesPersonal: async (req, res) => {
        const { np, field, value } = req.body;
        const validFields = ["np", "fecha", "estatus", "escuela", "comunidad", "municipio", "observaciones", "clave cct", "comunidad cct", "municipio cct", "zona", "sector", "tipo_organizacion", "no de alumnos", "1° grado", "2° grado", "3° grado", "funcion_docente", "tipo de nombramiento", "inicio del movimiento", "termino del movimiento", "propuesta", "subdireccion academica", "subdireccion de planeacion", "subdireccion de administracion", "usicamm", "recursos humanos", "juridico", "observaciones conflictos", "observaciones secretaria general", "estatus del movimiento"];
      
      
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("solicitudes_de_personal", "np", np, field, value, validFields, res);
      },
      
     editarSolicitudesGenerales: async (req, res) => {
        console.log("Datos recibidos en editarPendientes:", req.body);
        const { np, field, value } = req.body;
        const validFields = ['np', 'fecha', 'nombre_del_docente', 'estatus', 'tipo_solicitud', 'fecha_documento',
           'observaciones', 'departamento', 'edad', 'telefono', 'centro_clave_trabajo', 'comunidad', 'municipio',
            'zona_id', 'sector_id', 'tipo_organizacion', 'no_alumnos', 'grado_1', 'grado_2', 'grado_3', 'funcion_docente', 
            'inicio_movimiento', 'termino_movimiento', 'propuesta', 'observaciones_secretaria_general'];
      
      
      
      
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("solicitudes_generales", "np", np, field, value, validFields, res);
      },
      
      
     editarIncidencias: async (req, res) => {
        const { np, field, value } = req.body;
        const validFields = [ "zona_id", "sector_id", "tipo_organizacion", "no_alumnos", "grado_1", "grado_2", "grado_3", "funcion_docente", "tipo_nombramiento", "inicio_movimiento", "termino_movimiento", "propuesta", "subdireccion_academica", "subdireccion_planeacion", "subdireccion_administracion", "usicamm", "recursos_humanos", "juridico", "observaciones_conflictos", "observaciones_secretaria_general", "estatus_movimiento", "situacion", "observaciones", ];
      
      
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("incidencias", "np", np, field, value, validFields, res);
      },
      
     editarLicenciaSinGoce: async (req, res) => {
        console.log("Datos recibidos en editarPendientes:", req.body);
        const { np, field, value } = req.body;
        const validFields = ["NP", "FECHA_REGISTRO", "FECHA_DOCUMENTO", "PERSONAL_ID", "TIPO_MOVIMIENTO", "CCT", "COMUNIDAD", "MUNICIPIO", "ORGANIZACION", "JUSTIFICA", "INICIO_MOVIMIENTO", "TERMINO_MOVIMIENTO", "DIAGNOSTICO", "AVISO", "VACANTE", "OBSERVACIONES", "ANTIGUEDAD", "TELEFONO", "OBSERVACIONES_CONFLICTOS", "OBSERVACIONES_SECRETARIA_GENERAL"];
      
      
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("licencia_sin_goce", "np", np, field, value, validFields, res);
      },
      
     editarListaPanelAdministrador: async (req, res) => {
        console.log("Datos recibidos en listaPanelAdm:", req.body);
      
        const { personal_id, field, value } = req.body;
      
        // Aseguramos que los campos válidos sean siempre un array
        const validFields = ["personal_id", "nombre", "telefono", "rfc", "correo"];
      
        console.log("Valor de validFields:", validFields);
        console.log("Tipo de validFields:", typeof validFields);
      
        // Validación de parámetros
        if (!personal_id || !field || value === undefined) {
          return res.status(400).json({ 
            message: "Datos insuficientes. Se requieren 'personal_id', 'field' y 'value'." 
          });
        }
      
        // Verificar que validFields sea un array y que incluya el campo
        if (!Array.isArray(validFields) || !validFields.includes(field)) {
          return res.status(400).json({ 
            message: `El campo '${field}' no es válido para actualizar.` 
          });
        }
      
        try {
          const query = `UPDATE personal SET ${field} = ? WHERE personal_id = ?`;
          console.log(`Consulta SQL: ${query}, Valores: [${value}, ${personal_id}]`);
          const [result] = await pool.query(query, [value, personal_id]);
      
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el registro para actualizar." });
          }
      
          console.log("Registro actualizado exitosamente.");
          res.status(200).json({ message: "Registro actualizado exitosamente." });
        } catch (error) {
          console.error("Error al actualizar el registro:", error);
          res.status(500).json({ message: "Error al intentar actualizar el registro." });
        }
      },
      
      
     editarEscuelasDisponibles: async (req, res) => {
        const { np, field, value } = req.body;
        const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad', 'municipio', 'vacante', 'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general' ];
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("escuelas_disponibles", "np", np, field, value, validFields, res);
      },
      
     editarNombramientosDocentes: async (req, res) => {
        const { np, field, value } = req.body;
        console.log("Datos recibidos en editarPendientes:", req.body);
        const validFields = ['np', 'fecha', 'nombre_del_docente', 'antiguedad', 'telefono', 'centro_clave_trabajo', 'comunidad', 'municipio', 'zona_id', 'sector_id', 'tipo_organizacion', 'no_alumnos', 'grado_1', 'grado_2', 'grado_3', 'funcion_docente', 'tipo_nombramiento', 'inicio_movimiento', 'termino_movimiento', 'propuesta', 'subdireccion_academica', 'subdireccion_planeacion', 'subdireccion_administracion', 'usicamm', 'recursos_humanos', 'juridico', 'observaciones_conflictos', 'observaciones_secretaria_general', 'estatus_movimiento'];
      
        
        
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("nombramientos", "np", np, field, value, validFields, res);
      },
      
     editarSolicitudes: async (req, res) => {
        const { np, field, value } = req.body;
        const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad', 'municipio', 'vacante', 'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general' ];
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("solicitudes", "np", np, field, value, validFields, res);
      },
      
     editarInternos: async (req, res) => {
        const { np, field, value } = req.body;
        const validFields = [ 'np', 'fecha', 'nombre_docente', 'cct', 'comunidad', 'municipio', 'vacante', 'cubre', 'antiguedad', 'telefono', 'observaciones_conflictos', 'observaciones_secretaria_general' ];
        if (!np || !field || value === undefined) {
          return res.status(400).json({ message: "Datos insuficientes. Se requieren 'np', 'field' y 'value'." });
        }
        return actualizarRegistro("internos", "np", np, field, value, validFields, res);
      },


}; 

module.exports = editarTablas;