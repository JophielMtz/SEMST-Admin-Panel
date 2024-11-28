document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Si no hay token, redirigir al login
    window.location.href = "login.html";
    return;
  }

  // Solicitar los datos del perfil con el token
  const apiUrl = "http://localhost:3000";
  
  try {
    const perfilResponse = await fetch(`${apiUrl}/perfil`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Comprobamos el código de estado y tipo de contenido
    const contentType = perfilResponse.headers.get("Content-Type");
    const statusCode = perfilResponse.status;
    console.log("Código de estado recibido:", statusCode);
    console.log("Tipo de contenido recibido:", contentType);

    // Si la respuesta es incorrecta, mostramos un error
    if (statusCode !== 200) {
      console.error(`Error al cargar el perfil: ${statusCode}`);
      actualizarPerfil("Error al cargar perfil", "images/avatars/01.png");
      return;
    }

    // Si la respuesta es JSON, procesamos los datos del perfil
    if (contentType && contentType.includes("application/json")) {
      const perfilData = await perfilResponse.json();
      console.log("Perfil obtenido:", perfilData);
      
      // Actualizamos el nombre de usuario y la imagen del perfil
      actualizarPerfil(perfilData.usuario || "Usuario desconocido", perfilData.imagen || "images/avatars/default-avatar.png");
    } else {
      console.error("Error: La respuesta no es JSON");
      actualizarPerfil("Error al cargar perfil", "images/avatars/default-avatar.png");
    }

  } catch (perfilError) {
    console.error("Error al cargar perfil:", perfilError.message);
    actualizarPerfil("Usuario desconocido", "images/avatars/default-avatar.png");
  }
});

// Función para actualizar el nombre y la imagen del perfil
function actualizarPerfil(nombre, imagen) {
  const nombreUsuario = document.getElementById("usuario");
  const imagenPerfil = document.getElementById("imagen-perfil");

  if (nombreUsuario) {
    nombreUsuario.innerText = nombre;  // Actualiza el nombre
  }

  if (imagenPerfil) {
    imagenPerfil.src = imagen;  // Actualiza la imagen
  }
}
