const express = require('express');
const { vistaPrincipal, vistaReviciones, vistaPendientes, vistaDocentesDisponibles, vistaNombramientosDocentes, vistaLicenciasSinGoce, vistaIncidencias, vistaCalendario, vistaSolicitudesGenerales, vistaCambio, vistaSolicitudesPersonal, vistaSalud, vistaBecaComision, vistaApoyoLentes, vistaListaGeneral, vistaListaAdministrativo, vistaListaDocente, vistaListaFederal, vistaInfoPersonal } = require('../controllers/Pagecontrollers');
const router = express.Router();
const connection = require('../src/config/db'); //Ruta de db


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
router.get('/lista-administrativo', vistaListaAdministrativo);
router.get('/lista-docente', vistaListaDocente);
router.get('/lista-federal', vistaListaFederal);
router.get('/info-personal', vistaInfoPersonal);

// Conexión a la base de datos
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

module.exports = router;