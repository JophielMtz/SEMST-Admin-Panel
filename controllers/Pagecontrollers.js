const pool = require("../src/config/db");

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

const vistaListaPanelAdm = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        p.personal_id, 
        p.rfc, 
        p.nombre, 
        p.apellido_paterno, 
        p.apellido_materno, 
        p.edad, 
        p.telefono, 
        p.correo, 
        p.imagen,
        c.descripcion AS cargo
      FROM 
        personal p
      LEFT JOIN 
        detalle_laboral dl ON p.personal_id = dl.personal_id
      LEFT JOIN 
        cargos c ON dl.cargo_id = c.cargo_id
    `);
    res.render("lista-panel-adm", { personal: results });
  } catch (err) {
    console.error("Error al hacer la consulta:", err);
    res.status(500).send("Error en la consulta de la base de datos");
  }
};

const vistaListaGeneral = async (req, res) => {
  try {
    const [results] = await pool.query(`
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
    `);
    res.render("lista-general", { personal: results });
  } catch (err) {
    console.error("Error al hacer la consulta:", err);
    res.status(500).send("Error en la consulta de la base de datos");
  }
};


const vistaPerfil = (req, res) => {
  res.render("perfil");
};

const vistaListaFederal = (req, res) => {
  res.render("lista-federal");
};

const vistaInfoPersonal = (req, res) => {
  res.render("info-personal");
};


const vistaAgregarpersonal = async (req, res) => {
    const sectorId = req.body.sector_id || null;

    // Define las consultas
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
        res.render("agregar-personal", {
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

//Query agregar personal
const agregarPersonal = async (req, res) => {
  const {
    rfc,
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    sexo,
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
    id_relacion,
    activo,
    pausa,
  } = req.body;

  const imagen = req.file ? req.file.filename : null;

  try {
    await pool.query('START TRANSACTION'); // Inicia la transacción

    // Primer paso: Insertar en `personal`
    const insertPersonal = `
      INSERT INTO personal (rfc, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, telefono, correo, direccion, imagen) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultPersonal] = await pool.query(insertPersonal, [
      rfc,
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      telefono,
      correo,
      direccion,
      imagen,
    ]);

    const personal_id = resultPersonal.insertId; // Obtener el `personal_id` generado

    // Segundo paso: Insertar en `detalle_laboral`
    const insertDetalleLaboral = `
      INSERT INTO detalle_laboral (personal_id, cargo_id, id_relacion, tipo_organizacion_id, fecha_ingreso, fecha_nombramiento, tipo_direccion_id, plaza_id, activo, pausa) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertDetalleLaboral, [
      personal_id,
      cargo_id,
      id_relacion,
      tipo_organizacion_id,
      fecha_ingreso,
      fecha_nombramiento,
      tipo_direccion_id,
      plaza_id,
      activo || 1,
      pausa || 0,
    ]);

    await pool.query('COMMIT'); // Confirmar la transacción
    res.send("Datos recibidos correctamente");
  } catch (error) {
    await pool.query('ROLLBACK'); // Revertir la transacción en caso de error
    console.error("Error al insertar datos en personal y detalle laboral:", error);
    res.status(500).send("Error al insertar datos en personal y detalle laboral");
  }
};


const vistaEditarPersonal = async (req, res) => {
  const { id } = req.params;

  try {
    // Consulta para obtener los datos del personal y detalle laboral
    const [personalData] = await pool.query(
      `SELECT 
          p.personal_id,
          p.nombre,
          p.apellido_paterno,
          p.apellido_materno,
          p.direccion,
          p.correo,
          p.rfc,
          p.curp,
          p.fecha_nacimiento,
          p.telefono,
          p.sexo,
          p.imagen,
          dl.cargo_id,
          dl.tipo_direccion_id,
          dl.tipo_organizacion_id,
          dl.plaza_id,
          dl.fecha_ingreso,
          dl.fecha_nombramiento,
          dl.activo,
          uc.zona_id,
          uc.sector_id,
          uc.municipio_id,
          uc.comunidad_id,
          uc.cct_id
       FROM personal p
       LEFT JOIN detalle_laboral dl ON p.personal_id = dl.personal_id
       LEFT JOIN ubic_ccts uc ON dl.id_relacion = uc.id_relacion
       WHERE p.personal_id = ?
      `,
      [id]
    );

    // Verificar si se encontró el personal
    if (personalData.length === 0) {
      return res.status(404).send("Personal no encontrado");
    }

    // Detectar si la solicitud es AJAX
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      // Renderizar solo el formulario parcial sin layout
      return res.render("partials/form-editar-personal", { layout: false, personal: personalData[0] });
    }

    // Renderizar la vista completa con layout
    return res.render("editar-personal", { personal: personalData[0] });
  } catch (error) {
    console.error("Error al obtener los datos del personal:", error);
    res.status(500).send("Error al cargar la vista de edición");
  }
};




const actualizarPersonal = async (req, res) => {
  console.log('Datos recibidos en el servidor:', req.body);
  const { id } = req.params; // ID del personal a actualizar
  const datosActualizar = req.body;

  // Dividimos los datos para actualizar en `personal`, `detalle_laboral` y `ubic_ccts`
  const datosPersonal = {};
  const datosDetalleLaboral = {};
  const datosUbicacion = {};

  // Separar los datos de acuerdo a las columnas de cada tabla
  for (const campo in datosActualizar) {
    const valor = datosActualizar[campo];
    if (valor) { // Solo incluye si el valor no está vacío
      if (["nombre", "apellido_paterno", "apellido_materno", "direccion", "correo", "rfc", "curp", "fecha_nacimiento", "telefono", "sexo", "imagen"].includes(campo)) {
        datosPersonal[campo] = valor;
      } else if (["cargo_id", "tipo_organizacion_id", "activo", "fecha_ingreso", "fecha_nombramiento", "tipo_direccion_id", "plaza_id", "id_relacion"].includes(campo)) {
        datosDetalleLaboral[campo] = valor;
      } else if (["zona_id", "sector_id", "comunidad_id", "municipio_id", "cct_id"].includes(campo)) {
        datosUbicacion[campo] = valor;
      }
    }
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    if (Object.keys(datosPersonal).length > 0) {
      const camposPersonal = Object.keys(datosPersonal).map(campo => `${campo} = ?`).join(", ");
      const valoresPersonal = [...Object.values(datosPersonal), id];
      const queryPersonal = `UPDATE personal SET ${camposPersonal} WHERE personal_id = ?`;
      await connection.query(queryPersonal, valoresPersonal);
    }

    // Paso 2: Buscar `ubic_ccts` existente
    let idRelacion;
    if (Object.keys(datosUbicacion).length > 0) {
      // Verificamos si existe un registro en `ubic_ccts` que coincida con la ubicación proporcionada
      const camposUbicacion = Object.keys(datosUbicacion).map(campo => `${campo} = ?`).join(" AND ");
      const valoresUbicacion = Object.values(datosUbicacion);
      const queryVerificarUbicacion = `SELECT id_relacion FROM ubic_ccts WHERE ${camposUbicacion} LIMIT 1`;
      const [rowsUbicacion] = await connection.query(queryVerificarUbicacion, valoresUbicacion);

      if (rowsUbicacion.length > 0) {
        idRelacion = rowsUbicacion[0].id_relacion;
      } else {
        // Si no existe una ubicación que coincida, retornamos un error en JSON
        return res.status(400).json({ success: false, message: "La combinación de zona, sector, comunidad, municipio y CCT especificada no existe." });
      }
    }

    // Paso 3: Actualizar `detalle_laboral` con el `id_relacion` existente en `ubic_ccts`
    if (Object.keys(datosDetalleLaboral).length > 0 || idRelacion) {
      if (idRelacion) datosDetalleLaboral.id_relacion = idRelacion;
      const camposDetalle = Object.keys(datosDetalleLaboral).map(campo => `${campo} = ?`).join(", ");
      const valoresDetalle = [...Object.values(datosDetalleLaboral), id];
      const queryDetalleLaboral = `UPDATE detalle_laboral SET ${camposDetalle} WHERE personal_id = ?`;
      await connection.query(queryDetalleLaboral, valoresDetalle);
    }

    // Confirmar la transacción
    await connection.commit();

    // Enviar respuesta JSON indicando éxito
    res.json({ success: true, message: "Actualización exitosa" });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error al actualizar los datos:", error);
    res.status(500).json({ success: false, message: "Error al actualizar los datos" });
  } finally {
    if (connection) connection.release();
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
  vistaPerfil,
  vistaListaFederal,
  vistaInfoPersonal,
  vistaAgregarpersonal,
  agregarPersonal,
  actualizarPersonal,
  vistaEditarPersonal
};
