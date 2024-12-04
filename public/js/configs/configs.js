import { cargarMunicipios, cargarComunidades, cargarCCTs } from '../cargaDeDatos.js';

// Función para previsualizar la imagen al subirla
export function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const output = document.getElementById('profile-img');
        output.src = e.target.result; // Cargar la imagen seleccionada
      };
      reader.readAsDataURL(file); 
    }
}


export const config = (() => {
  const initDropdowns = () => {
      const municipioSelect = document.getElementById("municipio_id");
      const comunidadSelect = document.getElementById("comunidad_id");
      const cctSelect = document.getElementById("cct_id");

      console.log("Iniciando configuración de dropdowns...");

      // Cargar municipios al iniciar
      cargarMunicipios()
          .then(municipios => {
              console.log("Municipios obtenidos:", municipios);
              municipios.forEach(municipio => {
                  const option = document.createElement("option");
                  option.value = municipio.id;
                  option.textContent = municipio.nombre;
                  municipioSelect.appendChild(option);
              });
          })
          .catch(error => console.error("Error al cargar municipios:", error));

      // Listener para cargar comunidades al seleccionar un municipio
      municipioSelect.addEventListener("change", () => {
          const municipioId = municipioSelect.value;
          console.log("Municipio seleccionado:", municipioId);

          comunidadSelect.innerHTML = '<option value="">Seleccione una comunidad</option>';
          cctSelect.innerHTML = '<option value="">Seleccione una CCT</option>';
          comunidadSelect.disabled = true;
          cctSelect.disabled = true;

          if (municipioId) {
              cargarComunidades(municipioId)
                  .then(comunidades => {
                      console.log(`Comunidades obtenidas para el municipio ${municipioId}:`, comunidades);
                      comunidades.forEach(comunidad => {
                          const option = document.createElement("option");
                          option.value = comunidad.id;
                          option.textContent = comunidad.nombre;
                          comunidadSelect.appendChild(option);
                      });
                      comunidadSelect.disabled = false;
                  })
                  .catch(error => console.error("Error al cargar comunidades:", error));
          }
      });

      // Listener para cargar CCTs al seleccionar una comunidad
      comunidadSelect.addEventListener("change", () => {
          const municipioId = municipioSelect.value;
          const comunidadId = comunidadSelect.value;

          console.log("Municipio y comunidad seleccionados:", { municipioId, comunidadId });

          cctSelect.innerHTML = '<option value="">Seleccione una CCT</option>';
          cctSelect.disabled = true;

          if (municipioId && comunidadId) {
              cargarCCTs(municipioId, comunidadId)
                  .then(ccts => {
                      console.log(`CCTs obtenidas para municipio ${municipioId} y comunidad ${comunidadId}:`, ccts);
                      ccts.forEach(cct => {
                          const option = document.createElement("option");
                          option.value = cct.id;
                          option.textContent = cct.clave;
                          cctSelect.appendChild(option);
                      });
                      cctSelect.disabled = false;
                  })
                  .catch(error => console.error("Error al cargar CCTs:", error));
          }
      });

      console.log("Configuración de dropdowns finalizada.");
  };

  return {
      initDropdowns,
  };
})();
