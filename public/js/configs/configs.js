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
