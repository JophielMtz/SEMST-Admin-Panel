const express = require('express');
const { 
  vistaEditarPersonal, vistaAgregarpersonal, 
  agregarPersonal, actualizarPersonal,
  editarDocente, editarPendientes, editarBecas, editarSalud, editarCCTS, editarSolicitudesPersonal, editarIncidencias, editarLicenciaSinGoce, editarEscuelasDisponibles, editarNombramientosDocentes, editarSolicitudes, editarInternos, editarSolicitudesGenerales,editarSolicitudesDeCambio, editarListaPanelAdministrador,
   obtenerSolicitudesDeCambio, obtenerPersonal, obtenerDetallePersonal, obtenerPendientes,obtenerListaGeneral, obtenerDocentesDisponibles, obtenerBecas, obtenerSalud, obtenerSolicitudesPersonal,  obtenerIncidencias, obtenerLicenciaSinGoce, obtenerEscuelasDisponibles, obtenerNombramientosDocentes, obtenerSolicitudes, obtenerInternos,  obtenerSolicitudesGenerales, obtenerUbicCCTs,  obtenerListaPanelAdministrador, borrarFila, login } = require('../controllers/Pagecontrollers');


const vistasController = require('../controllers/vistas');
const usuarios = require('../auth/authController');
const router = express.Router();
const pool = require('../src/config/db'); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads')); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
    }
  });

const upload = multer({ storage: storage });

//=======Ruta para registros de usuarios===========//
router.post('/registrar', upload.single('imagen'), usuarios.registroUsuario);
router.post('/loginUser', usuarios.login);
router.get('/perfil', usuarios.autenticarToken);



//=======Ruta para vistas===========//
router.get('/login', vistasController.vistaLogin);
router.get('/sign-up', vistasController.vistaSignUp);
router.get('/home', vistasController.vistaPrincipal);
router.get('/revisiones', vistasController.vistaReviciones);
router.get('/cambio', vistasController.vistaCambio);
router.get('/pendientes', vistasController.vistaPendientes);
router.get('/docentes-disponibles', vistasController.vistaDocentesDisponibles);
router.get('/lista-general', vistasController.vistaListaGeneral);
router.get('/beca-comision', vistasController.vistaBecaComision);
router.get('/apoyo-lentes', vistasController.vistaApoyoLentes);
router.get('/nombramientos-docentes', vistasController.vistaNombramientosDocentes);
router.get('/licencias-sin-goce', vistasController.vistaLicenciasSinGoce);
router.get('/incidencias', vistasController.vistaIncidencias);
router.get('/calendario', vistasController.vistaCalendario);
router.get('/solicitudes-generales', vistasController.vistaSolicitudesGenerales);
router.get('/solicitudes-personal', vistasController.vistaSolicitudesPersonal);
router.get('/salud', vistasController.vistaSalud);
router.get('/lista-panel-adm', vistasController.vistaListaPanelAdm);
router.get('/perfil', vistasController.vistaPerfil);
router.get('/roles', vistasController.vistaRoles);
router.get('/info-personal', vistasController.vistaInfoPersonal);
router.get('/solicitudes', vistasController.VistaSolicitudes);

//========== Endpoints para Apis =============//
router.get('/api/personal/:personal_id',  obtenerDetallePersonal);
router.get('/getPendientes', obtenerPendientes);
router.get('/getDocentesDisponibles', obtenerDocentesDisponibles);
router.get('/api/personal', obtenerPersonal);
router.get('/getBecas', obtenerBecas);
router.get('/getSalud', obtenerSalud);
router.get('/getSolicitudesPersonal', obtenerSolicitudesPersonal);
router.get('/getSolicitudesGenerales', obtenerSolicitudesGenerales);
router.get('/getSolicitudesDeCambio', obtenerSolicitudesDeCambio);
router.get('/getIncidencias', obtenerIncidencias);
router.get('/getLicenciaSinGoce', obtenerLicenciaSinGoce);
router.get('/getlistaPanelAdm', obtenerListaPanelAdministrador);
router.get('/getEscuelasDisponibles', obtenerEscuelasDisponibles);
router.get('/getNombramientosDocentes', obtenerNombramientosDocentes);
router.get('/getSolicitudes', obtenerSolicitudes);
router.get('/getInternos', obtenerInternos);
router.get ('/getUbicCCTs', obtenerUbicCCTs);



///========Ruta Endpoints funcion Editar==========//
router.put('/editarDocente', editarDocente);
router.post('/editarCCTS', editarCCTS);
router.put('/editarPendientes', editarPendientes)
router.put('/editarBecas', editarBecas)
router.put('/editarSalud', editarSalud)
router.put('/editarSolicitudesPersonal', editarSolicitudesPersonal);
router.put('/editarSolicitudesGenerales', editarSolicitudesGenerales);
router.put('/editarSolicitudesDeCambio', editarSolicitudesDeCambio);
router.put('/editarIncidencias', editarIncidencias);
router.put('/editarLicenciaSinGoce', editarLicenciaSinGoce);
router.put('/editarEscuelasDisponibles', editarEscuelasDisponibles);
router.put('/editarNombramientosDocentes', editarNombramientosDocentes);
router.put('/editarSolicitudes', editarSolicitudes);
router.put('/editarInternos', editarInternos);
router.put('/editarListaPanelAdm', editarListaPanelAdministrador);



router.get('/api/listaGeneral', obtenerListaGeneral);
router.get('/agregar-personal', vistaAgregarpersonal);
router.get('/editar-personal', vistaEditarPersonal);

//=======Endpoint para guardar registros en tablas===========//
router.post('/guardarRegistro', async (req, res) => {
  console.log("Datos recibidos en req.body:", req.body);

  const { tabla, ...data } = req.body;

  const tablasPermitidas = [
      'docentes_disponibles',
      'solicitudes_de_cambio',
      'pendientes',
      'nombramientos',
      'licencia_sin_goce',
      'salud_inseguridad',
      'incidencias',
      'becas_comision',
      'nombramientos',
      'solicitudes_de_cambio',
      'solicitudes_de_personal',
      'solicitudes_generales',
      'solicitudes_de_personal',
  ];

  if (!tabla || !tablasPermitidas.includes(tabla)) {
      return res.status(400).send("Tabla no válida o no especificada.");
  }

  const connection = await pool.getConnection();
  try {
      // Manejar `detalle_laboral_id` solo si la tabla es `solicitudes_de_cambio`
      if (tabla === 'solicitudes_de_cambio') {
          if (!data.personal_id) {
              return res.status(400).send("Falta el campo `personal_id` para calcular `detalle_laboral_id`.");
          }

          // Obtener `detalle_laboral_id` para `solicitudes_de_cambio`
          const [result] = await connection.query(
              `SELECT detalle_laboral_id FROM detalle_laboral WHERE personal_id = ? LIMIT 1`,
              [data.personal_id]
          );

          if (result.length === 0) {
              return res.status(400).send("No se encontró un `detalle_laboral_id` para el `personal_id` proporcionado.");
          }

          // Agregar `detalle_laboral_id` al conjunto de datos
          data.detalle_laboral_id = result[0].detalle_laboral_id;
      }

      // Obtener las columnas válidas de la tabla
      const [columns] = await connection.query(`DESCRIBE ${tabla}`);
      const columnasValidas = columns.map(col => col.Field);

      // Filtrar los datos para incluir solo las columnas válidas
      const datosInsertar = Object.keys(data)
          .filter(key => columnasValidas.includes(key))
          .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
          }, {});

      // Verificar si faltan columnas requeridas
      const columnasRequeridas = columns
          .filter(col => col.Null === 'NO' && col.Default === null && col.Extra !== 'auto_increment')
          .map(col => col.Field);

      const camposFaltantes = columnasRequeridas.filter(col => !(col in datosInsertar));
      if (camposFaltantes.length > 0) {
          return res.status(400).send(`Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`);
      }

      // Construir la consulta de inserción
      const campos = Object.keys(datosInsertar);
      const valores = Object.values(datosInsertar);
      const placeholders = campos.map(() => '?').join(', ');

      const insertQuery = `INSERT INTO ${tabla} (${campos.join(', ')}) VALUES (${placeholders})`;
      const [result] = await connection.query(insertQuery, valores);

      res.status(201).json({
          message: `Registro creado exitosamente en la tabla ${tabla}.`,
          id: result.insertId,
      });
  } catch (error) {
      console.error("Error al guardar registro:", error);
      res.status(500).send(`Error al crear el registro: ${error.message}`);
  } finally {
      connection.release();
  }
});



router.post('/personal/agregar', upload.single('imagen'), agregarPersonal);



// Obtener zonas por sector
router.get('/obtener-zonas/:sectorId', async (req, res) => {
  const sectorId = req.params.sectorId;

  const queryZonas = `
    SELECT DISTINCT 
      z.zona_id, 
      z.numero_zona
    FROM ubic_ccts uc
    JOIN zona z ON uc.zona_id = z.zona_id
    WHERE uc.sector_id = ?
  `;

  try {
    const [results] = await pool.query(queryZonas, [sectorId]);

    const zonas = results.map(row => ({
      zona_id: row.zona_id,
      numero_zona: row.numero_zona
    }));

    res.json({ zonas });
  } catch (err) {
    console.error('Error al obtener las zonas:', err);
    res.status(500).json({ error: 'Error al obtener las zonas.' });
  }
});

// Obtener municipios por sector y zona
router.get('/obtener_municipios', async (req, res) => {
  const { sectorId, zonaId } = req.query;

  if (!sectorId || !zonaId) {
    return res.status(400).json({ error: 'Los parámetros sectorId y zonaId son requeridos.' });
  }

  const queryMunicipios = `
    SELECT DISTINCT
      m.municipio_id,
      m.nombre AS nombre_municipio
    FROM ubic_ccts uc
    JOIN municipio m ON uc.municipio_id = m.municipio_id
    WHERE uc.sector_id = ?
      AND uc.zona_id = ?
  `;

  try {
    const [results] = await pool.query(queryMunicipios, [sectorId, zonaId]);

    const municipios = results.map(row => ({
      municipio_id: row.municipio_id,
      nombre_municipio: row.nombre_municipio
    }));

    res.json({ municipios });
  } catch (err) {
    console.error('Error al obtener los municipios:', err);
    res.status(500).json({ error: 'Error al obtener los municipios.' });
  }
});

// Obtener comunidades por sector, zona y municipio
router.get('/obtener-comunidades', async (req, res) => {
  const { sectorId, zonaId, municipioId } = req.query;

  if (!sectorId || !zonaId || !municipioId) {
    return res.status(400).json({ error: 'Los parámetros sectorId, zonaId y municipioId son requeridos.' });
  }

  const queryComunidades = `
    SELECT DISTINCT
      com.comunidad_id,
      com.nombre AS nombre_comunidad
    FROM ubic_ccts uc
    JOIN comunidad com ON uc.comunidad_id = com.comunidad_id
    WHERE uc.sector_id = ?
      AND uc.zona_id = ?
      AND uc.municipio_id = ?
  `;

  try {
    const [results] = await pool.query(queryComunidades, [sectorId, zonaId, municipioId]);

    const comunidades = results.map(row => ({
      comunidad_id: row.comunidad_id,
      nombre_comunidad: row.nombre_comunidad
    }));

    res.json({ comunidades });
  } catch (err) {
    console.error('Error al obtener las comunidades:', err);
    res.status(500).json({ error: 'Error al obtener las comunidades.' });
  }
});

// Obtener CCTs por sector, zona, municipio y comunidad
router.get('/obtener-ccts', async (req, res) => {
  const { sectorId, zonaId, municipioId, comunidadId } = req.query;

  if (!sectorId || !zonaId || !municipioId || !comunidadId) {
    return res.status(400).json({ error: 'Todos los parámetros (sectorId, zonaId, municipioId, comunidadId) son requeridos.' });
  }

  const queryCCTs = `
    SELECT DISTINCT 
      c.cct_id, 
      c.centro_clave_trabajo 
    FROM ubic_ccts uc
    JOIN ccts c ON uc.cct_id = c.cct_id
    WHERE uc.sector_id = ?
      AND uc.zona_id = ?
      AND uc.municipio_id = ?
      AND uc.comunidad_id = ?
  `;

  try {
    const [results] = await pool.query(queryCCTs, [sectorId, zonaId, municipioId, comunidadId]);

    const ccts = results.map(row => ({
      cct_id: row.cct_id,
      centro_clave_trabajo: row.centro_clave_trabajo
    }));

    res.json({ ccts });
  } catch (err) {
    console.error('Error al obtener las CCTs:', err);
    res.status(500).json({ error: 'Error al obtener las CCTs.' });
  }
});


//post


//delete
router.delete('/deleteRecord', borrarFila);



//Endpoints para obtener datos de ubic ccts
router.get('/obtener-zonas/:sectorId', async (req, res) => {
  const { sectorId } = req.params;

  try {
    const [zonas] = await pool.query(`
      SELECT DISTINCT 
        z.zona_id, 
        z.numero_zona AS nombre_zona
      FROM 
        zona z
      INNER JOIN 
        ubic_ccts uc
      ON 
        z.zona_id = uc.zona_id
      WHERE 
        uc.sector_id = ?
    `, [sectorId]);

    res.status(200).json(zonas);
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    res.status(500).json({ error: 'Error al obtener zonas.' });
  }
});




router.get('/obtener-municipios', async (req, res) => {
  try {
    const [municipios] = await pool.query(`
      SELECT municipio_id, nombre AS nombre_municipio
      FROM municipio
    `);
    res.json(municipios);
  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({ error: 'Error al obtener municipios.' });
  }
});

router.get('/obtener-comunidades/:municipioId', async (req, res) => {
  const { municipioId } = req.params;
  try {
    const [comunidades] = await pool.query(`
      SELECT DISTINCT c.comunidad_id, c.nombre AS nombre_comunidad
      FROM ubic_ccts uc
      JOIN comunidad c ON uc.comunidad_id = c.comunidad_id
      WHERE uc.municipio_id = ?
    `, [municipioId]);
    res.json(comunidades);
  } catch (error) {
    console.error('Error al obtener comunidades:', error);
    res.status(500).json({ error: 'Error al obtener comunidades.' });
  }
});

router.get('/obtener-ccts/:municipioId/:comunidadId', async (req, res) => {
  const { municipioId, comunidadId } = req.params;
  try {
    const [ccts] = await pool.query(`
      SELECT c.cct_id, c.centro_clave_trabajo
      FROM ubic_ccts uc
      JOIN ccts c ON uc.cct_id = c.cct_id
      WHERE uc.municipio_id = ? AND uc.comunidad_id = ?
    `, [municipioId, comunidadId]);
    res.json(ccts);
  } catch (error) {
    console.error('Error al obtener claves CCT:', error);
    res.status(500).json({ error: 'Error al obtener claves CCT.' });
  }
});


//tablas docentes disponibles y solicitudes de cambio
router.get('/buscarpersonal/:valor', async (req, res) => {
  try {
    const { valor } = req.params;
    console.log('Parameter valor:', valor); 

    let query = `
      SELECT 
          personal.personal_id,
    personal.nombre AS nombre_personal,
    personal.apellido_paterno,
    personal.apellido_materno,
    personal.telefono,
    detalle_laboral.fecha_ingreso,
    detalle_laboral.antiguedad,
    ccts.centro_clave_trabajo AS clave_cct,
    ubic_ccts.zona_id,
    ubic_ccts.sector_id,
    municipio.nombre AS nombre_municipio,
    comunidad.nombre AS nombre_comunidad,
    personal.imagen -- Campo que contiene el nombre del archivo de imagen
FROM 
    personal
JOIN 
    detalle_laboral ON personal.personal_id = detalle_laboral.personal_id
JOIN 
    ubic_ccts ON detalle_laboral.id_relacion = ubic_ccts.id_relacion
LEFT JOIN 
    municipio ON ubic_ccts.municipio_id = municipio.municipio_id
LEFT JOIN 
    comunidad ON ubic_ccts.comunidad_id = comunidad.comunidad_id
LEFT JOIN 
    ccts ON ubic_ccts.cct_id = ccts.cct_id
    `;

    const params = [];

    if (/^\d+$/.test(valor)) {
      query += 'WHERE personal.personal_id = ? OR ';
      params.push(valor);
    } else {
      query += 'WHERE ';
    }

    query += 'LOWER(personal.nombre) LIKE LOWER(?)';
    params.push(`%${valor}%`);

    const [results] = await pool.query(query, params);
    res.json(results); 
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error' });
  }
});



//api de docentes
router.post('/guardarRegistro', async (req, res) => {
    console.log("Datos recibidos en req.body:", req.body);

    const { tabla, cct_entra, municipio_entra, comunidad_entra, ...data } = req.body;

    console.log("Tabla solicitada:", tabla);
    console.log("Datos restantes:", data);
    console.log("Datos de entrada - cct_entra:", cct_entra, "municipio_entra:", municipio_entra, "comunidad_entra:", comunidad_entra);

    const tablasPermitidas = ['docentes_disponibles', 'solicitudes_de_cambio', 'pendientes', 'nombramientos', 'licencia_sin_goce', 'salud_inseguridad'];
    if (!tabla || !tablasPermitidas.includes(tabla)) {
        console.error("Tabla no válida:", tabla);
        return res.status(400).send("Tabla no válida o no especificada.");
    }

    const connection = await pool.getConnection();
    try {
        // Si se proporcionan datos para "entra", procesar la lógica correspondiente
        if (cct_entra && municipio_entra && comunidad_entra) {
            console.log("Buscando id_relacion para los datos proporcionados...");
            const [nuevoIdRelacion] = await connection.query(
                `
                SELECT id_relacion
                FROM ubic_ccts
                WHERE cct_id = (SELECT cct_id FROM ccts WHERE centro_clave_trabajo = ?)
                  AND municipio_id = (SELECT municipio_id FROM municipio WHERE nombre = ?)
                  AND comunidad_id = (SELECT comunidad_id FROM comunidad WHERE nombre = ?)
                LIMIT 1
                `,
                [cct_entra, municipio_entra, comunidad_entra]
            );

            console.log("Resultado de id_relacion:", nuevoIdRelacion);

            if (!nuevoIdRelacion.length) {
                console.error("No se encontró id_relacion para los datos:", { cct_entra, municipio_entra, comunidad_entra });
                return res.status(404).send("Ubicación no encontrada para los datos proporcionados.");
            }

            const idRelacion = nuevoIdRelacion[0].id_relacion;
            console.log("id_relacion encontrado:", idRelacion);

            // Actualizar detalle_laboral con el nuevo id_relacion
            console.log(`Actualizando detalle_laboral para personal_id: ${data.personal_id} con id_relacion: ${idRelacion}`);
            await connection.query(
                `UPDATE detalle_laboral SET id_relacion = ? WHERE personal_id = ?`,
                [idRelacion, data.personal_id]
            );

            // Registrar en historial_movimientos
            console.log(`Registrando en historial_movimientos para personal_id: ${data.personal_id}, id_relacion: ${idRelacion}`);
            await connection.query(
                `
                INSERT INTO historial_movimientos (personal_id, detalle_laboral_id, ubic_ccts_id, fecha_movimiento, tipo_movimiento, observaciones)
                VALUES (?, (SELECT detalle_laboral_id FROM detalle_laboral WHERE personal_id = ?), ?, CURDATE(), 'Cambio de CCT', ?)
                `,
                [data.personal_id, data.personal_id, idRelacion, `CCT actualizado a ${cct_entra}`]
            );
        }

        // Continuar con la lógica de inserción en la tabla seleccionada
        console.log("Obteniendo columnas válidas de la tabla:", tabla);
        const [columns] = await connection.query(`DESCRIBE ${tabla}`);
        const columnasValidas = columns.map(col => col.Field);

        console.log("Columnas válidas obtenidas:", columnasValidas);

        const datosInsertar = Object.keys(data)
            .filter(key => columnasValidas.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});

        console.log("Datos para insertar:", datosInsertar);

        const campos = Object.keys(datosInsertar);
        const valores = Object.values(datosInsertar);
        const placeholders = campos.map(() => '?').join(', ');

        console.log("Campos a insertar:", campos);
        console.log("Valores a insertar:", valores);

        const insertQuery = `INSERT INTO ${tabla} (${campos.join(', ')}) VALUES (${placeholders})`;
        console.log("Consulta de inserción generada:", insertQuery);

        const [result] = await connection.query(insertQuery, valores);

        console.log("Resultado de la inserción:", result);

        res.status(201).json({ message: `Registro creado exitosamente en la tabla ${tabla}.`, id: result.insertId });
    } catch (error) {
        console.error("Error al guardar registro:", error);
        res.status(500).send(`Error al crear el registro: ${error.message}`);
    } finally {
        connection.release();
        console.log("Conexión liberada.");
    }
});






router.post('/deleteDocente', async (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.json({ success: false, error: 'ID no proporcionado.' });
  }

  try {
    const [result] = await pool.query('DELETE FROM docentes_disponibles WHERE np = ?', [id]);

    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, error: 'No se encontró el docente.' });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: 'Error al eliminar el docente.' });
  }
});




module.exports = router;