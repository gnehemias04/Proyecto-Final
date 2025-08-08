const productos = document.querySelector("#productos-container");
const siguiente = document.querySelector("#siguiente");
const anterior = document.querySelector("#anterior");
const buscador = document.querySelector("#buscadorInput"); // opcional, si usás input
const selectCategorias = document.querySelector("#categorias");

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
            <button  class="carrito inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
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
// Primera carga
llamaProductos();
// boton del carrito
productos.addEventListener("click", function (e) {
  if (e.target.closest(".carrito")) {
    // Verificá si el usuario está logueado aquí
    alert("Iniciar sesión para añadir al carrito");
  }
});
