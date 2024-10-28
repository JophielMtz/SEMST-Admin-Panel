const express = require('express');
const { vistaPrincipal, vistaReviciones, vistaPendientes, vistaDocentesDisponibles, vistaNombramientosDocentes, vistaLicenciasSinGoce, vistaIncidencias, vistaCalendario, vistaSolicitudesGenerales, vistaCambio, vistaSolicitudesPersonal, vistaSalud, vistaBecaComision, vistaApoyoLentes, vistaListaGeneral, vistaListaPanelAdm, vistaListaDocente, vistaListaFederal, vistaInfoPersonal, vistaAgregarpersonal, agregarPersonal, actualizarPersonal  } = require('../controllers/Pagecontrollers');
const router = express.Router();
const connection = require('../src/config/db'); //Ruta de db

const multer = require('multer');
const path = require('path');

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads')); // Carpeta donde se guardarán los archivos subidos
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
router.get('/lista-docente', vistaListaDocente);
router.get('/lista-federal', vistaListaFederal);
router.get('/info-personal', vistaInfoPersonal);
router.get('/agregar-personal', vistaAgregarpersonal);


// Ruta para obtener zonas, comunidades, municipios y CCT basados en sector y filtros opcionales
router.get('/obtener-datos-sector/:sectorId', (req, res) => {
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

  connection.query(queryZonaCCT, params, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos:', err);
      return res.status(500).json({ error: 'Error al obtener los datos del sector' });
    }

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
  });
});

// Ruta para obtener comunidades y municipios por zona y sector
router.get('/obtener-comunidad-municipio/:zonaId', (req, res) => {
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

  connection.query(queryComunidadesMunicipiosCCT, [zonaId, sectorId], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      return res.status(500).json({ error: 'Error al obtener los datos de la zona.', details: err.message });
    }

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
  });
});

// Ruta para obtener comunidades por municipio y sector
router.get('/obtener-comunidades-por-municipio/:municipioId', (req, res) => {
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

  connection.query(queryComunidadesPorMunicipio, [municipioId, sectorId], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err);
      return res.status(500).json({ error: 'Error al obtener las comunidades por municipio y sector.', details: err.message });
    }

    const comunidades = results.map(row => ({
      comunidad_id: row.comunidad_id,
      nombre_comunidad: row.nombre_comunidad
    }));

    res.json({ comunidades });
  });
});

// Ruta para obtener CCTs basadas en múltiples filtros
router.get('/obtener-ccts', (req, res) => {
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

  connection.query(queryCCT, params, (err, results) => {
    if (err) {
      console.error('Error al obtener las CCTs:', err);
      return res.status(500).json({ error: 'Error al obtener las CCTs.', details: err.message });
    }

    const ccts = results.map(row => ({
      cct_id: row.cct_id,
      centro_clave_trabajo: row.centro_clave_trabajo
    }));

    res.json({ ccts });
  });
});


router.post('/personal/agregar', upload.single('imagen'), agregarPersonal);

// Ruta para consultar los datos 
router.get('/lista-general', (req, res) => {
    connection.query('SELECT * FROM personal', (err, results) => {
        if (err) {
            console.error('Error al hacer la consulta:', err);
            res.status(500).send('Error al consultar la base de datos');
        } else {
            res.json(results);
        }
    });
});

router.put("/personal/editar/:id", actualizarPersonal);



// Ruta para eliminar un registro de personal
router.delete('/personal/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Si necesitas eliminar de detalle_laboral primero
      await connection.promise().query('DELETE FROM detalle_laboral WHERE personal_id = ?', [id]);

      // Luego, eliminar de personal
      await connection.promise().query('DELETE FROM personal WHERE personal_id = ?', [id]);

      console.log('Personal eliminado correctamente');

      res.status(200).json({ success: true, message: 'Registro eliminado correctamente' });
  } catch (error) {
      console.error('Error al eliminar el registro:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar el registro' });
  }
});



module.exports = router;