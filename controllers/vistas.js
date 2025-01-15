const pool = require("../src/config/db");

const { 
  home, 
  tablasHome,
  tablaListaPendientes,
  procesosEnTransito,
  tablaProcesosPendientes,
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
  historialLicenciaSinGoce
} = require('../controllers/Renders');

const { obtenerHistorialTablas } = require('./tabla-historiales-controller/historial-tabla'); // Importación correcta




const vistasController = {
  vistaLogin: async (req, res) => {
    try {
      // Renderizar la vista de login
      res.render("login");
    } catch (error) {
      console.error("Error al cargar la vista de login:", error.message);
      res.status(500).send("Error en el servidor");
    }
  },

  vistaIdPerfil: async (req, res) => {
    const personalId = req.params.id;
  
    try {
      // Obtener el perfil y los detalles laborales del personal
      const perfil = await obtenerPerfilPorId(personalId);
      const detalle = await obtenerDetalleCompleto(personalId);
  
      if (!perfil) {
        return res.status(404).send("Perfil no encontrado");
      }
  
      if (!detalle) {
        return res.status(404).send("Detalles laborales no encontrados");
      }
  
      // Obtener los procesos en tránsito del usuario
      const procesos = await procesosEnTransito(personalId);
  
      // Obtener los historiales relacionados para renderizar en cada perfil
      const historiales = {
        "Becas": await HistorialBecas(personalId) || [],
        "Salud e Inseguridad": await saludInseguridad(personalId) || [],
        "Solicitudes de Cambio": await solicitudesDeCambio(personalId) || [],
        "Docentes disponibles": await historialDocenteDisponible(personalId) || [],
        "Solicitudes Generales": await historialSolicitudesGenerales(personalId) || [],
        "Nombramientos": await historialNombramientos(personalId) || [],
        "Licencia sin goce": await historialLicenciaSinGoce(personalId) || [],
        "Incidencias": await HistorialIncidencias(personalId) || [],
      };
  
      // Renderizar la vista del perfil con los datos obtenidos
      res.render("perfil-de-personal", {
        profileData: perfil,
        detalleLaboral: detalle,
        historiales,
        procesos, // Pasar los procesos dinámicos al EJS
      });
    } catch (error) {
      console.error("Error al obtener el perfil o los detalles laborales:", error.message);
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
      const { personal, listaPendientes,} = await home();
      const pendientes = await tablaProcesosPendientes();
      const { becas, docentesDisponibles, nombramientos, salud, cambio  } = await tablasHome();
  
      // Renderizamos la vista pasando ambos conjuntos de datos
      res.render("home", { 
        totalPersonal: personal.total_personal, 
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
        listaPendientes:listaPendientes,
        becas: becas,
        salud: salud,
        cambio:cambio,
        docentesDisponibles: docentesDisponibles,
        nombramientos: nombramientos,
        pendientes
      });
      
    } catch (error) {
      console.error("Error al cargar la vista principal:", error);
      res.status(500).send("Error al cargar la página");
    }
  },

  vistaBusquedaAvanzada: (req, res) => {
    try {
        res.render("panelAdm/busqueda-avanzada");  
    } catch (error) {
        console.error("Error al renderizar la vista:", error);
        res.status(500).json({ message: "Error al cargar la vista de gestión de personal" });
    }
},

<<<<<<< HEAD
vistaListaPendientes: async (req, res) => {
  try {
    const { listaPendientes, historialPendientes } = await tablaListaPendientes(); 
    const rolUsuario = req.user?.rol || 'invitado'; 
    res.render("lista-pendientes", { listaPendientes, historialPendientes, rolUsuario }); 
  } catch (error) {
    res.render("lista-pendientes", { listaPendientes: [], historialPendientes: [], error: "No se pudieron cargar los pendientes", rolUsuario: 'invitado' });
  }
},
=======
  vistaListaPendientes: async (req, res) => {
    try {
      const { listaPendientes, historialPendientes } = await tablaListaPendientes(); // Llamamos la función que retorna ambas listas
      res.render("lista-pendientes", { listaPendientes, historialPendientes }); // Renderizamos ambas listas
    } catch (error) {
      console.error("Error al cargar la vista de pendientes:", error);
      res.render("lista-pendientes", { listaPendientes: [], historialPendientes: [], error: "No se pudieron cargar los pendientes" });
    }
  },
>>>>>>> 246811bf54314976f76403c2c2c240f94bca2d12
  
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
      try {
        const datosDocentes = await obtenerHistorialTablas("historial_docente_disponible");
        console.log("Datos obtenidos:", datosDocentes); // Para verificar que llegan los datos
        res.render("gestionDocentes/docentes-disponibles", { datos: datosDocentes });
      } catch (error) {
        console.error("Error al renderizar la vista de docentes disponibles:", error);
        res.status(500).send("Error al cargar la lista de docentes disponibles.");
      }
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

