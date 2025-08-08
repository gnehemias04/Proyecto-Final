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
    // 1. Hacer login para obtener token
    const respuesta = await fetch("https://funval-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_usuario, contraseña }),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      alert(
        errorData.detail || "Contraseña incorrecta o usuario no encontrado"
      );
      return;
    }

    const data = await respuesta.json();
    const token = data.access_token;

    // Guardar token
    localStorage.setItem("token", token);

    // 2. Obtener todos los usuarios con token
    const resUsuarios = await fetch(
      "https://funval-backend.onrender.com/usuarios/",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!resUsuarios.ok) {
      alert("No se pudo obtener datos de usuarios");
      return;
    }

    const usuarios = await resUsuarios.json();

    // 3. Buscar usuario que hizo login para obtener rol
    const usuarioActual = usuarios.find(
      (u) => u.nombre_usuario === nombre_usuario
    );

    if (!usuarioActual) {
      alert("Usuario no encontrado en la lista");
      return;
    }

    // Guardar rol en localStorage
    localStorage.setItem("rol", usuarioActual.rol);

    // 4. Validar rol y redirigir
    if (usuarioActual.rol === "administrador") {
      window.location.href = "./admin.html";
    } else {
      alert("No tienes permisos para acceder al panel de administración.");
      window.location.href = "./index.html"; // página para compradores o inicio
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("Error en la conexión. Intentá nuevamente.");
  }
}
