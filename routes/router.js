const express = require('express');
const { vistaAgregarpersonal, 
  agregarPersonal, actualizarPersonal,
  editarDocente, editarPendientes, editarBecas, editarSalud, editarCCTS, editarSolicitudesPersonal, editarIncidencias, editarLicenciaSinGoce, editarEscuelasDisponibles, editarNombramientosDocentes, editarSolicitudes, editarInternos, editarSolicitudesGenerales,editarSolicitudesDeCambio, editarListaPanelAdministrador,  
  obtenerSolicitudesDeCambio, obtenerPersonal, obtenerDetallePersonal, obtenerPendientes,obtenerListaGeneral, obtenerDocentesDisponibles, obtenerBecas, obtenerSalud, obtenerSolicitudesPersonal,  obtenerIncidencias, obtenerLicenciaSinGoce, obtenerEscuelasDisponibles, obtenerNombramientosDocentes, obtenerSolicitudes, obtenerInternos,   obtenerSolicitudesGenerales, obtenerUbicCCTs,  obtenerListaPanelAdministrador, borrarFila, borrarUsuario,
  editarRol,
} = require('../controllers/Pagecontrollers');

const { EditarPerfilPersonal } = require('../controllers/Api-Patch/editar-perfil-personal');

const editarTablas = require('../public/js/components/table/table-controller'); 
const vistasController = require('../controllers/vistas');
const checkRol = require('../src/config/middlewares/checkRol');
const autenticarToken = require('../src/config/middlewares/autenticarToken');
const authViews = require('../src/config/middlewares/authViews'); 
const usuarios = require('../auth/authController');
const router = express.Router();
const pool = require('../src/config/db'); 
const multer = require('multer');
const path = require('path');
const Joi = require('joi');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '..', 'uploads', 'Fotos-de-perfil-personal');

      // Crea el directorio principal si no existe (solo una vez)
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      const idUsuario = req.params.id;
      const nombreUsuario = req.body.nombre || "sin_nombre"; // Manejo si no viene el nombre
      const sanitizedNombre = nombreUsuario.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitiza el nombre

      const nombreArchivo = `${idUsuario}-${sanitizedNombre}${path.extname(file.originalname)}`;
      cb(null, nombreArchivo);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
      } else {
          cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes JPEG, JPG, PNG y GIF.'), false);
      }
  }
});

//=======Ruta para registros de usuarios===========//
router.post('/registrar', upload.single('imagen'), usuarios.registroUsuario);
router.post('/loginUser', usuarios.login);
// router.get('/perfil', usuarios. vistasController.vistaPerfil);
router.post('/logout', usuarios.logout);

//=======Ruta sin autenticacion===========//
router.get('/login', vistasController.vistaLogin);
router.get('/sign-up', vistasController.vistaSignUp);


//=======Ruta para vistas===========//
// router.get('/home', autenticarToken, checkRol(['admin']), vistasController.vistaPrincipal);
router.get('/home', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaPrincipal);
router.get('/roles', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaRoles);
router.get('/lista-panel-adm', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaListaPanelAdm);
router.get('/gestion-de-personal', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaGestionPersonal);
router.get('/agregar-personal', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistaAgregarpersonal);
router.get('/docentes-disponibles', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaDocentesDisponibles);
router.get('/revisiones', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaReviciones);
router.get('/cambio', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaCambio);
router.get('/pendientes', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaPendientes);
router.get('/docentes-disponibles', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaDocentesDisponibles);
router.get('/lista-general', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaListaGeneral);
router.get('/beca-comision', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaBecaComision);
router.get('/apoyo-lentes', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaApoyoLentes);
router.get('/nombramientos-docentes', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaNombramientosDocentes);
router.get('/licencias-sin-goce', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaLicenciasSinGoce);
router.get('/incidencias', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaIncidencias);
router.get('/calendario', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaCalendario);
router.get('/solicitudes-generales', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaSolicitudesGenerales);
router.get('/solicitudes-personal', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaSolicitudesPersonal);
router.get('/salud', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaSalud);
router.get('/info-personal', autenticarToken, authViews, checkRol(['super-admin', 'admin', '']), vistasController.vistaInfoPersonal);
router.get('/solicitudes', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.VistaSolicitudes);
router.get('/calendario', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaCalendario);
router.get('/403', vistasController.vista403);
router.get('/lista-pendientes', autenticarToken, authViews, checkRol(['super-admin', 'admin', 'usuario']), vistasController.vistaListaPendientes);


router.get('/profile', vistasController.vistaProfile);

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

//======Ruta para obtener el perfil de un personal==========//
router.get('/getlistaPanelAdm/:personal_id', obtenerPersonal);
router.get('/perfil/:id', autenticarToken, authViews, checkRol(['super-admin', 'admin', '']), vistasController. vistaIdPerfil);

///========Ruta Endpoints funcion Editar==========//
router.put('/editarDocente', editarDocente);
router.post('/editarCCTS', editarCCTS);

///========Ruta Editar Tablas==========//
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

///========Ruta Roles==========//
router.patch('/editarRol', editarRol);
router.patch('/editarTabla', editarTablas.editar);

///========Ruta Editar-Perfil-personal==========//
router.patch('/editar-personal/:id', upload.single('imagen'), EditarPerfilPersonal);





router.get('/api/listaGeneral', obtenerListaGeneral);



//=======Endpoint para guardar registros en tablas===========//
router.post('/guardarRegistro', async (req, res) => {
  console.log("Datos recibidos en req.body antes de limpiar:", req.body);

  const { tabla, ...data } = req.body;

  const tablasPermitidas = [
      'docentes_disponibles',
      'solicitudes_de_cambio',
      'lista_pendientes',
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

  // Limpiar datos
  Object.keys(data).forEach((key) => {
      if (
          data[key] === '' ||  // Valores vacíos
          data[key] === 'Seleccione un estatus' || 
          data[key] === 'Selecciona una opción' || 
          data[key] === 'Seleccione Municipio' ||  // Convertir "Seleccione Municipio" a null
          data[key] === 'Seleccione Comunidad' ||  // Convertir "Seleccione Comunidad" a null
          data[key] === 'Seleccione Clave CCT'     // Convertir "Seleccione Clave CCT" a null
      ) {
          data[key] = null;  // Convertir valores inválidos a NULL
      }
  });

  console.log("Datos después de limpiar:", data);  // Verifica cómo quedan los datos después de limpiar

  const connection = await pool.getConnection();
  try {
      if (tabla === 'solicitudes_de_cambio') {
          if (!data.personal_id) {
              return res.status(400).send("Falta el campo `personal_id` para calcular `detalle_laboral_id`.");
          }

          const [result] = await connection.query(
              `SELECT detalle_laboral_id FROM detalle_laboral WHERE personal_id = ? LIMIT 1`,
              [data.personal_id]
          );

          if (result.length === 0) {
              return res.status(400).send("No se encontró un `detalle_laboral_id` para el `personal_id` proporcionado.");
          }

          data.detalle_laboral_id = result[0].detalle_laboral_id;
      }

      const [columns] = await connection.query(`DESCRIBE ${tabla}`);
      const columnasValidas = columns.map(col => col.Field);

      const datosInsertar = Object.keys(data)
          .filter(key => columnasValidas.includes(key))
          .reduce((obj, key) => {
              obj[key] = data[key] === '' ? null : data[key];
              return obj;
          }, {});

      const columnasRequeridas = columns
          .filter(col => col.Null === 'NO' && col.Default === null && col.Extra !== 'auto_increment')
          .map(col => col.Field);

      const camposFaltantes = columnasRequeridas.filter(col => !(col in datosInsertar));
      if (camposFaltantes.length > 0) {
          return res.status(400).send(`Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`);
      }

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



//delete
router.delete('/deleteRecord', autenticarToken, authViews, checkRol(['admin', 'super-admin']), borrarFila);
router.delete('/deleteUser',  borrarUsuario);



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



const registroSchema = Joi.object({
  tabla: Joi.string().valid('docentes_disponibles', 'solicitudes_de_cambio', 'pendientes', 'nombramientos', 'licencia_sin_goce', 'salud_inseguridad').required(),
  personal_id: Joi.number().integer().required(),
  nombre_docente: Joi.string().required(),
  telefono: Joi.string().pattern(/^\d{10}$/).required(),
  antiguedad: Joi.number().integer().min(0).required(),
  fecha: Joi.date().iso().required(),
  municipio_sale: Joi.string().required(),
  comunidad_sale: Joi.string().required(),
  cct_sale: Joi.string().required(),
  tipo_organizacion: Joi.string().valid('Unitaria', 'Bidocente', 'Tridocente', 'Organización completa').allow(null, ''),
  zona: Joi.string().allow(null, ''),
  sector: Joi.string().allow(null, ''),
  no_alumnos: Joi.number().integer().allow(null),
  grado_1: Joi.string().allow(null, '').custom((value, helper) => { return value === '' ? null : value; }),
  grado_2: Joi.string().allow(null, ''),
  grado_3: Joi.string().allow(null, ''),
  funcion_docente: Joi.string().allow(null, ''),
  tipo_nombramiento: Joi.string().allow(null, ''),
  inicio_movimiento: Joi.date().iso().required(),
  termino_movimiento: Joi.date().iso().required(),
  propuesta: Joi.string().allow(null, ''),
  subdireccion_academica: Joi.string().allow(null, ''),
  subdireccion_planeacion: Joi.string().allow(null, ''),
  subdireccion_administracion: Joi.string().allow(null, ''),
  usicamm: Joi.string().allow(null, ''),
  recursos_humanos: Joi.string().allow(null, ''),
  juridico: Joi.string().allow(null, ''),
  observaciones_secretaria_general: Joi.string().allow(null, ''),
  estatus_movimiento: Joi.string().allow(null, ''),
  observaciones: Joi.string().allow(null, '')
});

//api de docentes
router.post('/guardarRegistro', async (req, res) => {
  console.log("Datos recibidos en req.body:", req.body);

  // Validar los datos de entrada
  const { error, value } = registroSchema.validate(req.body, { abortEarly: false });

  if (error) {
      console.error("Errores de validación:", error.details);
      return res.status(400).json({ errors: error.details });
  }

  // Desestructurar los valores validados
  const { tabla, cct_entra, municipio_entra, comunidad_entra, ...data } = value;

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
      // Procesar lógica para "entra" si se proporcionan datos
      if (cct_entra && municipio_entra && comunidad_entra) {
          console.log("Buscando id_relacion para los datos proporcionados...");
          const [nuevoIdRelacion] = await connection.query(
              `SELECT id_relacion
               FROM ubic_ccts
               WHERE cct_id = (SELECT cct_id FROM ccts WHERE centro_clave_trabajo = ?)
                 AND municipio_id = (SELECT municipio_id FROM municipio WHERE nombre = ?)
                 AND comunidad_id = (SELECT comunidad_id FROM comunidad WHERE nombre = ?)
               LIMIT 1`,
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
              `INSERT INTO historial_movimientos (personal_id, detalle_laboral_id, ubic_ccts_id, fecha_movimiento, tipo_movimiento, observaciones)
               VALUES (?, (SELECT detalle_laboral_id FROM detalle_laboral WHERE personal_id = ?), ?, CURDATE(), 'Cambio de CCT', ?)`,
              [data.personal_id, data.personal_id, idRelacion, `CCT actualizado a ${cct_entra}`]
          );
      }

      // **Paso Crítico: Convertir valores vacíos y placeholders a NULL**
      const datosInsertar = Object.keys(data).reduce((obj, key) => {
          let valor = data[key];

          if (typeof valor === 'string') {
              valor = valor.trim(); // Eliminar espacios en blanco
              const valorLower = valor.toLowerCase(); // Convertir a minúsculas para comparación insensible a mayúsculas

              // Lista de valores que deben convertirse a NULL
              const placeholders = ['selecciona una opción', ''];

              if (placeholders.includes(valorLower)) {
                  console.log(`Convirtiendo ${key} de '${data[key]}' a null`);
                  obj[key] = null;
              } else {
                  obj[key] = valor;
              }
          } else {
              // Si el valor no es una cadena, simplemente asignarlo
              obj[key] = (valor === "" || valor === null) ? null : valor;
          }

          return obj;
      }, {});

      // **Solución Alternativa: Asignar null manualmente si no se convirtió correctamente**
      if (datosInsertar.tipo_organizacion === 'Selecciona una opción') {
          console.log("Asignando null a tipo_organizacion manualmente.");
          datosInsertar.tipo_organizacion = null;
      }

      console.log("Datos para insertar con valores nulos en campos vacíos:", datosInsertar);

      // Obtener columnas válidas de la tabla seleccionada
      const [columns] = await connection.query(`DESCRIBE \`${tabla}\``);
      const columnasValidas = columns.map(col => col.Field);

      console.log("Columnas válidas obtenidas:", columnasValidas);

      // Filtrar solo los campos que son válidos para la tabla
      const datosParaInsertar = Object.keys(datosInsertar)
          .filter(key => columnasValidas.includes(key))
          .reduce((obj, key) => {
              obj[key] = datosInsertar[key];
              return obj;
          }, {});

      console.log("Datos finales para insertar:", datosParaInsertar);

      // Preparar la consulta de inserción
      const campos = Object.keys(datosParaInsertar);
      const valores = Object.values(datosParaInsertar);
      const placeholdersSQL = campos.map(() => '?').join(', ');

      console.log("Campos a insertar:", campos);
      console.log("Valores a insertar:", valores);

      const insertQuery = `INSERT INTO \`${tabla}\` (${campos.join(', ')}) VALUES (${placeholdersSQL})`;
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





router.delete('/deletePersonal', async (req, res) => {
  const { personal_id } = req.body;

  console.log(`[LOG] Recibido personal_id: ${personal_id}`);

  if (!personal_id) {
      console.error('[ERROR] El campo personal_id es requerido.');
      return res.status(400).json({ error: 'El campo personal_id es requerido.' });
  }

  try {
      const connection = await pool.getConnection();

      try {
          await connection.beginTransaction();

          console.log('[LOG] Eliminando registros en detalle_laboral...');
          const deleteDetalleLaboralQuery = 'DELETE FROM detalle_laboral WHERE personal_id = ?';
          await connection.query(deleteDetalleLaboralQuery, [personal_id]);

          console.log('[LOG] Eliminando registro en personal...');
          const deletePersonalQuery = 'DELETE FROM personal WHERE personal_id = ?';
          const [result] = await connection.query(deletePersonalQuery, [personal_id]);

          if (result.affectedRows === 0) {
              console.error('[ERROR] No se encontró ningún registro con el personal_id proporcionado.');
              throw new Error('No se encontró ningún registro con el personal_id proporcionado.');
          }

          await connection.commit();
          console.log('[LOG] Registro eliminado exitosamente.');

          res.status(200).json({ message: 'Registro eliminado exitosamente.' });
      } catch (error) {
          await connection.rollback();
          console.error(`[ERROR] Error durante la transacción: ${error.message}`);
          throw error;
      } finally {
          connection.release();
      }
  } catch (error) {
      console.error(`[ERROR] Error al procesar la solicitud: ${error.message}`);
      res.status(500).json({ error: 'Error al eliminar el registro. Intenta nuevamente.' });
  }
});




module.exports = router;