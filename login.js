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
      localStorage.setItem("token", data.access_token);
      window.location.href = "./index.html";
      // Aquí podés redirigir, mostrar productos, etc.
    } else {
      console.error("Error al hacer login:", data.detail || data.message);
      alert(data.detail || "Contraseña incorrecta o usuario no encontrado");
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}
