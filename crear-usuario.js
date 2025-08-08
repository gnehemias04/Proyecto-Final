document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-login");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita recargar la página

    // Obtenemos los valores de los inputs
    const nombreCompleto = document
      .getElementById("nombre-completo")
      .value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("Telefono").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    // Creamos el objeto usuario
    const nuevoUsuario = {
      nombre_usuario: usuario,
      nombre_completo: nombreCompleto,
      correo: correo,
      telefono: telefono,
      contraseña: contrasena,
      rol: "comprador",
    };

    try {
      // Enviar al backend (endpoint de registro)
      const respuesta = await fetch(
        "https://funval-backend.onrender.com/registro-comprador",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevoUsuario),
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al registrar el usuario");
      }

      const data = await respuesta.json();
      console.log("Usuario creado:", data);

      alert("Usuario creado con éxito");
      formulario.reset();
    } catch (error) {
      console.error("Hubo un problema:", error);
      alert("No se pudo crear el usuario");
    }
  });
});
