const vistaPrincipal = (req, res, ) => {
    res.render('home')
}

const vistaReviciones = (req, res, ) => {
    res.render('revisiones')
}

const vistaPendientes = (req, res, ) => {
    res.render('pendientes')
}

const vistaDocentesDisponibles = (req, res) => {
    res.render('docentes-disponibles');
}

const vistaNombramientosDocentes = (req, res) => {
    res.render('nombramientos-docentes');
}

const vistaLicenciasSinGoce = (req, res) => {
    res.render('licencias-sin-goce');
}

const vistaIncidencias = (req, res) => {
    res.render('incidencias');
}

const vistaCalendario = (req, res) => {
    res.render('calendario');
}

const vistaSolicitudesGenerales = (req, res) => {
    res.render('solicitudes-generales');
}

const vistaCambio = (req, res) => {
    res.render('cambio');
}

const vistaSolicitudesPersonal = (req, res) => {
    res.render('solicitudes-personal');
}

const vistaSalud = (req, res) => {
    res.render('salud');
}

const vistaBecaComision = (req, res) => {
    res.render('beca-comision');
}

const vistaApoyoLentes = (req, res) => {
    res.render('apoyo-lentes');
}

const vistaListaGeneral = (req, res) => {
    res.render('lista-general');
}

const vistaListaAdministrativo = (req, res) => {
    res.render('lista-administrativo');
}

const vistaListaDocente = (req, res) => {
    res.render('lista-docente');
}

const vistaListaFederal = (req, res) => {
    res.render('lista-federal');
}

const vistaInfoPersonal = (req, res) => {
    res.render('info-personal');
}




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
    vistaListaAdministrativo,
    vistaListaDocente,
    vistaListaFederal,
    vistaInfoPersonal


}