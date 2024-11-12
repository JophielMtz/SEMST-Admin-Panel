const express = require('express');
const { vistaPrincipal, vistaReviciones, vistaPendientes, vistaDocentesDisponibles, vistaNombramientosDocentes, vistaLicenciasSinGoce, vistaIncidencias, vistaCalendario, vistaSolicitudesGenerales, vistaCambio, vistaSolicitudesPersonal, vistaSalud, vistaBecaComision, vistaApoyoLentes, vistaListaGeneral, vistaListaPanelAdm, vistaPerfil, vistaListaFederal, vistaInfoPersonal, vistaAgregarpersonal, vistaRoles, vistaEditarPersonal, agregarPersonal, actualizarPersonal,  obtenerPersonal, obtenerDetallePersonal  } = require('../controllers/Pagecontrollers');
const router = express.Router();
const pool = require('../src/config/db'); //Ruta de db

const multer = require('multer');
const path = require('path');

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads')); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
    }
  });
  
  const upload = multer({ storage: storage });

router.get('/', vistaPrincipal)
router.get('/revisiones', vistaReviciones)
router.get('/pendientes', vistaPendientes)
router.get('/docentes-disponibles', vistaDocentesDisponibles);
router.get('/nombramientos-docentes', vistaNombramientosDocentes);
router.get('/licencias-sin-goce', vistaLicenciasSinGoce);
router.get('/incidencias', vistaIncidencias);
router.get('/calendario', vistaCalendario);
router.get('/solicitudes-generales', vistaSolicitudesGenerales);
router.get('/cambio', vistaCambio);
router.get('/solicitudes-personal', vistaSolicitudesPersonal);
router.get('/salud', vistaSalud);
router.get('/beca-comision', vistaBecaComision);
router.get('/apoyo-lentes', vistaApoyoLentes);
router.get('/lista-general', vistaListaGeneral);
router.get('/lista-panel-adm', vistaListaPanelAdm);
router.get('/perfil', vistaPerfil);
router.get('/lista-federal', vistaListaFederal);
router.get('/info-personal', vistaInfoPersonal);
router.get('/agregar-personal', vistaAgregarpersonal);
router.get('/editar-personal', vistaEditarPersonal);
router.get('/roles', vistaRoles);

//gets
router.get('/api/personal', obtenerPersonal);
router.get('/api/personal/:personal_id',  obtenerDetallePersonal);
router.get('/obtener-datos-sector/:sectorId', async (req, res) => {
  const sectorId = req.params.sectorId;
  const { zonaId, comunidadId, municipioId } = req.query;

  let queryZonaCCT = `
      SELECT DISTINCT 
          z.zona_id, 
          z.numero_zona, 
          c.cct_id, 
          c.centro_clave_trabajo, 
          com.comunidad_id, 
          com.nombre AS nombre_comunidad, 
          m.municipio_id, 
          m.nombre AS nombre_municipio 
      FROM ubic_ccts uc
      JOIN ccts c ON uc.cct_id = c.cct_id
      JOIN zona z ON uc.zona_id = z.zona_id
      LEFT JOIN comunidad com ON uc.comunidad_id = com.comunidad_id
      LEFT JOIN municipio m ON uc.municipio_id = m.municipio_id
      WHERE uc.sector_id = ?
  `;

  const params = [sectorId];

  if (zonaId) {
    queryZonaCCT += ' AND uc.zona_id = ?';
    params.push(zonaId);
  }

  if (comunidadId) {
    queryZonaCCT += ' AND uc.comunidad_id = ?';
    params.push(comunidadId);
  }

  if (municipioId) {
    queryZonaCCT += ' AND uc.municipio_id = ?';
    params.push(municipioId);
  }

  try {
    const [results] = await pool.query(queryZonaCCT, params);

    const response = {
      zonas: [],
      ccts: [],
      comunidades: [],
      municipios: []
    };

    results.forEach(row => {
      // Zonas
      if (!response.zonas.find(zona => zona.zona_id === row.zona_id)) {
        response.zonas.push({
          zona_id: row.zona_id,
          numero_zona: row.numero_zona
        });
      }

      // CCTs
      response.ccts.push({
        cct_id: row.cct_id,
        centro_clave_trabajo: row.centro_clave_trabajo
      });

      // Comunidades
      if (row.comunidad_id && !response.comunidades.find(comunidad => comunidad.comunidad_id === row.comunidad_id)) {
        response.comunidades.push({
          comunidad_id: row.comunidad_id,
          nombre_comunidad: row.nombre_comunidad
        });
      }

      // Municipios
      if (row.municipio_id && !response.municipios.find(municipio => municipio.municipio_id === row.municipio_id)) {
        response.municipios.push({
          municipio_id: row.municipio_id,
          nombre_municipio: row.nombre_municipio
        });
      }
    });

    res.json(response);
  } catch (err) {
    console.error('Error al obtener los datos:', err);
    res.status(500).json({ error: 'Error al obtener los datos del sector' });
  }
});

router.get('/obtener-comunidad-municipio/:zonaId', async (req, res) => {
  const zonaId = req.params.zonaId;
  const sectorId = req.query.sectorId;

  // Validar que ambos parámetros estén presentes
  if (!zonaId || !sectorId) {
    return res.status(400).json({ error: 'Los parámetros zonaId y sectorId son requeridos.' });
  }

  const queryComunidadesMunicipiosCCT = `
    SELECT DISTINCT
      com.comunidad_id,
      com.nombre AS nombre_comunidad,
      m.municipio_id,
      m.nombre AS nombre_municipio,
      c.cct_id,
      c.centro_clave_trabajo
    FROM ubic_ccts uc
    JOIN comunidad com ON uc.comunidad_id = com.comunidad_id
    JOIN municipio m ON uc.municipio_id = m.municipio_id
    JOIN ccts c ON uc.cct_id = c.cct_id
    WHERE uc.zona_id = ? AND uc.sector_id = ?
  `;

  try {
    const [results] = await pool.query(queryComunidadesMunicipiosCCT, [zonaId, sectorId]);

    const response = {
      comunidades: [],
      municipios: [],
      ccts: []
    };

    results.forEach(row => {
      // Evitar duplicados en los resultados de comunidades
      if (row.comunidad_id && !response.comunidades.find(comunidad => comunidad.comunidad_id === row.comunidad_id)) {
        response.comunidades.push({
          comunidad_id: row.comunidad_id,
          nombre_comunidad: row.nombre_comunidad
        });
      }

      // Evitar duplicados en los resultados de municipios
      if (row.municipio_id && !response.municipios.find(municipio => municipio.municipio_id === row.municipio_id)) {
        response.municipios.push({
          municipio_id: row.municipio_id,
          nombre_municipio: row.nombre_municipio
        });
      }

      // Añadir claves CCT
      if (row.cct_id && row.centro_clave_trabajo) {
        response.ccts.push({
          cct_id: row.cct_id,
          centro_clave_trabajo: row.centro_clave_trabajo
        });
      }
    });

    res.json(response);
  } catch (err) {
    console.error('Error al ejecutar la consulta SQL:', err);
    res.status(500).json({ error: 'Error al obtener los datos de la zona.', details: err.message });
  }
});

router.get('/obtener-comunidades-por-municipio/:municipioId', async (req, res) => {
  const municipioId = req.params.municipioId;
  const sectorId = req.query.sectorId;

  // Validar que ambos parámetros estén presentes
  if (!municipioId || !sectorId) {
    return res.status(400).json({ error: 'Los parámetros municipioId y sectorId son requeridos.' });
  }

  const queryComunidadesPorMunicipio = `
    SELECT DISTINCT 
      com.comunidad_id,
      com.nombre AS nombre_comunidad
    FROM ubic_ccts uc
    JOIN comunidad com ON uc.comunidad_id = com.comunidad_id
    WHERE uc.municipio_id = ? AND uc.sector_id = ?
  `;

  try {
    // Ejecutar la consulta utilizando pool y await
    const [results] = await pool.query(queryComunidadesPorMunicipio, [municipioId, sectorId]);
    const comunidades = results.map(row => ({
      comunidad_id: row.comunidad_id,
      nombre_comunidad: row.nombre_comunidad
    }));

    res.json({ comunidades });
  } catch (err) {
    console.error('Error al ejecutar la consulta SQL:', err);
    res.status(500).json({ error: 'Error al obtener las comunidades por municipio y sector.', details: err.message });
  }
});

router.get('/obtener-ccts', async (req, res) => {
  const { sectorId, zonaId, comunidadId, municipioId } = req.query;

  // Validar que todos los parámetros estén presentes
  if (!sectorId || !zonaId || !comunidadId || !municipioId) {
    return res.status(400).json({ error: 'Todos los parámetros (sectorId, zonaId, comunidadId, municipioId) son requeridos.' });
  }

  const queryCCT = `
    SELECT DISTINCT 
      c.cct_id, 
      c.centro_clave_trabajo 
    FROM ubic_ccts uc
    JOIN ccts c ON uc.cct_id = c.cct_id
    JOIN zona z ON uc.zona_id = z.zona_id
    JOIN comunidad com ON uc.comunidad_id = com.comunidad_id
    JOIN municipio m ON uc.municipio_id = m.municipio_id
    WHERE uc.sector_id = ?
      AND uc.zona_id = ?
      AND uc.comunidad_id = ?
      AND uc.municipio_id = ?
  `;

  const params = [sectorId, zonaId, comunidadId, municipioId];

  try {
    const [results] = await pool.query(queryCCT, params);
    const ccts = results.map(row => ({
      cct_id: row.cct_id,
      centro_clave_trabajo: row.centro_clave_trabajo
    }));
    res.json({ ccts });
  } catch (err) {
    console.error('Error al obtener las CCTs:', err);
    res.status(500).json({ error: 'Error al obtener las CCTs.', details: err.message });
  }
});

// Endpoint para obtener los datos del personal
router.get('/lista-general', async (req, res) => {
  try {
      // Consulta SQL para obtener los datos del personal
      const [results] = await pool.query(`
          SELECT 
              p.personal_id, p.rfc, p.nombre, p.apellido_paterno, 
              p.apellido_materno, p.edad, p.telefono, p.correo, 
              c.descripcion AS cargo
          FROM personal p
          LEFT JOIN detalle_laboral dl ON p.personal_id = dl.personal_id
          LEFT JOIN cargos c ON dl.cargo_id = c.cargo_id
      `);

      // Enviar los datos como JSON
      res.json({ data: results }); // Devuelve los datos con la clave 'data'

  } catch (err) {
      // Manejo de errores
      console.error('Error:', err);
      res.status(500).json({ error: 'Error al consultar los datos' });
  }
});

// Ednpoint para tabla doccentes_disponibles y solicitudes
router.get('/editar-personal-nuevo/:id', vistaEditarPersonalNuevo);
router.put('/editar-personal-nuevo/:id', actualizarDocentesDisponibles);
router.put ('/editar-personal-nuevo/:id', actualizarSolicitudesDeCambio);


router.get('/editar-personal/:id', vistaEditarPersonal);

//post
router.put('/editar-personal/:id', actualizarPersonal);
router.post('/personal/agregar', upload.single('imagen'), agregarPersonal);

router.post('/actualizar-personal/:id', actualizarPersonal);


//Endpoints para obtener datos de ubic ccts
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

router.post('/guardarRegistro', async (req, res) => {
  console.log("Datos recibidos en req.body:", req.body);

  const {
    tabla,
    personal_id,
    nombre_docente,
    fecha,
    antiguedad,
    telefono,
    estatus,
    situacion,
    municipio_sale,
    comunidad_sale,
    cct_sale,
    municipio_entra,
    comunidad_entra,
    cct_entra,
    estatus_cubierta,
    observaciones,
    observaciones_conflictos,
    zona_id,
    sector_id
  } = req.body;

  // Validación básica de tabla
  const tablasValidas = ['docentes_disponibles'];
  if (!tabla || !tablasValidas.includes(tabla)) {
    return res.status(400).send("Tabla no válida o no especificada.");
  }

  // Definir campos requeridos por tabla
  const camposRequeridos = {
    'docentes_disponibles': ['personal_id', 'nombre_docente', 'fecha', 'estatus', 'situacion', 'municipio_entra', 'comunidad_entra', 'cct_entra']
  };

  const faltanCampos = camposRequeridos[tabla].filter(campo => !req.body[campo]);
  if (faltanCampos.length > 0) {
    return res.status(400).send(`Faltan los siguientes campos necesarios: ${faltanCampos.join(', ')}`);
  }

  // Iniciar conexión y transacción
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Preparar inserción para docentes_disponibles
    const insertQuery = `INSERT INTO docentes_disponibles (
                        personal_id, nombre_docente, fecha, estatus, situacion, antiguedad, telefono,
                        municipio_sale, comunidad_sale, cct_sale,
                        municipio_entra, comunidad_entra, cct_entra,
                        estatus_cubierta, observaciones
                      ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, ?, ?, ?, ?, ?)`;

    const insertValues = [
      personal_id,          // personal_id
      nombre_docente,       // nombre_docente
      fecha,                // fecha
      estatus,              // estatus
      situacion,            // situacion
      antiguedad || null,   // antiguedad
      telefono || null,     // telefono
      municipio_entra,      // municipio_entra
      comunidad_entra,      // comunidad_entra
      cct_entra,            // cct_entra
      estatus_cubierta || null, // estatus_cubierta
      observaciones || null    // observaciones
    ];

    // Ejecutar inserción en la tabla correspondiente
    const [result] = await connection.query(insertQuery, insertValues);
    const insertId = result.insertId;

    // Confirmar transacción
    await connection.commit();
    res.status(201).json(`Registro creado exitosamente en la tabla ${tabla}. ID: ${insertId}`);
  } catch (error) {
    // Revertir transacción en caso de error
    await connection.rollback();
    console.error("Error en /guardarRegistro:", error);
    res.status(500).send(`Error al crear el registro: ${error.message}`);
  } finally {
    // Liberar la conexión
    connection.release();
  }
});

//api de docentes
router.get('/getDocentes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        personal_id AS id, 
        fecha, 
        nombre_docente, 
        estatus, 
        observaciones,
        situacion,
        antiguedad,
        municipio_sale, 
        comunidad_sale, 
        cct_sale, 
        estatus_cubierta,
        municipio_entra, 
        comunidad_entra, 
        cct_entra
      FROM 
        docentes_disponibles
    `);

    // Asegurarse de que fecha sea una cadena
    const data = rows.map(row => ({
      ...row,
      fecha: row.fecha ? row.fecha.toISOString().split('T')[0] : 'N/A'
    }));

    res.json({ data: data }); // Devolver los datos envueltos en un objeto con clave 'data'
  } catch (error) {
    console.error('Error al obtener los docentes:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});



//delete  
router.delete('/personal/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM detalle_laboral WHERE personal_id = ?', [id]);
    await pool.query('DELETE FROM personal WHERE personal_id = ?', [id]);

    console.log('Personal eliminado correctamente');
    res.status(200).json({ success: true, message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el registro:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar el registro' });
  }
});



module.exports = router;