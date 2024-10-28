document.addEventListener("DOMContentLoaded", function() {
    (function () {
        "use strict";

        let form = document.querySelector("#form-wizard1");
        if (!form) {
        return;
    }

        console.log("Script del wizard cargado correctamente");

        let currentTab = 0; // Indica la pestaña actual del wizard (comienza en 0)

        // Mostrar la pestaña actual
        const showTab = (n) => {
            console.log("El valor de n es:", n); // Verificar el valor de n
            let fieldsets = document.querySelectorAll("#form-wizard1 fieldset");
            fieldsets[n].style.display = "block"; // Muestra el fieldset actual
            ActiveTab(n); // Actualiza las clases de las pestañas en el encabezado
            console.log("Mostrando pestaña: ", n);
        };
        


        // Cambia la clase activa en el encabezado del wizard según la pestaña actual
        const ActiveTab = (n) => {
            if (n === 0) {
                document.getElementById("account").classList.add("active");
                document.getElementById("account").classList.remove("done");
                document.getElementById("personal").classList.remove("done");
                document.getElementById("personal").classList.remove("active");
            } else if (n === 1) {
                document.getElementById("account").classList.add("done");
                document.getElementById("personal").classList.add("active");
                document.getElementById("personal").classList.remove("done");
                document.getElementById("confirm").classList.remove("done");
                document.getElementById("confirm").classList.remove("active");
            } else if (n === 2) {
                document.getElementById("account").classList.add("done");
                document.getElementById("personal").classList.add("done");
                document.getElementById("confirm").classList.add("active");
                document.getElementById("confirm").classList.remove("done");
            }
        };

        // Función de validación del paso actual
        const validateCurrentStep = () => {
            let currentFieldset = document.getElementsByTagName("fieldset")[currentTab];
            let inputs = currentFieldset.querySelectorAll('input, select');
            let valid = true;

            // Verifica si todos los campos son válidos
            inputs.forEach((input) => {
                if (!input.checkValidity()) {
                    input.classList.add('is-invalid');
                    valid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            console.log("Validación del paso actual: ", valid);
            return valid; // Retorna si el paso actual es válido o no
        };

        // Avanzar o retroceder en el wizard
        const nextBtnFunction = (n, event) => {
            event.stopPropagation(); // Detener la propagación para evitar conflictos con otros scripts
            console.log("Intentando avanzar con n: ", n);
            if (n === 1 && !validateCurrentStep()) {
                console.log("Por favor complete todos los campos requeridos");
                return; // Si la validación falla, no se avanza al siguiente paso
            }

            let fieldsets = document.getElementsByTagName("fieldset");
            fieldsets[currentTab].style.display = "none"; // Oculta la pestaña actual
            currentTab = currentTab + n;

            // Verifica si el siguiente fieldset existe antes de mostrarlo
            if (fieldsets[currentTab]) {
                fieldsets[currentTab].style.display = "block";
                showTab(currentTab); // Mostrar la pestaña activa
            } else {
                console.error("No hay más pestañas disponibles para mostrar.");
            }
        };

        // Manejar eventos del botón "Siguiente"
        const nextbtn = document.querySelectorAll('.next');
        Array.from(nextbtn, (nbtn) => {
            nbtn.addEventListener('click', function (event) {
                try {
                    nextBtnFunction(1, event); // Pasamos el evento para evitar la propagación
                } catch (e) {
                    console.error("Error al intentar avanzar: ", e);
                }
            });
        });

        // Manejar eventos del botón "Anterior"
        const prebtn = document.querySelectorAll('.previous');
        Array.from(prebtn, (pbtn) => {
            pbtn.addEventListener('click', function (event) {
                nextBtnFunction(-1, event); // Pasamos el evento para evitar la propagación
            });
        });

        // Inicializa mostrando la primera pestaña
        showTab(currentTab);

    })();
});


