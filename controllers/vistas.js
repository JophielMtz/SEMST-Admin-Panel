const pool = require("../src/config/db");

const { home,  } = require('../controllers/Renders');

const vistasController = {
    vistaLogin: async (req, res) => {
      res.render('Login/login', { 
          title: 'Inicio-de-Sesión',
          layout: 'Login/loginLayout' 
      }); 
  },
  vistaSignUp: async (req, res) => {
    res.render('Login/sign-up', {
        title: 'Registrarse', 
        layout: 'Login/loginLayout' 
    }); 
  },
  
  vistaPrincipal: async (req, res) => {
    try {
      const { personal, pendientes } = await home();
  
      // Renderizamos la vista pasando ambos conjuntos de datos
      res.render("home", { 
        totalPersonal: personal.total_personal, 
        totalDirectores: personal.total_directores, 
        totalDocentes: personal.total_docentes, 
        totalAuxiliares: personal.total_auxiliares,
        pendientes: pendientes // Aquí pasamos los datos de la tabla "pendientes"
      });
    } catch (error) {
      console.error("Error al cargar la vista principal:", error);
      res.status(500).send("Error al cargar la página");
    }
  },
  
  
  
  
      vistaReviciones: (req, res) => {
        res.render("revisiones");
      },
    vistaCambio: async (req, res) => {
      res.render("solicitudes/cambio");
    },
    vistaPendientes: async (req, res) => {
      res.render("pendientes");
    },
    vistaDocentesDisponibles: async (req, res) => {
      res.render("gestionDocentes/docentes-disponibles");
    },
    vistaListaGeneral: async (req, res) => {
      res.render("personal/lista-general");
    },
    vistaBecaComision: (req, res) => {
      res.render("saludApoyo/beca-comision");
    },
    vistaApoyoLentes: (req, res) => {
      res.render("saludApoyo/apoyo-lentes");
    },
    vistaNombramientosDocentes: (req, res) => {
      res.render("gestionDocentes/nombramientos-docentes");
    },
    vistaLicenciasSinGoce: (req, res) => {
      res.render("gestionDocentes/licencias-sin-goce");
    },
    vistaIncidencias: (req, res) => {
      res.render("escuelas/incidencias");
    },
    vistaCalendario: (req, res) => {
      res.render("calendario");
    },
    vistaSolicitudesGenerales: (req, res) => {
      res.render("solicitudes/solicitudes-generales");
    },
    vistaSolicitudesPersonal: (req, res) => {
      res.render("solicitudes/solicitudes-personal");
    },
    vistaSalud: (req, res) => {
      res.render("saludApoyo/salud");
    },
    vistaListaPanelAdm: (req, res) => {
      res.render("panelAdm/lista-panel-adm");
    },
    vistaPerfil: (req, res) => {
      res.render("perfil");
    },
    vistaRoles: async (req, res) => {
      try {
          const homeData = await home();
          res.render('panelAdm/roles', {
              roles: homeData.roles 
          });
      } catch (error) {
          console.error('Error al obtener los roles:', error);
          res.status(500).json({ error: 'Error al obtener los roles' });
      }
  },
    vistaInfoPersonal: (req, res) => {
      res.render("personal/info-personal");
    },
    VistaSolicitudes: (req, res) => {
      res.render("solicitudes");
    },
    
   
  };


module.exports = vistasController;

