// viendo el token
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }
});

// usuario
const bienvenido = document.querySelector("#bienvenido");
const nombreUsuario = localStorage.getItem("nombreUsuario");
const id_usuario = localStorage.getItem("usuarioId");
bienvenido.innerHTML = `Bienvenido ${nombreUsuario}!`;

// muchas variables xd
const productos = document.querySelector("#productos-container");
const siguiente = document.querySelector("#siguiente");
const anterior = document.querySelector("#anterior");
const buscador = document.querySelector("#buscadorInput");
const selectCategorias = document.querySelector("#categorias");
const btnVaciar = document.getElementById("btn-vaciar");
const carritoItems = document.getElementById("carrito-items");
const carritoTotal = document.querySelector("#carrito-total");
const btnComprar = document.getElementById("btn-comprar");

selectCategorias.addEventListener("change", (e) => {
  categoriaSeleccionada = e.target.value;
  contadorA = 0;
  contadorB = 8;
  llamaProductos();
});

let contadorA = 0;
let contadorB = 8;
let data = []; // Todos los productos
let productosFiltrados = []; // Productos luego del filtro
let categoriaSeleccionada = "todas";
let textoBuscado = "";

async function llamaProductos() {
  if (data.length === 0) {
    const respuesta = await fetch(
      "https://funval-backend.onrender.com/productos/"
    );
    data = await respuesta.json();
  }

  aplicarFiltros();

  if (contadorB > productosFiltrados.length)
    contadorB = productosFiltrados.length;
  if (contadorA >= productosFiltrados.length) {
    contadorA = Math.max(0, productosFiltrados.length - 8);
    contadorB = productosFiltrados.length;
  }
  if (contadorA < 0) contadorA = 0;

  renderizarProductos();
}

function aplicarFiltros() {
  productosFiltrados = data.filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === "todas" ||
      producto.categoria === categoriaSeleccionada;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(textoBuscado.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });
}

function renderizarProductos() {
  productos.innerHTML = "";
  for (let i = contadorA; i < contadorB; i++) {
    const producto = productosFiltrados[i];
    if (producto) {
      productos.innerHTML += `
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <img class="rounded-t-lg" src="./prod/${producto.nombre
              .toLowerCase()
              .replace(/\s+/g, "-")}.png"
" alt="" />
          </a>
          <div class="p-5">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${
                producto.nombre
              }</h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${
              producto.descripcion
            }</p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">¡A solo $${
              producto.precio
            }!</p>
            <button  class="carrito inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
             data-id="${producto.id_producto}"
             data-nombre="${producto.nombre}"
             data-precio="${producto.precio}"
            >
              Añadir al Carrito
              <svg class="w-6 h-6 text-white ms-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.268 6A2 2 0 0 0 14 9h1v1a2 2 0 0 0 3.04 1.708l-.311 1.496a1 1 0 0 1-.979.796H8.605l.208 1H16a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L4.686 5H4a1 1 0 0 1 0-2h1.5a1 1 0 0 1 .979.796L6.939 6h5.329Z"/>
                <path d="M18 4a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0V8h2a1 1 0 1 0 0-2h-2V4Z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Paginación
siguiente.addEventListener("click", () => {
  contadorA += 8;
  contadorB += 8;
  llamaProductos();
});

anterior.addEventListener("click", () => {
  contadorA -= 8;
  contadorB -= 8;
  if (contadorA < 0) {
    contadorA = 0;
    contadorB = 8;
  }
  llamaProductos();
});

// Filtro por texto (opcional si tenés un input con id="buscador")
if (buscador) {
  buscador.addEventListener("input", (e) => {
    textoBuscado = e.target.value.toLowerCase();
    contadorA = 0;
    contadorB = 8;
    llamaProductos();
  });
}
llamaProductos();

// boton del carrito=
productos.addEventListener("click", function (e) {
  if (e.target.closest(".carrito")) {
    // Verificá si el usuario está logueado aquí
  }
});
// --- Carrito: cargamos de localStorage o vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto al carrito o incrementar cantidad
function agregarAlCarrito(id_producto, nombre, precio_unitario) {
  const index = carrito.findIndex((item) => item.id_producto === id_producto);
  if (index !== -1) {
    carrito[index].cantidad++;
  } else {
    carrito.push({ id_producto, nombre, precio_unitario, cantidad: 1 });
  }
  guardarCarrito();
  renderizarCarrito();
}

// Renderizar carrito (igual que antes)
function renderizarCarrito() {
  carritoItems.innerHTML = "";
  let total = 0;
  carrito.forEach((item) => {
    const subtotal = item.cantidad * item.precio_unitario;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.className =
      "flex justify-between items-center border-b border-gray-200 py-2";
    itemDiv.innerHTML = `
        <div>
          <p class="font-medium">${item.nombre}</p>
          <p class="text-sm text-gray-600">Cantidad: ${item.cantidad}</p>
        </div>
        <div class="text-right">
          <p>$${subtotal.toFixed(2)}</p>
        </div>
      `;
    carritoItems.appendChild(itemDiv);
  });
  carritoTotal.textContent = `$${total.toFixed(2)}`;
}

// Vaciar carrito botón
btnVaciar.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  renderizarCarrito();
});

// Escuchar clicks en botones "Añadir al carrito"
productos.addEventListener("click", function (e) {
  const btn = e.target.closest(".carrito");
  if (!btn) return;

  const idStr = btn.getAttribute("data-id");
  const nombre = btn.getAttribute("data-nombre");
  const precioStr = btn.getAttribute("data-precio");

  if (!idStr || !nombre || !precioStr) {
    alert("Error: datos del producto incompletos");
    return;
  }

  const id_producto = parseInt(idStr);
  const precio_unitario = parseFloat(precioStr);

  agregarAlCarrito(id_producto, nombre, precio_unitario);
});

// seccion de comprar mandar la venta y actualizar stock
btnComprar.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión para comprar.");
    return;
  }

  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  // Calcular total y preparar detalles
  let total = 0;
  const detalles = carrito.map((item) => {
    const subtotal = item.cantidad * item.precio_unitario;
    total += subtotal;
    return {
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: subtotal,
    };
  });

  const ventaData = {
    id_usuario,
    total,
    detalles,
  };

  try {
    // Crear la venta
    const respuestaVenta = await fetch(
      "https://funval-backend.onrender.com/ventas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ventaData),
      }
    );

    if (!respuestaVenta.ok) {
      throw new Error("Error al crear la venta");
    }

    // Actualizar stock de productos
    await Promise.all(
      detalles.map(async (detalle) => {
        // Buscar producto en data para obtener stock actual
        const producto = data.find(
          (p) => p.id_producto === detalle.id_producto
        );
        if (!producto) return;

        const nuevoStock = producto.stock - detalle.cantidad;

        // Actualizar stock en backend
        await fetch(
          `https://funval-backend.onrender.com/productos/${detalle.id_producto}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ stock: nuevoStock }),
          }
        );

        // Actualizar stock local también para mantener sincronía visual
        producto.stock = nuevoStock;
      })
    );

    alert("Compra realizada con éxito!");

    // Vaciar carrito y actualizar UI
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    llamaProductos(); // para refrescar productos con stock actualizado
  } catch (error) {
    console.error(error);
    alert("Hubo un error en la compra.");
  }
});

// Inicializar renderizado
renderizarCarrito();
