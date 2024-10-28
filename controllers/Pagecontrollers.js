const connection = require("../src/config/db");

const vistaPrincipal = (req, res) => {
  res.render("home");
};

const vistaReviciones = (req, res) => {
  res.render("revisiones");
};

const vistaPendientes = (req, res) => {
  res.render("pendientes");
};

const vistaDocentesDisponibles = (req, res) => {
  res.render("docentes-disponibles");
};

const vistaNombramientosDocentes = (req, res) => {
  res.render("nombramientos-docentes");
};

const vistaLicenciasSinGoce = (req, res) => {
  res.render("licencias-sin-goce");
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

const vistaListaPanelAdm = (req, res) => {
  connection.query(
    `
        SELECT 
            p.personal_id, 
            p.rfc, 
            p.nombre, 
            p.apellido_paterno, 
            p.apellido_materno, 
            p.edad, 
            p.telefono, 
            p.correo, 
            p.imagen, /* Agregamos la columna imagen */
            c.descripcion AS cargo
        FROM 
            personal p
        LEFT JOIN 
            detalle_laboral dl ON p.personal_id = dl.personal_id
        LEFT JOIN 
            cargos c ON dl.cargo_id = c.cargo_id
    `,
    (err, results) => {
      if (err) {
        console.error("Error al hacer la consulta:", err);
        res.status(500).send("Error en la consulta de la base de datos");
      } else {
        // Renderizamos la vista 'lista-panel-adm' con los resultados obtenidos
        res.render("lista-panel-adm", { personal: results });
      }
    }
  );
};



const vistaListaGeneral = (req, res) => {
  connection.query(
    `
        SELECT 
            p.personal_id, 
            p.rfc, 
            p.nombre, 
            p.apellido_paterno, 
            p.apellido_materno, 
            p.edad, 
            p.telefono, 
            p.correo, 
            c.descripcion AS cargo
        FROM 
            personal p
        LEFT JOIN 
            detalle_laboral dl ON p.personal_id = dl.personal_id
        LEFT JOIN 
            cargos c ON dl.cargo_id = c.cargo_id
    `,
    (err, results) => {
      if (err) {
        console.error("Error al hacer la consulta:", err);
        res.status(500).send("Error en la consulta de la base de datos");
      } else {
        // Aquí enviamos los datos como 'personal' a la vista
        res.render("lista-general", { personal: results });
      }
    }
  );
};



const vistaListaDocente = (req, res) => {
  res.render("lista-docente");
};

const vistaListaFederal = (req, res) => {
  res.render("lista-federal");
};

const vistaInfoPersonal = (req, res) => {
  res.render("info-personal");
};


const vistaAgregarpersonal = (req, res) => {
    const sectorId = req.body.sector_id || null; // Capturamos el sector_id, o null si no se ha seleccionado

    // Consulta para obtener los centros de trabajo
    const queryCCT = `
      SELECT c.cct_id, c.centro_clave_trabajo AS nombre, cc.clave_nomina 
      FROM ccts c 
      LEFT JOIN cct_claves cc ON c.cct_id = cc.cct_id
    `;

    // Consulta para obtener los sectores ordenados por sector_id
    const querySector = `
      SELECT sector_id, sector_numero 
      FROM sector
      ORDER BY sector_id ASC
    `;

    // Modificamos la consulta para obtener las zonas filtradas por sector_id
    const queryZona = sectorId
      ? `SELECT zona_id, numero_zona FROM zona WHERE sector_id = ? ORDER BY zona_id ASC`
      : `SELECT zona_id, numero_zona FROM zona ORDER BY zona_id ASC`; // Si no hay sector, traemos todas las zonas

    // Consulta para obtener comunidades
    const queryComunidad = `
      SELECT comunidad_id, nombre FROM comunidad ORDER BY comunidad_id ASC;
    `;

    // Consulta para obtener municipios (corrigiendo el nombre de la columna)
    const queryMunicipio = `
      SELECT municipio_id, nombre FROM municipio ORDER BY municipio_id ASC;
    `;

    // Ejecutar la consulta de Centros de Trabajo
    connection.query(queryCCT, (errCCT, resultsCCT) => {
      if (errCCT) {
        console.error("Error al hacer la consulta de CCT:", errCCT);
        return res.status(500).send("Error en la consulta de Centros de Trabajo");
      }

      // Ejecutar la consulta de Sectores
      connection.query(querySector, (errSector, resultsSector) => {
        if (errSector) {
          console.error("Error al hacer la consulta de Sectores:", errSector);
          return res.status(500).send("Error en la consulta de Sectores");
        }

        // Ejecutar la consulta de Zonas
        connection.query(queryZona, [sectorId], (errZona, resultsZona) => {
          if (errZona) {
            console.error("Error al hacer la consulta de Zonas:", errZona);
            return res.status(500).send("Error en la consulta de Zonas");
          }

          // Ejecutar la consulta de Comunidades
          connection.query(queryComunidad, (errComunidad, resultsComunidad) => {
            if (errComunidad) {
              console.error("Error al hacer la consulta de Comunidades:", errComunidad);
              return res.status(500).send("Error en la consulta de Comunidades");
            }

            // Ejecutar la consulta de Municipios (ya corregido)
            connection.query(queryMunicipio, (errMunicipio, resultsMunicipio) => {
              if (errMunicipio) {
                console.error("Error al hacer la consulta de Municipios:", errMunicipio);
                return res.status(500).send("Error en la consulta de Municipios");
              }

              // Renderizar la vista pasando todos los conjuntos de datos
              res.render("agregar-personal", { 
                ccts: resultsCCT, 
                sectores: resultsSector, 
                zonas: resultsZona,
                comunidades: resultsComunidad,
                municipios: resultsMunicipio
              });
            });
          });
        });
      });
    });
};


//Query agregar personal
const agregarPersonal = (req, res) => {
    
    const {
      rfc,
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo, // Capturamos el campo 'sexo' desde el formulario
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
      id_relacion, // Relacionar con la tabla ubic_ccts
      activo, // Opcional, puedes mantener el valor por defecto
      pausa, // Opcional, puedes mantener el valor por defecto
    } = req.body;
  
    const imagen = req.file ? req.file.filename : null;

    // Añadimos los console.log para verificar los datos recibidos
    console.log("Datos recibidos del formulario:", req.body); 
    console.log("Imagen recibida:", req.file); 
  
    connection.beginTransaction((err) => {
      if (err) {
        return res.status(500).send("Error al iniciar la transacción");
      }

      // Primer paso: Insertar en la tabla `personal`
      const insertPersonal =
        "INSERT INTO personal (rfc, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, telefono, correo, direccion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const personalData = [
        rfc,
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo, // Asegúrate de que el campo 'sexo' no sea NULL
        curp,
        telefono,
        correo,
        direccion,
        imagen,
      ];
  
      connection.query(insertPersonal, personalData, (err, result) => {
        if (err) {
          console.error("Error al insertar datos en personal:", err);
          return connection.rollback(() => {
            res.status(500).send("Error al insertar datos en personal");
          });
        }

        const personal_id = result.insertId; // Obtener el `personal_id` generado
  
        // Segundo paso: Insertar en la tabla `detalle_laboral`
        const insertDetalleLaboral =
          "INSERT INTO detalle_laboral (personal_id, cargo_id, id_relacion, tipo_organizacion_id, fecha_ingreso, fecha_nombramiento, tipo_direccion_id, plaza_id, activo, pausa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const detalleLaboralData = [
          personal_id,
          cargo_id,
          id_relacion, // La relación con la tabla ubic_ccts
          tipo_organizacion_id,
          fecha_ingreso,
          fecha_nombramiento,
          tipo_direccion_id,
          plaza_id,
          activo || 1,
          pausa || 0,
        ];
  
        connection.query(insertDetalleLaboral, detalleLaboralData, (err, result) => {
          if (err) {
            console.error("Error al insertar datos en detalle laboral:", err);
            return connection.rollback(() => {
              res.status(500).send("Error al insertar datos en detalle laboral");
            });
          }
  
          // Confirmar la transacción si todo es exitoso
          connection.commit((err) => {
            if (err) {
              console.error("Error al hacer commit de la transacción:", err);
              return connection.rollback(() => {
                res.status(500).send("Error al hacer commit de la transacción");
              });
            }
            res.send("Datos recibidos correctamente"); // Enviar la respuesta
          });
        });
      });
    });
};

const actualizarPersonal = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    direccion,
    correo,
    rfc,
    curp,
    fecha_nacimiento,
    telefono,
    sexo,
    sector_id,
    zona_id,
    municipio_id,
    comunidad_id,
    cct_id,
    cargo_id,
    tipo_direccion_id,
    tipo_organizacion_id,
    plaza_id,
    esquema,
    fecha_ingreso,
    fecha_nombramiento,
    activo
  } = req.body;

  // Verifica si hay una imagen nueva
  const imagen = req.file ? req.file.filename : null;

  // Construye la consulta de actualización
  const queryPersonal = `
    UPDATE personal SET
      nombre = ?,
      apellido_paterno = ?,
      apellido_materno = ?,
      direccion = ?,
      correo = ?,
      rfc = ?,
      curp = ?,
      fecha_nacimiento = ?,
      telefono = ?,
      sexo = ?,
      imagen = COALESCE(?, imagen) -- Solo actualizar si hay una nueva imagen
    WHERE personal_id = ?
  `;

  const personalData = [
    nombre,
    apellido_paterno,
    apellido_materno,
    direccion,
    correo,
    rfc,
    curp,
    fecha_nacimiento,
    telefono,
    sexo,
    imagen,
    id
  ];

  const queryDetalleLaboral = `
    UPDATE detalle_laboral SET
      sector_id = ?,
      zona_id = ?,
      municipio_id = ?,
      comunidad_id = ?,
      cct_id = ?,
      cargo_id = ?,
      tipo_direccion_id = ?,
      tipo_organizacion_id = ?,
      plaza_id = ?,
      esquema = ?,
      fecha_ingreso = ?,
      fecha_nombramiento = ?,
      activo = ?
    WHERE personal_id = ?
  `;

  const detalleLaboralData = [
    sector_id,
    zona_id,
    municipio_id,
    comunidad_id,
    cct_id,
    cargo_id,
    tipo_direccion_id,
    tipo_organizacion_id,
    plaza_id,
    esquema,
    fecha_ingreso,
    fecha_nombramiento,
    activo,
    id
  ];

  try {
    // Inicia una transacción
    await pool.promise().beginTransaction();

    // Actualiza los datos en la tabla `personal`
    await pool.promise().query(queryPersonal, personalData);

    // Actualiza los datos en la tabla `detalle_laboral`
    await pool.promise().query(queryDetalleLaboral, detalleLaboralData);

    // Confirma la transacción
    await pool.promise().commit();
    
    res.send("Actualización exitosa");
  } catch (error) {
    // Revierte la transacción en caso de error
    await pool.promise().rollback();
    console.error("Error al actualizar los datos:", error);
    res.status(500).send("Error al actualizar los datos");
  }
};








module.exports = {
  vistaPrincipal,
  vistaReviciones,
  vistaPendientes,
  vistaDocentesDisponibles,
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
  vistaListaDocente,
  vistaListaFederal,
  vistaInfoPersonal,
  vistaAgregarpersonal,
  agregarPersonal, // Exporta para manejar el POST de agregar personal
  actualizarPersonal
};
