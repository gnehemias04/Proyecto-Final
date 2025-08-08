// viendo el token
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }
});

/*-----------TODO SOBRE VENTAS--------------- */

// renderizado de ventas con token
const ventas = document.querySelector("#ventas-container");

async function llamaVentas() {
  const token = localStorage.getItem("token");
  const respuesta = await fetch("https://funval-backend.onrender.com/ventas/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data = await respuesta.json();
  console.log(data);
  function renderizarVentas() {
    data.forEach((e) => {
      ventas.innerHTML += `<tr
              class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                ${e.id_venta}
              </th>
              <td class="px-6 py-4">${e.id_usuario}</td>
              <td class="px-6 py-4">${e.fecha_venta}</td>
              <td class="px-6 py-4">${e.total}</td>
              <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Detalles</a>
              </td>
            </tr>`;
    });
  }
  renderizarVentas();
}

/*-----------TODO SOBRE PRODUCTOS--------------- */
let btnAgregarProducto = document.querySelector("#btn-agregar");
let modal = document.querySelector("#modal");
let x = document.querySelector("#x");
btnAgregarProducto.addEventListener("click", function () {
  modal.classList.toggle("hidden");
});
x.addEventListener("click", function () {
  modal.classList.toggle("hidden");
});

// renderizado simple de productos
const productos = document.querySelector("#productos-container");
let productosData = [];

async function llamaProductos() {
  let respuesta = await fetch("https://funval-backend.onrender.com/productos/");
  productosData = await respuesta.json();

  function renderizarProductos() {
    productos.innerHTML = ""; // Limpiar contenido
    productosData.forEach((e) => {
      productos.innerHTML += `<tr
              class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                ${e.nombre}
              </th>
              <td class="px-6 py-4">${e.descripcion}</td>
              <td class="px-6 py-4">${e.categoria}</td>
              <td class="px-6 py-4">${e.precio}</td>
              <td class="px-6 py-4">${e.stock}</td>
              <td>
                <button onclick="mostrarEditarProducto(${e.id_producto})"  class="text-blue-600 hover:underline flex justify-center">Editar</button>
              </td>
              <td>
                <button onclick="eliminarProducto(${e.id_producto})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>`;
    });
  }
  renderizarProductos();
}
// agregar un producto
let form = document.querySelector("#agregar-producto");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión");
    return;
  }

  const nuevoProducto = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    precio: parseFloat(document.getElementById("precio").value),
    stock: parseInt(document.getElementById("stock").value),
    categoria: document.getElementById("categoria").value,
    id_producto: parseInt(document.getElementById("id_producto").value),
    fecha_creacion: new Date().toISOString(),
  };

  const respuesta = await fetch(
    "https://funval-backend.onrender.com/productos",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoProducto),
    }
  );

  if (respuesta.ok) {
    alert("Producto agregado correctamente");
    e.target.reset();
    llamaProductos(); // Recarga la tabla
  } else {
    alert("Error al agregar producto");
  }
});

const modalEditar = document.getElementById("editar-producto");
const formEditar = document.getElementById("form-editar-producto");
const btnCancelar = document.getElementById("cancelar");

// Mostrar modal y cargar datos del producto a editar
function mostrarEditarProducto(id) {
  const producto = productosData.find((p) => p.id_producto === id);
  if (!producto) return alert("Producto no encontrado");

  document.getElementById("editar-id_producto").value = producto.id_producto;
  document.getElementById("editar-nombre").value = producto.nombre;
  document.getElementById("editar-descripcion").value = producto.descripcion;
  document.getElementById("editar-categoria").value = producto.categoria;
  document.getElementById("editar-precio").value = producto.precio;
  document.getElementById("editar-stock").value = producto.stock;

  modalEditar.classList.remove("hidden");
}

// Cerrar modal
btnCancelar.addEventListener("click", () => {
  modalEditar.classList.add("hidden");
});

// Guardar cambios
formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) return alert("Debes iniciar sesión");

  const id = document.getElementById("editar-id_producto").value;
  const productoEditado = {
    nombre: document.getElementById("editar-nombre").value,
    descripcion: document.getElementById("editar-descripcion").value,
    categoria: document.getElementById("editar-categoria").value,
    precio: parseFloat(document.getElementById("editar-precio").value),
    stock: parseInt(document.getElementById("editar-stock").value),
  };

  const respuesta = await fetch(
    `https://funval-backend.onrender.com/productos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productoEditado),
    }
  );

  if (respuesta.ok) {
    alert("Producto actualizado correctamente");
    modalEditar.classList.add("hidden");
    llamaProductos(); // refresca la lista y productosData
  } else {
    alert("Error al actualizar producto");
  }
});

// Eliminar un Producto

async function eliminarProducto(id_producto) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) {
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión para eliminar productos.");
    window.location.href = "login.html";
    return;
  }

  try {
    const respuesta = await fetch(
      `https://funval-backend.onrender.com/productos/${id_producto}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (respuesta.ok) {
      alert("Producto eliminado correctamente.");
      // Recarga la lista de productos para reflejar cambios
      llamaProductos();
    } else {
      const errorData = await respuesta.json();
      alert(`Error al eliminar: ${errorData.detail || respuesta.statusText}`);
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    alert("Error de red. Intenta más tarde.");
  }
}

/*-----------TODO SOBRE USUARIOS--------------- */

// renderizado de usuarios con token
const usuarios = document.querySelector("#usuarios-container");

async function llamaUsuarios() {
  const token = localStorage.getItem("token");
  const respuesta = await fetch(
    "https://funval-backend.onrender.com/usuarios/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let data = await respuesta.json();
  console.log(data);

  function renderizarUsuarios() {
    data.forEach((e) => {
      usuarios.innerHTML += `<tr
              class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                ${e.nombre_usuario}
              </th>
              <td class="px-6 py-4">${e.nombre_completo}</td>
              <td class="px-6 py-4">${e.nombre_completo}</td>
              <td class="px-6 py-4">${e.telefono}</td>
              <td class="px-6 py-4">${e.id_usuario}</td>
              <td class="px-6 py-4">${e.rol}</td>
              <td class="px-6 py-4">${e.fecha_registro}</td>
              
             <td class="px-6 py-4">
              <button 
              onclick="eliminarUsuario(${e.id_usuario})" 
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Eliminar
              </button>
              </td>
            </tr>`;
    });
  }

  renderizarUsuarios();
}

// garantiza que no va a trabarse
document.addEventListener("DOMContentLoaded", () => {
  llamaUsuarios();
  llamaProductos();
  llamaVentas();
});
