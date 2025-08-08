/*-------------GUARDANDO EN LOS INPUT-------------- */
document
  .getElementById("formulario-login")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que se recargue la página
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    if (!usuario || !contrasena) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    login(usuario, contrasena); // Llamamos a la función con lo que escribió el usuario
  });

/*------------------LOGIN----------------- */
async function login(nombre_usuario, contraseña) {
  try {
    const respuesta = await fetch("https://funval-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_usuario, contraseña }),
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      console.log("Login exitoso:", data.access_token);

      // Guardamos el token
      localStorage.setItem("token", data.access_token);

      // Obtenemos y guardamos datos del usuario logueado
      await obtenerPerfilUsuario();

      // Redirigimos
      window.location.href = "./compras.html";
    } else {
      console.error("Error al hacer login:", data.detail || data.message);
      alert(data.detail || "Contraseña incorrecta o usuario no encontrado");
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}

/*------------------OBTENER PERFIL USUARIO----------------- */
async function obtenerPerfilUsuario() {
  const token = localStorage.getItem("token");

  const respuesta = await fetch(
    "https://funval-backend.onrender.com/usuarios/me/perfil",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!respuesta.ok) {
    console.error("Error al obtener el perfil");
    return;
  }

  const perfil = await respuesta.json();

  // Guarda los datos que quieras en localStorage
  localStorage.setItem("usuarioId", perfil.id_usuario);
  localStorage.setItem("nombreUsuario", perfil.nombre_usuario);

  console.log("Perfil guardado en localStorage:", perfil);
}
