const pool = require("../src/config/db");

const { home, 
  obtenerPerfilPorId, 
  obtenerDetalleCompleto,
  HistorialBecas, 
  saludInseguridad, 
  solicitudesDeCambio,
  HistorialIncidencias,
  historialSolicitudesPersonal,
  historialDocenteDisponible,
  historialSolicitudesGenerales,
  historialNombramientos,
  historialLicenciaSinGoce  } = require('../controllers/Renders');

const vistasController = {
    
  vistaIdPerfil: async (req, res) => {
    const personalId = req.params.id;

    try {
        const perfil = await obtenerPerfilPorId(personalId);
        const detalle = await obtenerDetalleCompleto(personalId);

        // Recolectar los historiales
        const historiales = {
          "Becas": await HistorialBecas(personalId) || [],
          "Salud e Inseguridad": await saludInseguridad(personalId) || [],
          "Solicitudes de Cambio": await solicitudesDeCambio(personalId) || [],
          "Docentes disponibles": await  historialDocenteDisponible(personalId) || [],
          "Solicitudes Generales": await historialSolicitudesGenerales(personalId) || [],
          "Nombramientos": await historialNombramientos(personalId) || [],
          "Licencia sin goce": await historialLicenciaSinGoce(personalId) || [],
          "Incidencias": await HistorialIncidencias(personalId) || []
                        // historialSolicitudesPersonal: await historialSolicitudesPersonal(personalId) || [],
        };

        if (!perfil) {
            return res.status(404).send("Perfil no encontrado");
        }

        if (!detalle) {
            return res.status(404).send("Detalles laborales no encontrados");
        }

        // Renderizar vista con datos dinámicos
        res.render("perfil-de-personal", { 
            profileData: perfil, 
            detalleLaboral: detalle,
            historiales,
        });
    } catch (error) {
        console.error('Error al obtener el perfil o los detalles laborales:', error);
        res.status(500).send("Error en el servidor");
    }
},



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
  
  vistaError: async (req, res) => {
    res.render('error/403', { 
        title: 'Inicio-de-Sesión',
        layout: '403/layout-error'
    }); 
  },

  vistaPrincipal: async (req, res) => {
    try {
      const { personal, pendientes, procesos } = await home();
  
      // Renderizamos la vista pasando ambos conjuntos de datos
      res.render("home", { 
        totalPersonal: personal.total_personal, 
        totalPendientes:personal.pendientes,
        totalDirectores: personal.total_directores, 
        totalDocentes: personal.total_docentes, 
        totalAuxiliares: personal.total_auxiliares, 
        totalAdministrativos: personal.total_administrativos, 
        totalAuxiliarServicio: personal.total_auxiliar, 
        totalDocenteApoyo: personal.total_docente_apoyo, 
        totalDocenteCamb: personal.total_docente_camb,
        totalDocenteSubdir: personal.total_docente_subdir,
        totalEstatal: personal.total_estatal, 
        totalFederal: personal.total_federal,
        pendientes: pendientes, 
        totalProcesos: procesos 
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
    vistaProfile: (req, res) => {
      res.render("profile");
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
    vista403: (req, res) => {
      res.render("errors/403");
    },
    vistaCalendario: (req, res) => {
      res.render("utilidades/calendario");
    },
  };


module.exports = vistasController;

