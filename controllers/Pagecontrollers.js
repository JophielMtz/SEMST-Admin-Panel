const connection = require('../src/config/db');


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
    connection.query(`
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
    `, (err, results) => {
        if (err) {
            console.error('Error al hacer la consulta:', err);
            res.status(500).send('Error en la consulta de la base de datos');
        } else {
            // Aquí enviamos los datos como 'personal' a la vista
            res.render('lista-general', { personal: results });
        }
    });
};




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

const vistaAgregarpersonal = (req, res) => {
    res.render('agregar-personal');
  };

  const agregarPersonal = (req, res) => {
    console.log('req.body:', req.body); // Datos del formulario
    console.log('req.file:', req.file); // Información del archivo subido
  
    // Extraer los datos del formulario
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
      direccion
    } = req.body;
  
    // Obtener el nombre del archivo subido (si existe)
    const imagen = req.file ? req.file.filename : null;
  
    // Consulta SQL incluyendo la columna 'imagen'
    const sql = 'INSERT INTO personal (rfc, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, telefono, correo, direccion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
    // Ejecutar la consulta
    connection.query(sql, [rfc, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, telefono, correo, direccion, imagen], (err, result) => {
      if (err) {
        console.error('Error al insertar datos en la base de datos:', err);
        return res.status(500).send('Error al insertar datos en la base de datos');
      }
      res.redirect('Datos recibidos correctamente');
    });
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
    vistaListaAdministrativo,
    vistaListaDocente,
    vistaListaFederal,
    vistaInfoPersonal,
    vistaAgregarpersonal,
    agregarPersonal  // Exporta para manejar el POST de agregar personal

}