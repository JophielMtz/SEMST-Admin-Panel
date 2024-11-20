// ./js/AgGrid/cargaDatos.js

export const fetchMunicipios = async () => {
    try {
      const response = await fetch("/obtener-municipios");
      return await response.json();
    } catch (error) {
      console.error("Error al cargar municipios:", error);
      return [];
    }
  };
  
  export const fetchComunidades = async (municipioId) => {
    try {
      const response = await fetch(`/obtener-comunidades/${municipioId}`);
      return await response.json();
    } catch (error) {
      console.error("Error al cargar comunidades:", error);
      return [];
    }
  };
  
  export const fetchCCTs = async (municipioId, comunidadId) => {
    try {
      const response = await fetch(`/obtener-ccts/${municipioId}/${comunidadId}`);
      return await response.json();
    } catch (error) {
      console.error("Error al cargar CCTs:", error);
      return [];
    }
  };
  